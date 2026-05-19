import type { Models } from "appwrite";
import { ID, Permission, Query, Role, tablesDB } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import { productService } from "@/lib/services/product";
import { storeService } from "@/lib/services/store";
import type { FavoriteItem, FavoriteRow, Product, Store } from "@/types";

// Menentukan Table ID dari konfigurasi global Appwrite untuk database Produk Favorit (Favorites)
const tableId = appwriteConfig.tables.favorites;

// Tipe data representasi dokumen Produk Favorit di database Appwrite
type FavoriteRecord = Models.Row & FavoriteRow;

/** Type guard untuk memastikan objek tidak null dan merupakan Product yang valid */
const isProduct = (value: Product | null): value is Product => Boolean(value);

/** Type guard untuk memastikan objek tidak null dan merupakan Store yang valid */
const isStore = (value: Store | null): value is Store => Boolean(value);

/**
 * Normalisasi error agar mengembalikan pesan yang lebih bisa dibaca pengguna.
 * @param error Objek error tidak dikenal
 */
const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses data favorit.";

/**
 * Fungsi helper internal untuk mencari data baris favorit berdasarkan User ID dan Product ID.
 * Menggunakan query Appwrite `Query.equal`.
 * 
 * @param userId - ID pembeli
 * @param productId - ID produk yang difavoritkan
 * @returns Object FavoriteRecord jika ditemukan, null jika belum difavoritkan
 */
const getFavoriteRow = async (userId: string, productId: string) => {
  const result = await tablesDB.listRows<FavoriteRecord>({
    databaseId: appwriteConfig.databaseId,
    tableId,
    queries: [Query.equal("user_id", [userId]), Query.equal("product_id", [productId])],
  });

  return result.rows[0] || null;
};

/**
 * Kumpulan fungsi untuk mengelola interaksi daftar favorit (wishlist) pengguna
 * dengan backend Appwrite.
 */
export const favoriteService = {
  /**
   * Mengambil sekumpulan ID produk yang telah difavoritkan oleh seorang user.
   * Sangat berguna untuk sinkronisasi state UI (misal ikon love pada daftar produk).
   * 
   * @param userId - ID pengguna yang sedang aktif
   * @returns Array of string yang berisi Product ID
   */
  async listFavoriteProductIds(userId: string) {
    try {
      // Ambil seluruh baris favorit terikat user_id terkait
      const result = await tablesDB.listRows<FavoriteRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("user_id", [userId])],
      });

      return result.rows.map((row) => row.product_id);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengambil daftar lengkap produk favorit untuk dirender di halaman Wishlist.
   * Melakukan fetching ID produk, lalu memuat metadata produk dan metadata toko.
   * 
   * @param userId - ID pengguna
   * @returns Array dari `FavoriteItem` yang berisi info lengkap harga, judul, gambar, dll.
   */
  async listFavorites(userId: string) {
    try {
      // 1. Dapatkan daftar seluruh ID produk yang difavoritkan oleh user
      const productIds = await this.listFavoriteProductIds(userId);
      
      // 2. Tarik detail produk secara paralel untuk setiap ID produk favorit
      const products = await Promise.all(
        productIds.map((productId) => productService.getProductById(productId))
      );

      // Saring data untuk menyisihkan produk null (produk terhapus/tidak aktif)
      const validProducts = products.filter(isProduct);
      
      // 3. Kumpulkan ID toko unik dari produk-produk tersebut
      const uniqueStoreIds = Array.from(
        new Set(validProducts.map((product) => product.storeId).filter(Boolean))
      ) as string[];

      // 4. Muat detail informasi toko secara paralel
      const stores = await Promise.all(
        uniqueStoreIds.map((storeId) => storeService.getStoreById(storeId))
      );
      
      // Petakan nama toko ke ID toko menggunakan key-value Map agar pencarian berkecepatan tinggi O(1)
      const storesById = new Map(stores.filter(isStore).map((store) => [store.id, store.name]));

      // 5. Normalisasi bentuk keluaran produk favorit
      return validProducts.map(
        (product): FavoriteItem => ({
          id: `${userId}:${product.id}`,
          productId: product.id,
          storeId: product.storeId,
          title: product.title,
          shopName:
            (product.storeId && storesById.get(product.storeId)) || "Toko CardToo",
          price: product.price,
          image: product.image || null,
        })
      );
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Menambahkan sebuah produk ke daftar favorit pengguna.
   * Mengatur `Permission` agar hanya owner (pengguna itu sendiri) yang bisa melihat
   * dan menghapus row favorit ini demi keamanan privasi.
   * 
   * @param userId - ID pengguna
   * @param productId - ID produk yang ditambahkan
   */
  async addFavorite(userId: string, productId: string) {
    try {
      // Pastikan data favorit ini tidak terdaftar ganda (duplikat) di database
      const existing = await getFavoriteRow(userId, productId);
      if (existing) return existing.$id;

      // Buat dokumen record baru di tabel favorit
      const row = await tablesDB.createRow<FavoriteRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: ID.unique(),
        data: {
          user_id: userId,
          product_id: productId,
        },
        permissions: [
          // Batasi hak akses penuh hanya untuk pemilik (pembeli bersangkutan)
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ],
      });

      return row.$id;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Menghapus produk dari daftar favorit pengguna.
   * 
   * @param userId - ID pengguna
   * @param productId - ID produk yang dihapus
   */
  async removeFavorite(userId: string, productId: string) {
    try {
      // Cari baris favorit yang dicocokkan dengan user dan produk terkait
      const existing = await getFavoriteRow(userId, productId);
      if (!existing) return;

      // Hapus baris data tersebut dari database
      await tablesDB.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: existing.$id,
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengganti (toggle) status favorit. Jika sudah ada, maka akan dihapus.
   * Jika belum ada, maka akan ditambahkan.
   * 
   * @param userId - ID pengguna
   * @param productId - ID produk yang di-toggle
   * @returns `true` jika produk akhirnya menjadi favorit, `false` jika tidak.
   */
  async toggleFavorite(userId: string, productId: string) {
    const existing = await getFavoriteRow(userId, productId);
    
    // Skenario A: Jika sudah ada, trigger hapus favorit
    if (existing) {
      await this.removeFavorite(userId, productId);
      return false;
    }

    // Skenario B: Jika belum ada, trigger tambah favorit
    await this.addFavorite(userId, productId);
    return true;
  },
};
