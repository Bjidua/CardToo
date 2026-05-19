import type { Models } from "appwrite";
import {
  ID,
  Permission,
  Role,
  storage,
  tablesDB,
} from "@/lib/appwrite/client";
import { appwriteConfig, getFileViewUrl } from "@/lib/appwrite/config";
import type { UserProfile, UserProfileRow, UserRole } from "@/types";

// Mendefinisikan Table ID dari konfigurasi global Appwrite untuk database profil pengguna
const tableId = appwriteConfig.tables.userProfiles;

// Mendefinisikan Bucket ID dari konfigurasi global Appwrite untuk folder unggahan avatar profil
const bucketId = appwriteConfig.buckets.profileAvatars;

// Tipe data representasi dokumen Profil di database Appwrite yang menggabungkan model baris bawaan
type UserProfileRecord = Models.Row & UserProfileRow;

/**
 * Normalisasi pesan kesalahan (error handling) yang dilemparkan oleh backend SDK Appwrite.
 * @param error Objek error tidak dikenal
 */
const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses profil pengguna.";

/**
 * Memetakan baris profil dari database ke antarmuka standar aplikasi.
 * Berfungsi untuk mentransformasi properti internal Appwrite ($id) ke properti standar UI (id).
 * @param row Baris data mentah dari database
 */
const toUserProfile = (
  row: UserProfileRecord
): UserProfile => ({
  id: row.$id,
  username: row.username,
  email: row.email,
  role: row.role,
  full_name: row.full_name,
  phone: row.phone,
  avatar_file_id: row.avatar_file_id,
  avatar_url: row.avatar_url,
  is_active: row.is_active,
});

/**
 * Mengunggah file avatar baru ke Appwrite Storage.
 * Menerapkan perizinan (permissions) agar hanya pemilik profil bersangkutan yang memiliki
 * hak akses penuh untuk melakukan pembaruan (update) atau penghapusan (delete).
 * 
 * @param file Objek file gambar avatar dari form upload
 * @param userId ID pengguna pemilik avatar
 */
const uploadProfileAvatar = async (file: File, userId: string) => {
  // Melakukan unggah file ke bucket penyimpanan avatar profil
  const uploaded = await storage.createFile({
    bucketId,
    fileId: ID.unique(), // Membuat file ID unik otomatis
    file,
    permissions: [
      Permission.read(Role.any()), // Semua orang (guest/user) boleh melihat avatar ini
      Permission.update(Role.user(userId)), // Hanya user pemilik yang boleh merubah file ini
      Permission.delete(Role.user(userId)), // Hanya user pemilik yang boleh menghapus file ini
    ],
  });

  return {
    // Mengembalikan ID file yang berhasil diunggah
    fileId: uploaded.$id,
    // Mengambil URL akses gambar publik berdasarkan bucketId dan fileId-nya
    url: getFileViewUrl(bucketId, uploaded.$id),
  };
};

/**
 * Kumpulan layanan untuk mengatur manajemen profil pengguna setelah autentikasi.
 * (Menyimpan informasi tambahan seperti role, nama lengkap, phone, avatar)
 */
export const profileService = {
  /**
   * Membuat rekaman data profil baru di database.
   * Biasanya dipanggil secara internal sesaat setelah pengguna berhasil mendaftar (register) pertama kali.
   * 
   * @param input Data dasar profil baru (userId, username, email, dan role pilihan)
   */
  async createProfile(input: {
    userId: string;
    username: string;
    email: string;
    role?: UserRole;
  }) {
    try {
      // Menulis baris data dokumen profil baru di Appwrite Database
      const row = await tablesDB.createRow<UserProfileRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: input.userId, // Menggunakan userId sebagai ID baris agar relasi satu-ke-satu terjaga
        data: {
          username: input.username,
          email: input.email,
          role: input.role || "buyer", // Role default adalah pembeli (buyer) jika tidak dispesifikasikan
          full_name: null, // Kolom nama lengkap dikosongkan terlebih dahulu saat pendaftaran awal
          phone: null,     // Kolom no handphone dikosongkan terlebih dahulu
          avatar_file_id: null,
          avatar_url: null,
          is_active: true, // Profil aktif secara default saat akun dibuat
        },
        permissions: [
          // Mengamankan data profil agar dibaca, diedit, dan dihapus hanya oleh pemilik userId terkait
          Permission.read(Role.user(input.userId)),
          Permission.update(Role.user(input.userId)),
          Permission.delete(Role.user(input.userId)),
        ],
      });
      // Mengubah respon database mentah ke format UI objek
      return toUserProfile(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengambil data profil dari seorang pengguna berdasarkan ID-nya.
   * Digunakan hampir di semua tempat yang membutuhkan informasi role (buyer/seller)
   * atau info kontak dari user aktif.
   * 
   * @param userId ID pengguna yang ingin diambil datanya
   */
  async getProfile(userId: string) {
    try {
      // Membaca baris tunggal dari tabel user profiles
      const row = await tablesDB.getRow<UserProfileRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: userId,
      });
      return toUserProfile(row);
    } catch {
      // Jika profil tidak ditemukan (belum terbuat) atau error, kembalikan null untuk fallback penanganan di UI
      return null;
    }
  },

  /**
   * Melakukan pembaruan partial (sebagian) pada profil pengguna 
   * tanpa mengunggah/mengubah file avatar secara langsung.
   * 
   * @param userId ID pengguna pemilik profil
   * @param data Kumpulan kolom data yang ingin diubah (sebagian)
   */
  async updateProfile(
    userId: string,
    data: Partial<
      Pick<
        UserProfileRow,
        | "username"
        | "role"
        | "full_name"
        | "phone"
        | "avatar_file_id"
        | "avatar_url"
        | "is_active"
      >
    >
  ) {
    try {
      // Mengupdate baris dokumen profil pengguna di Appwrite
      const row = await tablesDB.updateRow<UserProfileRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: userId,
        data,
      });
      return toUserProfile(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Sama seperti updateProfile, namun fungsi ini juga menangani 
   * proses upload file avatar (jika dilampirkan) ke Appwrite Storage sebelum 
   * menyimpan perubahan data teks ke database.
   * 
   * @param userId - ID pengguna
   * @param data - Data teks profil yang berubah
   * @param avatarFile - File gambar opsional
   */
  async updateProfileWithAvatar(
    userId: string,
    data: Partial<
      Pick<
        UserProfileRow,
        "username" | "role" | "full_name" | "phone" | "is_active"
      >
    >,
    avatarFile?: File | null
  ) {
    try {
      // Mengambil data profil yang ada saat ini untuk mendapatkan data avatar lama jika tidak diganti
      const existing = await tablesDB.getRow<UserProfileRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: userId,
      });

      // Proses upload gambar baru jika ada parameter file avatar baru yang dikirimkan
      const uploadedAvatar = avatarFile
        ? await uploadProfileAvatar(avatarFile, userId)
        : null;

      // Update seluruh data profil yang diperbarui beserta relasi avatar file ID baru
      const row = await tablesDB.updateRow<UserProfileRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: userId,
        data: {
          ...data,
          // Gunakan ID file avatar baru jika berhasil diunggah, jika tidak pertahankan ID avatar yang lama
          avatar_file_id: uploadedAvatar?.fileId || existing.avatar_file_id,
          // Gunakan URL avatar baru jika berhasil diunggah, jika tidak pertahankan URL avatar lama
          avatar_url: uploadedAvatar?.url || existing.avatar_url,
        },
      });

      return toUserProfile(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
