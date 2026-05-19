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
  CreateProductInput,
  Product,
  ProductCategoryValue,
  ProductCondition,
  ProductConditionValue,
  ProductRow,
  UpdateProductInput,
} from "@/types";

// Menentukan Table ID dari konfigurasi global Appwrite untuk database Produk (Products)
const tableId = appwriteConfig.tables.products;

// Menentukan Bucket ID dari konfigurasi global Appwrite untuk gambar produk (Product Images)
const bucketId = appwriteConfig.buckets.productImages;

// Tipe data representasi dokumen Produk di database Appwrite yang menggabungkan model baris bawaan
type ProductRecord = Models.Row & ProductRow;

/** 
 * Normalisasi objek error menjadi pesan kesalahan teks.
 * @param error Objek error tidak dikenal
 */
const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses data produk.";

// Map penentu pelabelan kondisi fisik kartu untuk pembeli
const conditionLabelMap: Record<ProductConditionValue, ProductCondition> = {
  mint: "Mint",
  near_mint: "Near Mint",
  excellent: "Excellent",
  good: "Good",
  played: "Played",
};

// Map penentu pelabelan nama kategori kartu TCG
const categoryLabelMap: Record<ProductCategoryValue, string> = {
  pokemon: "Pokemon",
  onepiece: "Onepiece",
  boboiboy: "Boboiboy",
  yugioh: "Yu-Gi-Oh!",
  magic: "Magic",
  digimon: "Digimon",
  sports: "Sports",
  other: "Other",
};

/**
 * Memformat status kondisi fisik kartu agar ramah dibaca di UI.
 * @param value Kode kondisi fisik kartu ("mint" | "near_mint" | dll)
 */
export const formatProductCondition = (value?: ProductConditionValue | null) =>
  value ? conditionLabelMap[value] : undefined;

/**
 * Memformat kategori produk agar ramah dibaca di UI.
 * @param value Kode kategori produk ("pokemon" | "onepiece" | dll)
 */
export const formatProductCategory = (value?: ProductCategoryValue | null) =>
  value ? categoryLabelMap[value] : "Other";

/**
 * Menormalkan format string kondisi fisik kartu yang diinputkan pengguna ke standar database.
 * @param value Teks kondisi fisik kartu
 */
export const normalizeProductCondition = (
  value: string
): ProductConditionValue | null => {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "_");
  const allowed: ProductConditionValue[] = [
    "mint",
    "near_mint",
    "excellent",
    "good",
    "played",
  ];
  return allowed.includes(normalized as ProductConditionValue)
    ? (normalized as ProductConditionValue)
    : null;
};

/**
 * Menormalkan format string kategori kartu yang diinputkan pengguna ke standar database.
 * @param value Teks kategori kartu
 */
export const normalizeProductCategory = (
  value: string
): ProductCategoryValue | null => {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const map: Record<string, ProductCategoryValue> = {
    pokemon: "pokemon",
    onepiece: "onepiece",
    boboiboy: "boboiboy",
    yugioh: "yugioh",
    yugiohcard: "yugioh",
    magic: "magic",
    digimon: "digimon",
    sports: "sports",
    other: "other",
  };
  return map[normalized] || null;
};

/**
 * Utilitas untuk mengubah judul produk menjadi format URL (slug) yang valid.
 * Contoh: "Pokemon Pikachu Rare 1st Edition" -> "pokemon-pikachu-rare-1st-edition"
 * @param value Judul produk mentah
 */
export const slugifyProductTitle = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Hapus karakter non-alfanumerik kecuali spasi dan strip
    .replace(/\s+/g, "-")        // Ubah spasi beruntun menjadi strip tunggal
    .replace(/-+/g, "-")         // Ubah strip beruntun menjadi strip tunggal
    .replace(/^-|-$/g, "");      // Bersihkan strip di awal dan akhir string

/**
 * Utilitas untuk memetakan object Row dari database Appwrite
 * ke antarmuka `Product` yang bisa digunakan oleh komponen UI.
 * 
 * @param row Baris data produk dari Appwrite
 * @returns Objek produk yang siap digunakan di React
 */
const toProduct = (
  row: ProductRecord
): Product => ({
  id: row.$id,
  title: row.title,
  price: row.price,
  condition: formatProductCondition(row.condition),
  category: formatProductCategory(row.category),
  image: row.cover_url,
  stock: row.stock,
  storeId: row.store_id,
  status: row.status,
  description: row.description,
  slug: row.slug,
  gallery: row.gallery_urls || [],
});

/**
 * Memastikan slug produk unik di database. Jika slug sudah ada, 
 * akan ditambahkan angka (suffix) di belakangnya secara inkremental (misal: pikachu-2).
 * 
 * @param baseSlug - Slug mentah hasil slugifyProductTitle
 */
const ensureUniqueSlug = async (baseSlug: string) => {
  const normalizedBaseSlug = buildSlugBase(baseSlug, "product");
  let slug = normalizedBaseSlug;
  let suffix = 1;

  while (true) {
    // Cari apakah ada baris produk yang memiliki slug yang sama
    const { total } = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId,
      queries: [Query.equal("slug", [slug])],
    });

    // Jika total = 0, artinya slug belum dipakai dan aman digunakan
    if (total === 0) return slug;

    // Jika slug sudah terpakai, tambahkan suffix angka dan ulangi pencarian
    slug = withSlugSuffix(normalizedBaseSlug, suffix);
    suffix += 1;
  }
};

/**
 * Mengunggah file sampul produk ke bucket penyimpanan Appwrite.
 * 
 * @param file Objek berkas file gambar sampul
 * @param ownerUserId ID pengguna penjual/pemilik toko
 */
const uploadCoverImage = async (file: File, ownerUserId: string) => {
  const uploaded = await storage.createFile({
    bucketId,
    fileId: ID.unique(),
    file,
    permissions: [
      // Membaca file diizinkan publik
      Permission.read(Role.any()),
      // Menulis dan menghapus file hanya diizinkan untuk penjual pemilik produk
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
 * Objek layanan utama yang bertanggung jawab mengatur interaksi database
 * Appwrite untuk entitas "Products" (Produk TCG).
 */
export const productService = {
  /**
   * Mengambil daftar produk publik dengan status "published".
   * Mendukung filter opsional berdasarkan kategori atau toko.
   * 
   * @param filters - Objek opsional untuk menyaring data berdasarkan kategori atau ID Toko
   * @returns Array dari Produk
   */
  async listPublishedProducts(filters?: {
    category?: ProductCategoryValue;
    storeId?: string;
  }) {
    try {
      const queries = [Query.equal("status", ["published"])];

      // Terapkan filter kategori jika dikirimkan oleh pemanggil
      if (filters?.category) {
        queries.push(Query.equal("category", [filters.category]));
      }

      // Terapkan filter toko asal produk jika dikirimkan oleh pemanggil
      if (filters?.storeId) {
        queries.push(Query.equal("store_id", [filters.storeId]));
      }

      const result = await tablesDB.listRows<ProductRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries,
      });

      return result.rows.map(toProduct);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengambil seluruh produk yang dimiliki oleh seorang penjual (seller) tertentu
   * untuk ditampilkan di dashboard toko penjual tersebut. Termasuk yang masih berstatus "draft".
   * 
   * @param storeId - ID Toko
   * @returns Array produk milik toko tersebut
   */
  async listSellerProducts(storeId: string) {
    try {
      const result = await tablesDB.listRows<ProductRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("store_id", [storeId])],
      });

      return result.rows.map(toProduct);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mencari dan mengambil satu produk spesifik berdasarkan ID uniknya.
   * 
   * @param productId - ID produk yang akan dicari
   * @returns Objek produk jika ditemukan, atau null jika tidak ada/error
   */
  async getProductById(productId: string) {
    try {
      const row = await tablesDB.getRow<ProductRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: productId,
      });
      return toProduct(row);
    } catch {
      return null;
    }
  },

  /**
   * Membuat entri produk baru di database Appwrite.
   * Juga menangani pengunggahan gambar sampul produk ke Appwrite Storage secara bersamaan.
   * 
   * @param ownerUserId - ID penjual/pemilik toko
   * @param input - Objek data produk (termasuk file gambar jika ada)
   * @returns Objek produk yang baru dibuat
   */
  async createProduct(ownerUserId: string, input: CreateProductInput) {
    try {
      // Pastikan slug produk unik berdasarkan judul produk
      const slug = await ensureUniqueSlug(slugifyProductTitle(input.title));
      
      // Unggah berkas gambar sampul jika dilampirkan oleh pengguna
      const uploaded = input.coverFile
        ? await uploadCoverImage(input.coverFile, ownerUserId)
        : null;

      // Buat rekaman baris produk baru di database
      const row = await tablesDB.createRow<ProductRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: ID.unique(),
        data: {
          store_id: input.storeId,
          title: input.title.trim(),
          slug,
          category: input.category,
          price: input.price,
          stock: input.stock,
          condition: input.condition,
          description: input.description?.trim() || null,
          cover_file_id: uploaded?.fileId || null,
          cover_url: uploaded?.url || null,
          gallery_file_ids: uploaded?.fileId ? [uploaded.fileId] : null,
          gallery_urls: uploaded?.url ? [uploaded.url] : null,
          status: "published", // Default langsung rilis/publish ke marketplace
        },
        permissions: [
          // Pembacaan diizinkan publik
          Permission.read(Role.any()),
          // Mutasi update & hapus hanya diizinkan untuk pemilik produk
          Permission.update(Role.user(ownerUserId)),
          Permission.delete(Role.user(ownerUserId)),
        ],
      });

      return toProduct(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Memperbarui data produk yang sudah ada di database.
   * Akan memeriksa jika ada perubahan gambar, maka gambar lama tidak di-update 
   * jika tidak ada gambar baru. Memastikan `slug` tetap unik jika judul berubah.
   * 
   * @param ownerUserId - ID penjual (untuk verifikasi perizinan)
   * @param productId - ID produk yang akan diedit
   * @param input - Data produk terbaru
   */
  async updateProduct(
    ownerUserId: string,
    productId: string,
    input: UpdateProductInput
  ) {
    try {
      // Ambil data produk lama terlebih dahulu
      const existing = await tablesDB.getRow<ProductRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: productId,
      });

      // Unggah gambar baru jika dilampirkan
      const uploaded = input.coverFile
        ? await uploadCoverImage(input.coverFile, ownerUserId)
        : null;
      
      // Jika judul produk berubah, buat slug unik baru. Jika tidak berubah, gunakan slug lama
      const nextSlug =
        slugifyProductTitle(input.title) === slugifyProductTitle(existing.title)
          ? existing.slug
          : await ensureUniqueSlug(slugifyProductTitle(input.title));

      // Lakukan pembaruan baris produk di database
      const row = await tablesDB.updateRow<ProductRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: productId,
        data: {
          title: input.title.trim(),
          slug: nextSlug,
          category: input.category,
          price: input.price,
          stock: input.stock,
          condition: input.condition,
          description: input.description?.trim() || null,
          cover_file_id: uploaded?.fileId || existing.cover_file_id,
          cover_url: uploaded?.url || existing.cover_url,
          gallery_file_ids:
            uploaded?.fileId
              ? [uploaded.fileId]
              : existing.gallery_file_ids,
          gallery_urls:
            uploaded?.url ? [uploaded.url] : existing.gallery_urls,
        },
      });

      return toProduct(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Menghapus sebuah produk secara permanen dari database Appwrite.
   * (Catatan: Ini akan error jika dijalankan oleh user yang bukan owner produk tersebut).
   * 
   * @param productId - ID produk yang akan dihapus
   */
  async deleteProduct(productId: string) {
    try {
      // Hapus baris produk di database
      await tablesDB.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: productId,
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
