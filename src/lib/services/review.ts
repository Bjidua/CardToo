import type { Models } from "appwrite";
import {
  Query,
  tablesDB,
} from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import { commerceGatewayService } from "@/lib/services/commerceGateway";
import { orderService } from "@/lib/services/order";
import type { Review, ReviewRow, ReviewSummary } from "@/types";

// Menentukan Table ID dari konfigurasi global Appwrite untuk database Ulasan (Reviews)
const tableId = appwriteConfig.tables.reviews;

// Tipe data representasi dokumen Ulasan di database Appwrite yang menggabungkan model baris bawaan
type ReviewRecord = Models.Row & ReviewRow;

/** 
 * Normalisasi objek error menjadi pesan kesalahan teks.
 * @param error Objek error tidak dikenal
 */
const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses ulasan.";

/** 
 * Nilai default (0) untuk perhitungan breakdown rating bintang (1-5). 
 */
const emptyBreakdown = (): ReviewSummary["breakdown"] => ({
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
});

/**
 * Memetakan baris ulasan dari database ke format antarmuka `Review` UI.
 * 
 * @param row Baris data ulasan mentah dari database
 */
const toReview = (row: ReviewRecord): Review => ({
  id: row.$id,
  orderId: row.order_id,
  productId: row.product_id,
  storeId: row.store_id,
  userId: row.user_id,
  rating: row.rating,
  reviewText: row.review_text || "",
  createdAt: row.$createdAt,
});

/**
 * Menghitung rekapitulasi rating (ReviewSummary).
 * Berguna untuk menampilkan rata-rata rating (average) dan diagram batang 
 * distribusi rating (1 sampai 5 bintang).
 * 
 * @param reviews Array dari objek Review
 */
const toSummary = (reviews: Review[]): ReviewSummary => {
  const breakdown = emptyBreakdown();

  // Hitung frekuensi kemunculan untuk masing-masing bintang rating
  reviews.forEach((review) => {
    const key = review.rating as 1 | 2 | 3 | 4 | 5;
    if (breakdown[key] !== undefined) {
      breakdown[key] += 1;
    }
  });

  const totalReviews = reviews.length;
  // Hitung rata-rata rating dengan pembagian total ulasan jika total ulasan > 0
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  return {
    averageRating,
    totalReviews,
    breakdown,
    reviews,
  };
};

/**
 * Layanan yang mengelola fungsionalitas ulasan (review) 
 * untuk produk dan toko.
 */
export const reviewService = {
  /**
   * Mengambil ulasan yang sudah dibuat berdasarkan ID Pesanan tertentu.
   * Satu pesanan hanya diperbolehkan mendapat satu ulasan (mewakili barang di dalamnya).
   * 
   * @param orderId ID pesanan
   */
  async getReviewByOrderId(orderId: string) {
    try {
      const result = await tablesDB.listRows<ReviewRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("order_id", [orderId]), Query.limit(1)],
      });

      return result.rows[0] ? toReview(result.rows[0]) : null;
    } catch {
      return null;
    }
  },

  /**
   * Mengambil semua daftar ulasan yang ditujukan untuk sebuah produk.
   * Diurutkan dari yang paling terbaru.
   * 
   * @param productId ID produk terkait
   */
  async listProductReviews(productId: string) {
    try {
      const result = await tablesDB.listRows<ReviewRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("product_id", [productId]), Query.orderDesc("$createdAt")],
      });

      return result.rows.map(toReview);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengambil semua daftar ulasan yang ditujukan untuk keseluruhan toko 
   * (berdasarkan gabungan ulasan produk-produk yang dibeli dari toko tersebut).
   * 
   * @param storeId ID toko terkait
   */
  async listStoreReviews(storeId: string) {
    try {
      const result = await tablesDB.listRows<ReviewRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("store_id", [storeId]), Query.orderDesc("$createdAt")],
      });

      return result.rows.map(toReview);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mendapatkan rangkuman ulasan (jumlah rating, rata-rata bintang) untuk sebuah produk.
   * 
   * @param productId ID produk
   */
  async getProductReviewSummary(productId: string) {
    const reviews = await this.listProductReviews(productId);
    return toSummary(reviews);
  },

  /**
   * Mendapatkan rangkuman ulasan (jumlah rating, rata-rata bintang) untuk satu toko secara umum.
   * 
   * @param storeId ID toko
   */
  async getStoreReviewSummary(storeId: string) {
    const reviews = await this.listStoreReviews(storeId);
    return toSummary(reviews);
  },

  /**
   * Membuat ulasan baru dari seorang pembeli setelah pesanan selesai.
   * Memanggil Appwrite Function (`commerce-gateway`) agar integritas rating tidak bisa 
   * diakses atau di-spam secara asal oleh client.
   * 
   * @param userId ID pembeli yang membuat ulasan
   * @param orderId ID pesanan
   * @param rating Angka bintang (1-5)
   * @param reviewText Teks isi ulasan
   */
  async createReview(userId: string, orderId: string, rating: number, reviewText: string) {
    try {
      // 1. Validasi: Pastikan pesanan ini belum pernah diberikan ulasan
      const existing = await this.getReviewByOrderId(orderId);
      if (existing) {
        throw new Error("Pesanan ini sudah pernah diberi ulasan.");
      }

      // 2. Validasi: Pastikan data pesanan ditemukan
      const order = await orderService.getBuyerOrderById(userId, orderId);
      if (!order) {
        throw new Error("Pesanan tidak ditemukan.");
      }

      // 3. Validasi: Pastikan produk pesanan valid untuk diulas
      const primaryItem = order.items[0];
      if (!primaryItem) {
        throw new Error("Produk pesanan tidak tersedia untuk diulas.");
      }

      // 4. Panggil Cloud Function commerce-gateway untuk menyimpan ulasan
      const { review } = await commerceGatewayService.createReview({
        orderId,
        rating,
        reviewText,
      });

      return review;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
