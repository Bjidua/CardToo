import type { Models } from "appwrite";
import { account, ID } from "@/lib/appwrite/client";
import type { AuthUser, LoginInput, RegisterInput } from "@/types";

/**
 * Utilitas untuk memetakan object User dari Appwrite ke format AuthUser internal.
 * 
 * @param user Object raw User dari Appwrite SDK
 * @returns Objek user yang lebih ringkas dan sesuai dengan antarmuka UI
 */
const toAuthUser = (
  user: Models.User<Models.Preferences>
): AuthUser => ({
  // Memetakan field ID dari $id milik Appwrite ke property id
  id: user.$id,
  // Memetakan nama tampilan pengguna
  name: user.name,
  // Memetakan alamat email pengguna
  email: user.email,
});

/**
 * Normalisasi error yang dilempar oleh Appwrite menjadi pesan yang ramah pengguna.
 * Jika error bertipe Error, kembalikan pesannya. Jika tidak, tampilkan pesan fallback standar.
 */
const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Terjadi kesalahan pada autentikasi.";

/**
 * Kumpulan layanan untuk menangani Autentikasi menggunakan SDK Appwrite.
 * Meliputi registrasi, login, logout, dan manajemen sesi.
 */
export const authService = {
  /**
   * Mengambil data akun pengguna yang sedang login (sesi aktif).
   * 
   * @returns Objek AuthUser jika ada sesi aktif, atau null jika tidak ada/error.
   */
  async getCurrentAccount() {
    try {
      // Memanggil API get() untuk mendeteksi sesi aktif di browser pengguna
      const user = await account.get();
      // Mengubah respon model user bawaan Appwrite ke model internal UI
      return toAuthUser(user);
    } catch {
      // Jika tidak ada sesi aktif atau terjadi error jaringan, return null
      return null;
    }
  },

  /**
   * Mendaftarkan pengguna baru ke platform CardToo.
   * Fungsi ini akan langsung membuat sesi login setelah registrasi berhasil.
   * 
   * @param input Objek berisi username, email, dan password dari form registrasi
   * @returns Objek AuthUser dari pengguna yang baru terdaftar
   */
  async register(input: RegisterInput) {
    try {
      // Membuat entitas user baru di Appwrite dengan ID acak unik (ID.unique())
      const created = await account.create({
        userId: ID.unique(),
        email: input.email,
        password: input.password,
        name: input.username,
      });

      // Secara otomatis membuat sesi baru agar pengguna langsung berstatus login setelah daftar
      await account.createEmailPasswordSession({
        email: input.email,
        password: input.password,
      });

      // Mengembalikan entitas user yang baru saja dibuat dalam format UI
      return toAuthUser(created);
    } catch (error) {
      // Menangkap error dari Appwrite dan melemparkannya kembali dengan teks normalisasi
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Melakukan proses masuk (login) dengan email dan password.
   * Akan membuat sesi di backend Appwrite.
   * 
   * @param input Email dan password yang diisikan pengguna
   * @returns Objek AuthUser pengguna yang login
   */
  async login(input: LoginInput) {
    try {
      // Membuat sesi login email-password baru di server Appwrite
      await account.createEmailPasswordSession({
        email: input.email,
        password: input.password,
      });
      // Mengambil data lengkap profil pengguna setelah sesi berhasil dibuat
      const user = await account.get();
      return toAuthUser(user);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengakhiri sesi pengguna yang aktif saat ini.
   */
  async logout() {
    try {
      // Menghapus token/sesi aktif saat ini (sessionId: "current") di server Appwrite
      await account.deleteSession({ sessionId: "current" });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Memperbarui kata sandi pengguna (khusus untuk pengguna yang sedang login).
   * 
   * @param password Kata sandi baru
   * @param oldPassword Kata sandi lama untuk validasi
   */
  async updatePassword(password: string, oldPassword: string) {
    try {
      // Memperbarui password lama dengan password baru di server
      await account.updatePassword({
        password,
        oldPassword,
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengambil daftar semua sesi login yang sedang aktif untuk pengguna ini
   * di berbagai perangkat atau browser.
   * 
   * @returns Array dari objek sesi Appwrite
   */
  async listSessions() {
    try {
      // Mengambil daftar sesi aktif dari server
      const result = await account.listSessions();
      return result.sessions;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengakhiri / menghapus salah satu sesi login spesifik berdasarkan ID sesinya.
   * 
   * @param sessionId ID Sesi yang ingin diakhiri
   */
  async logoutSession(sessionId: string) {
    try {
      // Mengakhiri sesi spesifik (misal dari perangkat lain yang tidak digunakan)
      await account.deleteSession({ sessionId });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengakhiri semua sesi login secara global di semua perangkat
   * untuk pengguna yang sedang aktif.
   */
  async logoutAllSessions() {
    try {
      // Mengapus seluruh sesi aktif dari semua perangkat secara bersamaan
      await account.deleteSessions();
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
