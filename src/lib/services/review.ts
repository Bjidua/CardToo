import type { Models } from "appwrite";
import {
  Query,
  tablesDB,
} from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import { commerceGatewayService } from "@/lib/services/commerceGateway";
import { orderService } from "@/lib/services/order";
import type { Review, ReviewRow, ReviewSummary } from "@/types";

const tableId = appwriteConfig.tables.reviews;
type ReviewRecord = Models.Row & ReviewRow;

const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses ulasan.";

const emptyBreakdown = (): ReviewSummary["breakdown"] => ({
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
});

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

const toSummary = (reviews: Review[]): ReviewSummary => {
  const breakdown = emptyBreakdown();

  reviews.forEach((review) => {
    const key = review.rating as 1 | 2 | 3 | 4 | 5;
    if (breakdown[key] !== undefined) {
      breakdown[key] += 1;
    }
  });

  const totalReviews = reviews.length;
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

export const reviewService = {
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

  async getProductReviewSummary(productId: string) {
    const reviews = await this.listProductReviews(productId);
    return toSummary(reviews);
  },

  async getStoreReviewSummary(storeId: string) {
    const reviews = await this.listStoreReviews(storeId);
    return toSummary(reviews);
  },

  async createReview(userId: string, orderId: string, rating: number, reviewText: string) {
    try {
      const existing = await this.getReviewByOrderId(orderId);
      if (existing) {
        throw new Error("Pesanan ini sudah pernah diberi ulasan.");
      }

      const order = await orderService.getBuyerOrderById(userId, orderId);
      if (!order) {
        throw new Error("Pesanan tidak ditemukan.");
      }

      const primaryItem = order.items[0];
      if (!primaryItem) {
        throw new Error("Produk pesanan tidak tersedia untuk diulas.");
      }

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
