import type { Models } from "appwrite";
import {
  ID,
  Permission,
  Query,
  Role,
  tablesDB,
} from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import { formatProductCondition } from "@/lib/services/product";
import type { AddCartItemInput, CartItem, CartItemRow, ProductRow, StoreRow } from "@/types";

// Mendefinisikan Table ID dari konfigurasi global Appwrite untuk database item keranjang belanja
const tableId = appwriteConfig.tables.cartItems;

// Tipe data representasi dokumen Item Keranjang di database Appwrite yang menggabungkan model baris bawaan
type CartItemRecord = Models.Row & CartItemRow;

// Tipe data representasi dokumen Produk di database
type ProductRecord = Models.Row & ProductRow;

// Tipe data representasi dokumen Toko di database
type StoreRecord = Models.Row & StoreRow;

/** 
 * Normalisasi pesan kesalahan (error handling) yang dilemparkan oleh backend SDK Appwrite.
 * @param error Objek error tidak dikenal
 */
const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses keranjang.";

/**
 * Membuat aturan perizinan agar data item keranjang eksklusif (hanya bisa diakses 
 * dan diubah oleh pemiliknya/pembeli tersebut).
 * 
 * @param userId ID pembeli pemilik keranjang
 */
const buildPermissions = (userId: string) => [
  Permission.read(Role.user(userId)),
  Permission.update(Role.user(userId)),
  Permission.delete(Role.user(userId)),
];

/**
 * Memetakan baris dari database ke objek antarmuka `CartItem` standar aplikasi.
 * Berfungsi mentransformasi field database snake_case ke camelCase untuk UI.
 * 
 * @param row Baris data mentah dari database
 */
const toCartItem = (row: CartItemRecord): CartItem => ({
  id: row.$id,
  userId: row.user_id,
  productId: row.product_id,
  sellerUserId: row.seller_user_id,
  storeId: row.store_id,
  title: row.product_title,
  shopName: row.store_name,
  price: row.price,
  image: row.product_image_url,
  quantity: row.quantity,
  condition: formatProductCondition(row.condition) || "Mint",
  selected: row.is_selected,
});

/**
 * Fungsi internal untuk mengecek apakah produk tertentu sudah ada 
 * di dalam keranjang belanja milik pengguna aktif.
 * 
 * @param userId ID pembeli
 * @param productId ID produk yang dicari
 */
const getRowByUserAndProduct = async (userId: string, productId: string) => {
  // Melakukan query pencarian baris item keranjang dengan filter user_id dan product_id yang cocok
  const result = await tablesDB.listRows<CartItemRecord>({
    databaseId: appwriteConfig.databaseId,
    tableId,
    queries: [
      Query.equal("user_id", [userId]),
      Query.equal("product_id", [productId]),
    ],
  });

  // Mengembalikan baris pertama jika ditemukan, jika tidak return null
  return result.rows[0] || null;
};

/**
 * Layanan untuk mengatur interaksi data keranjang belanja pengguna.
 */
export const cartService = {
  /**
   * Mengambil semua barang yang ada di keranjang milik user tertentu.
   * 
   * @param userId - ID pembeli
   * @returns Array berisi `CartItem`
   */
  async listItems(userId: string) {
    try {
      // Mengambil daftar item keranjang milik user_id target
      const result = await tablesDB.listRows<CartItemRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("user_id", [userId])],
      });

      return result.rows.map(toCartItem);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengambil hanya barang-barang di keranjang yang "dicentang" (di-select) 
   * untuk diproses pada tahap checkout.
   * 
   * @param userId - ID pembeli
   */
  async getSelectedItems(userId: string) {
    try {
      // Mengambil daftar item dengan filter user_id dan is_selected bernilai true
      const result = await tablesDB.listRows<CartItemRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [
          Query.equal("user_id", [userId]),
          Query.equal("is_selected", [true]),
        ],
      });

      return result.rows.map(toCartItem);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Menambahkan produk baru ke dalam keranjang. Jika produk sudah ada,
   * maka kuantitasnya akan ditambahkan.
   * Fungsi ini juga memvalidasi data toko dan mencegah user membeli barangnya sendiri.
   * 
   * @param userId - ID pembeli
   * @param input - Data produk yang dimasukkan ke keranjang
   */
  async addItem(userId: string, input: AddCartItemInput) {
    try {
      // Memuat dokumen detail produk dan detail toko secara paralel dari database
      const [product, store] = await Promise.all([
        tablesDB.getRow<ProductRecord>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.tables.products,
          rowId: input.productId,
        }),
        tablesDB.getRow<StoreRecord>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.tables.stores,
          rowId: input.storeId,
        }),
      ]);

      // Validasi 1: Pastikan ID owner toko terdaftar
      const canonicalSellerUserId = store.owner_user_id;
      if (!canonicalSellerUserId) {
        throw new Error("Data pemilik toko tidak valid.");
      }
      
      // Validasi 2: Pastikan produk yang dibeli memang terdaftar di toko bersangkutan
      if (product.store_id !== input.storeId) {
        throw new Error("Produk tidak cocok dengan toko yang dipilih.");
      }
      
      // Validasi 3: Cegah pembeli membeli produk milik tokonya sendiri
      if (canonicalSellerUserId === userId) {
        throw new Error("Anda tidak bisa membeli produk dari toko Anda sendiri.");
      }

      // Mengecek apakah produk ini sebelumnya sudah pernah dimasukkan ke keranjang
      const existing = await getRowByUserAndProduct(userId, input.productId);
      const nextQuantity = Math.max(1, input.quantity || 1);
      const shouldSelect = input.isSelected ?? true;

      // Skenario A: Jika item sudah ada di keranjang, perbarui kuantitas lamanya (ditambahkan)
      if (existing) {
        const row = await tablesDB.updateRow<CartItemRecord>({
          databaseId: appwriteConfig.databaseId,
          tableId,
          rowId: existing.$id,
          data: {
            seller_user_id: canonicalSellerUserId,
            store_id: input.storeId,
            product_title: product.title,
            product_image_url: product.cover_url || null,
            store_name: store.store_name,
            condition: product.condition,
            price: product.price,
            quantity: existing.quantity + nextQuantity,
            is_selected: shouldSelect,
          },
        });

        return toCartItem(row);
      }

      // Skenario B: Jika item belum ada di keranjang, buat dokumen item keranjang baru
      const row = await tablesDB.createRow<CartItemRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: ID.unique(),
        data: {
          user_id: userId,
          product_id: input.productId,
          seller_user_id: canonicalSellerUserId,
          store_id: input.storeId,
          product_title: product.title,
          product_image_url: product.cover_url || null,
          store_name: store.store_name,
          condition: product.condition,
          price: product.price,
          quantity: nextQuantity,
          is_selected: shouldSelect,
        },
        permissions: buildPermissions(userId), // Batasi hak akses eksklusif untuk pembeli ini
      });

      return toCartItem(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengubah jumlah/kuantitas suatu item di keranjang.
   * Kuantitas minimal adalah 1.
   * 
   * @param cartItemId - ID unik item keranjang
   * @param quantity - Jumlah baru
   */
  async updateQuantity(cartItemId: string, quantity: number) {
    try {
      // Mengupdate field quantity di database dengan pembatasan minimal 1
      const row = await tablesDB.updateRow<CartItemRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: cartItemId,
        data: {
          quantity: Math.max(1, quantity),
        },
      });

      return toCartItem(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mencentang atau menghapus centang pada suatu item di keranjang.
   * 
   * @param cartItemId - ID item
   * @param selected - True (dicentang), False (tidak dicentang)
   */
  async setSelected(cartItemId: string, selected: boolean) {
    try {
      // Mengupdate status is_selected di database
      const row = await tablesDB.updateRow<CartItemRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: cartItemId,
        data: {
          is_selected: selected,
        },
      });

      return toCartItem(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mencentang atau menghapus centang semua item keranjang milik user sekaligus.
   */
  async setAllSelected(userId: string, selected: boolean) {
    try {
      // Dapatkan seluruh item keranjang milik user
      const items = await this.listItems(userId);
      // Lakukan pembaruan status centang secara paralel untuk setiap item
      await Promise.all(
        items.map((item) => this.setSelected(item.id, selected))
      );
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Fitur "Beli Langsung". Menghapus centang pada semua item keranjang lainnya, 
   * lalu menambahkan item baru ini ke keranjang dan otomatis dicentang 
   * sehingga siap di-checkout.
   */
  async selectOnlyItem(userId: string, input: AddCartItemInput) {
    try {
      // Hilangkan seluruh centangan produk lain terlebih dahulu
      await this.setAllSelected(userId, false);
      // Tambahkan/aktifkan produk baru ini di keranjang dengan status terpilih true
      return await this.addItem(userId, {
        ...input,
        isSelected: true,
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Menghapus satu item dari keranjang.
   */
  async removeItem(cartItemId: string) {
    try {
      // Menghapus dokumen item keranjang di database
      await tablesDB.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: cartItemId,
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Menghapus semua item keranjang yang sedang dicentang.
   * Biasanya dipanggil setelah pengguna berhasil melakukan checkout/pembayaran.
   */
  async removeSelectedItems(userId: string) {
    try {
      // Mengambil daftar item terpilih
      const items = await this.getSelectedItems(userId);
      // Hapus seluruh item tersebut secara paralel dari database
      await Promise.all(items.map((item) => this.removeItem(item.id)));
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
