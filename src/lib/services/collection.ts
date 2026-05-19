import type { Models } from "appwrite";
import { ID, Permission, Query, Role, tablesDB } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import { formatProductCondition } from "@/lib/services/product";
import type {
  Collection,
  CollectionItem,
  CollectionItemRow,
  CollectionRow,
  ProductConditionValue,
} from "@/types";

// Mendefinisikan Table ID untuk grup koleksi (Collections)
const collectionsTableId = appwriteConfig.tables.collections;

// Mendefinisikan Table ID untuk barang/kartu di dalam koleksi (Collection Items)
const collectionItemsTableId = appwriteConfig.tables.collectionItems;

// Representasi tipe data baris database grup koleksi
type CollectionRecord = Models.Row & CollectionRow;

// Representasi tipe data baris database item kartu dalam koleksi
type CollectionItemRecord = Models.Row & CollectionItemRow;

/** 
 * Normalisasi pesan error penanganan database koleksi.
 * @param error Objek error tidak dikenal
 */
const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses data koleksi.";

/**
 * Memetakan baris koleksi dari Appwrite menjadi format UI,
 * dilengkapi dengan informasi total jumlah item di dalamnya.
 * 
 * @param row Baris grup koleksi mentah
 * @param itemCount Total kartu/item di dalam grup ini
 */
const toCollection = (
  row: CollectionRecord,
  itemCount: number
): Collection => ({
  id: row.$id,
  title: row.title,
  count: itemCount,
});

/**
 * Memetakan baris item yang ada di dalam sebuah koleksi ke format UI.
 * 
 * @param row Baris data item kartu dalam koleksi
 */
const toCollectionItem = (row: CollectionItemRecord): CollectionItem => ({
  id: row.$id,
  collectionId: row.collection_id,
  productId: row.product_id,
  title: row.custom_title,
  price: row.price_snapshot,
  condition: formatProductCondition(row.condition) || "Mint",
  image: row.image_url,
});

/**
 * Layanan untuk mengatur fitur "Koleksi Pribadi" (Portfolio kartu) dari pengguna.
 */
export const collectionService = {
  /**
   * Mengambil daftar semua grup koleksi milik pengguna (beserta perhitungan 
   * total kartu/item di masing-masing grup).
   * 
   * @param userId ID pemilik koleksi
   */
  async listCollections(userId: string) {
    try {
      // Mengambil seluruh grup folder koleksi milik user_id
      const result = await tablesDB.listRows<CollectionRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: collectionsTableId,
        queries: [Query.equal("user_id", [userId])],
      });

      // Iterasi seluruh folder koleksi untuk memuat dan menghitung jumlah item di dalamnya secara paralel
      const collections = await Promise.all(
        result.rows.map(async (row) => {
          const items = await tablesDB.listRows<CollectionItemRecord>({
            databaseId: appwriteConfig.databaseId,
            tableId: collectionItemsTableId,
            queries: [Query.equal("collection_id", [row.$id])],
          });

          return toCollection(row, items.total);
        })
      );

      return collections;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Membuat grup koleksi baru (misal: "Deck Pokemon Air", "Yugioh Klasik").
   * 
   * @param userId - ID Pemilik koleksi
   * @param title - Nama grup koleksi
   */
  async createCollection(userId: string, title: string) {
    try {
      // Membuat baris folder baru di database
      const row = await tablesDB.createRow<CollectionRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: collectionsTableId,
        rowId: ID.unique(),
        data: {
          user_id: userId,
          title: title.trim(),
        },
        permissions: [
          // Batasi hak akses CRUD hanya untuk pemilik folder koleksi ini
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ],
      });

      // Mengembalikan folder baru dengan jumlah item awal 0
      return toCollection(row, 0);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Memuat detail dari satu grup koleksi, termasuk mengambil seluruh item 
   * kartu di dalamnya.
   * 
   * @param userId - ID Pemilik (untuk mencegah akses koleksi orang lain)
   * @param collectionId - ID grup koleksi
   */
  async getCollectionById(userId: string, collectionId: string) {
    try {
      // Mengambil baris data folder koleksi
      const row = await tablesDB.getRow<CollectionRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: collectionsTableId,
        rowId: collectionId,
      });

      // Validasi kepemilikan: Pastikan folder yang diakses adalah milik pengguna yang meminta
      if (row.user_id !== userId) return null;

      // Ambil seluruh daftar item kartu di dalam folder ini
      const items = await tablesDB.listRows<CollectionItemRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: collectionItemsTableId,
        queries: [Query.equal("collection_id", [collectionId])],
      });

      return {
        collection: toCollection(row, items.total),
        items: items.rows.map(toCollectionItem),
      };
    } catch {
      return null;
    }
  },

  /**
   * Menambahkan item (kartu) ke dalam suatu grup koleksi secara manual.
   * (Berguna untuk mencatat koleksi fisik yang dimiliki user di dunia nyata).
   * 
   * @param userId ID pemilik koleksi
   * @param input Data item manual (folder koleksi tujuan, nama, harga, kondisi, gambar)
   */
  async addManualItem(
    userId: string,
    input: {
      collectionId: string;
      title: string;
      price: number;
      condition?: ProductConditionValue;
      imageUrl?: string | null;
    }
  ) {
    try {
      // Membuat dokumen item koleksi manual di database
      const row = await tablesDB.createRow<CollectionItemRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: collectionItemsTableId,
        rowId: ID.unique(),
        data: {
          collection_id: input.collectionId,
          product_id: null, // Null karena barang ditambahkan manual (portfolio fisik), bukan dibeli dari marketplace
          custom_title: input.title.trim(),
          price_snapshot: input.price,
          condition: input.condition || "mint",
          image_url: input.imageUrl || null,
        },
        permissions: [
          // Batasi hak akses penuh hanya untuk pemilik
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ],
      });

      return toCollectionItem(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Menghapus sebuah item kartu dari dalam grup koleksi.
   * 
   * @param collectionItemId ID unik item dalam koleksi
   */
  async removeItem(collectionItemId: string) {
    try {
      // Menghapus dokumen item kartu di database
      await tablesDB.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId: collectionItemsTableId,
        rowId: collectionItemId,
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
