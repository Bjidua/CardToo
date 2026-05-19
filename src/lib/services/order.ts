import type { Models } from "appwrite";
import {
  Query,
  tablesDB,
} from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import { addressService } from "@/lib/services/address";
import { cartService } from "@/lib/services/cart";
import { commerceGatewayService } from "@/lib/services/commerceGateway";
import { storeService } from "@/lib/services/store";
import type {
  BuyerOrder,
  BuyerOrderItem,
  BuyerOrderStatusValue,
  CreateOrderInput,
  OrderItemRow,
  OrderRow,
  ProductCondition,
  ProductConditionValue,
  SellerOrder,
  SellerOrderItem,
} from "@/types";

// Mendefinisikan Table ID pesanan utama (Orders)
const ordersTableId = appwriteConfig.tables.orders;

// Mendefinisikan Table ID detail barang dalam pesanan (Order Items)
const orderItemsTableId = appwriteConfig.tables.orderItems;

// Representasi tipe data baris database pesanan
type OrderRecord = Models.Row & OrderRow;

// Representasi tipe data baris database detail barang pesanan
type OrderItemRecord = Models.Row & OrderItemRow;

/**
 * Normalisasi objek error menjadi pesan kesalahan teks.
 * @param error Objek error tidak dikenal
 */
const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses pesanan.";

/**
 * Membuat identifier unik yang bertindak sebagai Idempotency Key 
 * untuk memastikan bahwa transaksi/checkout yang sama tidak tereksekusi dua kali 
 * bila terjadi masalah koneksi jaringan (double charging prevention).
 * 
 * @param userId ID pembeli
 */
const createCheckoutIdempotencyKey = (userId: string) => {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `checkout:${userId}:${randomPart}`;
};

// Map penentu pelabelan kondisi fisik kartu untuk pembeli
const conditionLabelMap: Record<ProductConditionValue, ProductCondition> = {
  mint: "Mint",
  near_mint: "Near Mint",
  excellent: "Excellent",
  good: "Good",
  played: "Played",
};

/**
 * Memetakan baris rekaman database ke objek detail barang pesanan (`BuyerOrderItem`).
 * @param row Baris data detail barang pesanan mentah
 */
const toOrderItem = (row: OrderItemRecord): BuyerOrderItem => ({
  id: row.$id,
  orderId: row.order_id,
  productId: row.product_id,
  productTitle: row.product_title,
  productImage: row.product_image_url,
  condition: conditionLabelMap[row.condition] || "Mint",
  quantity: row.quantity,
  unitPrice: row.unit_price,
  totalPrice: row.total_price,
});

/**
 * Memetakan baris rekaman pesanan database ke objek pesanan pembeli (`BuyerOrder`) lengkap.
 * 
 * @param row Baris pesanan utama
 * @param items Daftar detail barang pesanan terkait
 * @param storeName Nama toko penjual
 */
const toBuyerOrder = (
  row: OrderRecord,
  items: BuyerOrderItem[],
  storeName?: string
): BuyerOrder => ({
  id: row.$id,
  orderCode: row.order_code,
  idempotencyKey: row.idempotency_key || null,
  buyerUserId: row.buyer_user_id,
  sellerUserId: row.seller_user_id,
  storeId: row.store_id,
  addressLabel: row.address_label,
  recipientName: row.recipient_name,
  recipientPhone: row.recipient_phone,
  addressDetails: row.address_details,
  paymentMethod: row.payment_method,
  shippingMethod: row.shipping_method,
  shippingEtd: row.shipping_etd,
  shippingFee: row.shipping_fee,
  appFee: row.app_fee,
  subtotal: row.subtotal,
  total: row.total,
  productCount: row.product_count,
  status: row.status,
  paidAt: row.paid_at,
  createdAt: row.$createdAt,
  updatedAt: row.$updatedAt,
  storeName,
  items,
});

/**
 * Konversi item belanjaan pembeli ke representasi item pesanan penjual (`SellerOrderItem`).
 * @param item Item pesanan pembeli
 */
const toSellerOrderItem = (item: BuyerOrderItem): SellerOrderItem => ({
  id: item.id,
  productId: item.productId,
  title: item.productTitle,
  price: item.unitPrice,
  qty: item.quantity,
  totalPrice: item.totalPrice,
  condition: item.condition,
  image: item.productImage,
});

/**
 * Memetakan baris rekaman pesanan database ke objek pesanan penjual (`SellerOrder`) lengkap.
 * 
 * @param row Baris pesanan utama
 * @param items Daftar detail barang pesanan terkait
 * @param storeName Nama toko penjual
 */
const toSellerOrder = (
  row: OrderRecord,
  items: BuyerOrderItem[],
  storeName?: string
): SellerOrder => ({
  id: row.$id,
  orderCode: row.order_code,
  idempotencyKey: row.idempotency_key || null,
  buyerUserId: row.buyer_user_id,
  storeId: row.store_id,
  storeName,
  customerName: row.recipient_name,
  phone: row.recipient_phone,
  address: row.address_details,
  totalPrice: row.total,
  subtotal: row.subtotal,
  shippingFee: row.shipping_fee,
  appFee: row.app_fee,
  productCount: row.product_count,
  status: row.status,
  date: row.$createdAt,
  courier: row.shipping_method,
  shippingEtd: row.shipping_etd,
  paidAt: row.paid_at,
  items: items.map(toSellerOrderItem),
});

/**
 * Mengambil daftar barang belanjaan terkait dalam satu ID pesanan.
 * @param orderId ID pesanan
 */
const getOrderItems = async (orderId: string) => {
  const result = await tablesDB.listRows<OrderItemRecord>({
    databaseId: appwriteConfig.databaseId,
    tableId: orderItemsTableId,
    queries: [Query.equal("order_id", [orderId])],
  });

  return result.rows.map(toOrderItem);
};

/**
 * Memformat status pesanan mentah dari database menjadi teks yang ramah 
 * untuk ditampilkan ke pembeli (Buyer).
 * 
 * @param status Kode status pesanan dari database
 */
export const formatBuyerOrderStatus = (status: BuyerOrderStatusValue) => {
  switch (status) {
    case "unpaid":
      return "Belum Bayar";
    case "packed":
      return "Dikemas";
    case "shipped":
      return "Dikirim";
    case "completed":
      return "Selesai";
    case "cancelled":
      return "Dibatalkan";
    default:
      return "Belum Bayar";
  }
};

/**
 * Memformat status pesanan mentah dari database menjadi teks yang ramah 
 * untuk ditampilkan ke penjual (Seller), misal status "packed" menjadi "Perlu Dikirim".
 * 
 * @param status Kode status pesanan dari database
 */
export const formatSellerOrderStatus = (status: BuyerOrderStatusValue) => {
  switch (status) {
    case "packed":
      return "Perlu Dikirim";
    case "shipped":
      return "Dikirim";
    case "completed":
      return "Selesai";
    case "cancelled":
      return "Dibatalkan";
    case "unpaid":
      return "Belum Bayar";
    default:
      return "Perlu Dikirim";
  }
};

/**
 * Layanan untuk mengelola siklus hidup pesanan (order), mulai dari pembuatan 
 * pesanan saat checkout hingga penyelesaian transaksi.
 */
export const orderService = {
  /**
   * Membuat pesanan (order) baru berdasarkan item yang sedang dicentang di keranjang.
   * Proses ini akan memvalidasi alamat, memastikan semua item dari satu toko yang sama,
   * dan memanggil Appwrite Function (commerceGatewayService) untuk write yang aman.
   * 
   * @param userId - ID pembeli
   * @param input - Data opsi pengiriman dan pembayaran
   */
  async createOrderFromSelectedCart(userId: string, input: CreateOrderInput) {
    try {
      // Ambil seluruh barang terpilih dari keranjang belanja user
      const selectedItems = await cartService.getSelectedItems(userId);
      if (selectedItems.length === 0) {
        throw new Error("Belum ada item terpilih untuk checkout.");
      }

      // Ambil alamat utama pembeli untuk pengiriman barang
      const primaryAddress = await addressService.getPrimaryAddress(userId);
      if (!primaryAddress) {
        throw new Error("Silakan tambahkan alamat utama terlebih dahulu.");
      }

      // Validasi 1: Kumpulkan ID toko dari item terpilih, pastikan hanya ada satu toko (Single-Merchant checkout v1)
      const storeIds = Array.from(
        new Set(selectedItems.map((item) => item.storeId))
      );
      if (storeIds.length > 1) {
        throw new Error(
          "Checkout v1 hanya mendukung item dari satu toko dalam satu transaksi."
        );
      }

      // Validasi 2: Kumpulkan ID penjual, pastikan data penjual konsisten
      const sellerIds = Array.from(
        new Set(selectedItems.map((item) => item.sellerUserId))
      );
      if (sellerIds.length !== 1) {
        throw new Error("Data seller pada item checkout tidak valid.");
      }

      const sellerUserId = sellerIds[0];

      // Validasi 3: Pastikan pembeli bukan pemilik toko barang ini
      if (sellerUserId === userId) {
        throw new Error("Anda tidak bisa checkout produk dari toko milik sendiri.");
      }

      // Panggil serverless function commerce-gateway untuk pembuatan pesanan secara aman
      const { orderId } = await commerceGatewayService.createOrder({
        shippingMethod: input.shippingMethod,
        paymentMethod: input.paymentMethod,
        idempotencyKey:
          input.idempotencyKey || createCheckoutIdempotencyKey(userId),
      });

      // Muat data order yang baru saja dibuat untuk dikembalikan ke client
      const order = await this.getBuyerOrderById(userId, orderId);
      if (!order) {
        throw new Error("Pesanan berhasil dibuat, tetapi detailnya belum bisa dimuat.");
      }

      return order;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengambil daftar semua pesanan yang pernah dilakukan oleh pembeli (Buyer).
   * 
   * @param userId - ID pembeli
   */
  async listBuyerOrders(userId: string) {
    try {
      // Mengambil baris pesanan milik buyer_user_id terurut terbaru
      const result = await tablesDB.listRows<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        queries: [Query.equal("buyer_user_id", [userId]), Query.orderDesc("$createdAt")],
      });

      // Muat rincian item barang dan toko penjual secara paralel untuk setiap pesanan pembeli
      const orders = await Promise.all(
        result.rows.map(async (row) => {
          const [items, store] = await Promise.all([
            getOrderItems(row.$id),
            storeService.getStoreById(row.store_id),
          ]);
          return toBuyerOrder(row, items, store?.name || "Toko CardToo");
        })
      );

      return orders;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengambil detail satu pesanan spesifik untuk dilihat oleh pembeli.
   * Akan me-return null jika order tidak ditemukan atau bukan milik pembeli tersebut.
   * 
   * @param userId - ID pembeli
   * @param orderId - ID pesanan
   */
  async getBuyerOrderById(userId: string, orderId: string) {
    try {
      // Membaca dokumen order utama berdasarkan ID pesanan
      const row = await tablesDB.getRow<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        rowId: orderId,
      });

      // Validasi kepemilikan: Pastikan pesanan memang milik user aktif
      if (row.buyer_user_id !== userId) {
        return null;
      }

      // Ambil rincian produk yang dipesan beserta nama toko
      const items = await getOrderItems(orderId);
      const store = await storeService.getStoreById(row.store_id);
      return toBuyerOrder(row, items, store?.name || "Toko CardToo");
    } catch {
      return null;
    }
  },

  /**
   * Mengambil daftar pesanan yang masuk ke toko milik penjual (Seller).
   * 
   * @param userId - ID penjual (Store Owner)
   */
  async listSellerOrders(userId: string) {
    try {
      // Mengambil baris pesanan dengan filter seller_user_id terurut terbaru
      const result = await tablesDB.listRows<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        queries: [
          Query.equal("seller_user_id", [userId]),
          Query.orderDesc("$createdAt"),
        ],
      });

      // Muat rincian item barang dan toko penjual secara paralel untuk setiap pesanan masuk
      return Promise.all(
        result.rows.map(async (row) => {
          const [items, store] = await Promise.all([
            getOrderItems(row.$id),
            storeService.getStoreById(row.store_id),
          ]);

          return toSellerOrder(row, items, store?.name || "Toko CardToo");
        })
      );
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengambil detail satu pesanan spesifik untuk dilihat oleh penjual (Seller).
   * 
   * @param userId - ID penjual (Store Owner)
   * @param orderId - ID pesanan
   */
  async getSellerOrderById(userId: string, orderId: string) {
    try {
      const row = await tablesDB.getRow<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        rowId: orderId,
      });

      // Validasi kepemilikan seller: Pastikan pesanan memang ditujukan ke toko penjual bersangkutan
      if (row.seller_user_id !== userId) {
        return null;
      }

      const [items, store] = await Promise.all([
        getOrderItems(orderId),
        storeService.getStoreById(row.store_id),
      ]);

      return toSellerOrder(row, items, store?.name || "Toko CardToo");
    } catch {
      return null;
    }
  },

  /**
   * Memperbarui status pesanan menjadi "Sudah Dibayar" (packed).
   * Operasi ini diteruskan ke `commerce-gateway` untuk validasi transaksi yang aman.
   * 
   * @param orderId ID pesanan
   */
  async markOrderAsPaid(orderId: string) {
    try {
      // Trigger Appwrite Function untuk memproses otorisasi pembayaran pesanan
      const { orderId: updatedOrderId } =
        await commerceGatewayService.markOrderAsPaid(orderId);
      
      // Ambil data pesanan terupdate
      const row = await tablesDB.getRow<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        rowId: updatedOrderId,
      });

      const [items, store] = await Promise.all([
        getOrderItems(updatedOrderId),
        storeService.getStoreById(row.store_id),
      ]);

      return toBuyerOrder(row, items, store?.name || "Toko CardToo");
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Memperbarui status pesanan menjadi "Dikirim" (shipped).
   * Hanya bisa dipanggil oleh penjual (Seller) yang memiliki toko tersebut.
   * 
   * @param orderId - ID pesanan
   * @param sellerUserId - ID penjual untuk verifikasi otorisasi
   */
  async markOrderAsShipped(orderId: string, sellerUserId: string) {
    try {
      // Pastikan penjual memiliki otoritas atas pesanan masuk ini
      const currentOrder = await this.getSellerOrderById(sellerUserId, orderId);
      if (!currentOrder) {
        throw new Error("Anda tidak memiliki akses ke pesanan ini.");
      }

      // Trigger Appwrite Function untuk mengupdate status kurir pengiriman
      const { orderId: updatedOrderId } =
        await commerceGatewayService.markOrderAsShipped(orderId);

      const row = await tablesDB.getRow<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        rowId: updatedOrderId,
      });

      const [items, store] = await Promise.all([
        getOrderItems(updatedOrderId),
        storeService.getStoreById(row.store_id),
      ]);

      return toSellerOrder(row, items, store?.name || "Toko CardToo");
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Menyelesaikan pesanan (Completed) oleh pembeli setelah barang diterima.
   * Setelah selesai, saldo baru akan bisa diteruskan ke penjual (secara logikal).
   * 
   * @param orderId ID pesanan
   */
  async markOrderAsCompleted(orderId: string) {
    try {
      // Trigger Appwrite Function untuk menyelesaikan siklus hidup pesanan
      const { orderId: updatedOrderId } =
        await commerceGatewayService.markOrderAsCompleted(orderId);
      
      const row = await tablesDB.getRow<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        rowId: updatedOrderId,
      });

      const [items, store] = await Promise.all([
        getOrderItems(updatedOrderId),
        storeService.getStoreById(row.store_id),
      ]);

      return toBuyerOrder(row, items, store?.name || "Toko CardToo");
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Membatalkan pesanan.
   * Dapat digunakan jika belum dibayar, atau jika ada request pembatalan 
   * yang disetujui penjual.
   * 
   * @param orderId ID pesanan
   */
  async markOrderAsCancelled(orderId: string) {
    try {
      // Trigger Appwrite Function untuk membatalkan pesanan dan merilis kembali stok barang
      const { orderId: updatedOrderId } =
        await commerceGatewayService.markOrderAsCancelled(orderId);
      
      const row = await tablesDB.getRow<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        rowId: updatedOrderId,
      });

      const [items, store] = await Promise.all([
        getOrderItems(updatedOrderId),
        storeService.getStoreById(row.store_id),
      ]);

      return toBuyerOrder(row, items, store?.name || "Toko CardToo");
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
