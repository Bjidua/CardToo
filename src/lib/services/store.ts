import type { Models } from "appwrite";
import {
  ID,
  Permission,
  Query,
  Role,
  storage,
  tablesDB,
} from "@/lib/appwrite/client";
import { appwriteConfig, getFileViewUrl } from "@/lib/appwrite/config";
import { buildSlugBase, withSlugSuffix } from "@/lib/slug";
import type {
  SellerOnboardingInput,
  Store,
  StoreRow,
  UpdateStoreInput,
} from "@/types";

// Menentukan Table ID dari konfigurasi global Appwrite untuk database Toko (Stores)
const tableId = appwriteConfig.tables.stores;

// Menentukan Bucket ID dari konfigurasi global Appwrite untuk aset Toko (Store Assets)
const bucketId = appwriteConfig.buckets.storeAssets;

// Tipe data representasi dokumen Toko di database Appwrite yang menggabungkan model baris bawaan
type StoreRecord = Models.Row & StoreRow;

/** 
 * Normalisasi objek error menjadi string pesan kesalahan.
 * @param error Objek error tidak dikenal
 */
const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses data toko.";

/**
 * Utilitas untuk mengubah nama toko menjadi format URL (slug) yang valid.
 * Contoh: "Toko Budi 123" -> "toko-budi-123"
 * 
 * @param value Nama mentah toko
 */
export const slugifyStoreName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Hapus karakter non-alfanumerik kecuali spasi dan strip
    .replace(/\s+/g, "-")        // Ubah spasi beruntun menjadi strip tunggal
    .replace(/-+/g, "-")         // Ubah strip beruntun menjadi strip tunggal
    .replace(/^-|-$/g, "");      // Bersihkan strip di awal dan akhir string

/**
 * Memetakan baris data Appwrite (StoreRecord) ke antarmuka Store untuk UI.
 * Memberikan nilai default yang aman jika beberapa kolom di database kosong.
 * 
 * @param row Rekaman baris data mentah dari database
 */
const toStore = (
  row: StoreRecord
): Store => ({
  id: row.$id,
  name: row.store_name,
  location: row.location || "Indonesia",
  createdAt: row.$createdAt,
  rating: "0.0",   // Nilai placeholder default karena rating belum tersimpan di database toko langsung
  followers: "0",  // Nilai placeholder default
  isVerified: row.is_verified,
  coverImage: row.banner_url,
  description: row.description || "Belum ada deskripsi toko.",
  performance: {   // Nilai default untuk performa operasional toko
    chat: "Info",
    process: "-",
    onTime: "0%",
  },
  products: [],
  ownerUserId: row.owner_user_id,
  slug: row.store_slug,
  status: row.status,
  logoUrl: row.logo_url,
  bannerUrl: row.banner_url,
});

/**
 * Memastikan slug toko unik di database. Jika slug sudah ada, 
 * akan ditambahkan angka (suffix) di belakangnya secara inkremental (misal: toko-budi-2).
 * 
 * @param baseSlug - Slug mentah hasil slugifyStoreName
 */
const ensureUniqueSlug = async (baseSlug: string) => {
  const normalizedBaseSlug = buildSlugBase(baseSlug, "store");
  let slug = normalizedBaseSlug;
  let suffix = 1;

  while (true) {
    // Cari apakah ada baris toko yang memiliki slug yang sama
    const { total } = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId,
      queries: [Query.equal("store_slug", [slug])],
    });

    // Jika jumlah (total) = 0, artinya slug belum dipakai dan aman digunakan
    if (total === 0) return slug;

    // Jika slug sudah terpakai, tambahkan suffix angka (misal: toko-budi-1, toko-budi-2) dan ulangi pencarian
    slug = withSlugSuffix(normalizedBaseSlug, suffix);
    suffix += 1;
  }
};

/**
 * Mengunggah file aset (seperti banner atau logo) ke bucket penyimpanan Appwrite.
 * 
 * @param file Objek berkas file gambar
 * @param ownerUserId ID pengguna pemilik toko
 */
const uploadStoreAsset = async (file: File, ownerUserId: string) => {
  const uploaded = await storage.createFile({
    bucketId,
    fileId: ID.unique(),
    file,
    permissions: [
      // Membaca file diizinkan untuk siapa saja (publik)
      Permission.read(Role.any()),
      // Menulis dan menghapus file hanya diizinkan untuk pemilik toko
      Permission.update(Role.user(ownerUserId)),
      Permission.delete(Role.user(ownerUserId)),
    ],
  });

  return {
    fileId: uploaded.$id,
    url: getFileViewUrl(bucketId, uploaded.$id),
  };
};

/**
 * Layanan untuk mengelola entitas Toko (Store), mulai dari pendaftaran 
 * toko baru (Onboarding) hingga edit profil toko.
 */
export const storeService = {
  /**
   * Mengambil detail toko spesifik berdasarkan ID Toko.
   * 
   * @param storeId ID unik toko
   */
  async getStoreById(storeId: string) {
    try {
      const row = await tablesDB.getRow<StoreRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: storeId,
      });
      return toStore(row);
    } catch {
      return null;
    }
  },

  /**
   * Mengambil detail toko milik pengguna tertentu (sering digunakan 
   * untuk pengecekan hak akses dan dashboard penjual).
   * 
   * @param ownerUserId - ID pemilik/penjual
   */
  async getStoreByOwnerUserId(ownerUserId: string) {
    try {
      const result = await tablesDB.listRows<StoreRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("owner_user_id", [ownerUserId])],
      });

      const row = result.rows[0];
      return row ? toStore(row) : null;
    } catch {
      return null;
    }
  },

  /**
   * Mendaftarkan toko baru untuk pengguna (Seller Onboarding).
   * Satu akun pengguna hanya diperbolehkan memiliki maksimal satu toko.
   * Akan otomatis memastikan slug url toko tersebut unik.
   * 
   * @param ownerUserId - ID pengguna yang membuka toko
   * @param input - Informasi nama toko, dll.
   */
  async createStore(ownerUserId: string, input: SellerOnboardingInput) {
    try {
      // Validasi: Pastikan user belum memiliki toko aktif lainnya
      const existing = await this.getStoreByOwnerUserId(ownerUserId);
      if (existing) {
        throw new Error("Akun ini sudah memiliki toko.");
      }

      // Buat slug bersih dan pastikan keunikannya di database
      const baseSlug = slugifyStoreName(input.preferredSlug || input.storeName);
      const uniqueSlug = await ensureUniqueSlug(baseSlug);

      // Buat dokumen toko baru
      const row = await tablesDB.createRow<StoreRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: ID.unique(),
        data: {
          store_name: input.storeName.trim(),
          store_slug: uniqueSlug,
          location: "Indonesia",
          description: input.description?.trim() || null,
          logo_file_id: null,
          logo_url: null,
          banner_file_id: null,
          banner_url: null,
          is_verified: false, // Toko baru berstatus belum terverifikasi
          status: "active",
          owner_user_id: ownerUserId,
        },
        permissions: [
          // Pembacaan profil toko diizinkan publik
          Permission.read(Role.any()),
          // Perubahan dan penghapusan hanya boleh dipicu pemilik toko
          Permission.update(Role.user(ownerUserId)),
          Permission.delete(Role.user(ownerUserId)),
        ],
      });

      return toStore(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Memperbarui profil toko (nama, deskripsi, lokasi, dan banner).
   * Jika ada file banner, akan diunggah ke storage Appwrite.
   * 
   * @param ownerUserId - ID penjual (untuk verifikasi otorisasi)
   * @param storeId - ID toko yang diedit
   * @param input - Data toko terbaru
   */
  async updateStore(
    ownerUserId: string,
    storeId: string,
    input: UpdateStoreInput
  ) {
    try {
      // Dapatkan dokumen toko aktif terlebih dahulu
      const existing = await tablesDB.getRow<StoreRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: storeId,
      });

      // Validasi kepemilikan: Pastikan user yang mengubah adalah pemilik resmi toko
      if (existing.owner_user_id !== ownerUserId) {
        throw new Error("Anda tidak memiliki akses ke toko ini.");
      }

      // Unggah file banner baru ke storage jika dikirim oleh pembeli
      const uploadedBanner = input.bannerFile
        ? await uploadStoreAsset(input.bannerFile, ownerUserId)
        : null;

      // Update data toko ke database
      const row = await tablesDB.updateRow<StoreRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: storeId,
        data: {
          store_name: input.storeName.trim(),
          location: input.location?.trim() || existing.location || "Indonesia",
          description: input.description?.trim() || null,
          banner_file_id: uploadedBanner?.fileId || existing.banner_file_id,
          banner_url: uploadedBanner?.url || existing.banner_url,
        },
      });

      return toStore(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
