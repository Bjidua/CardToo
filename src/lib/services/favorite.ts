import type { Models } from "appwrite";
import { ID, Permission, Query, Role, tablesDB } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import { productService } from "@/lib/services/product";
import { storeService } from "@/lib/services/store";
import type { FavoriteItem, FavoriteRow, Product, Store } from "@/types";

const tableId = appwriteConfig.tables.favorites;
type FavoriteRecord = Models.Row & FavoriteRow;

const isProduct = (value: Product | null): value is Product => Boolean(value);
const isStore = (value: Store | null): value is Store => Boolean(value);

const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses data favorit.";

const getFavoriteRow = async (userId: string, productId: string) => {
  const result = await tablesDB.listRows<FavoriteRecord>({
    databaseId: appwriteConfig.databaseId,
    tableId,
    queries: [Query.equal("user_id", [userId]), Query.equal("product_id", [productId])],
  });

  return result.rows[0] || null;
};

export const favoriteService = {
  async listFavoriteProductIds(userId: string) {
    try {
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

  async listFavorites(userId: string) {
    try {
      const productIds = await this.listFavoriteProductIds(userId);
      const products = await Promise.all(
        productIds.map((productId) => productService.getProductById(productId))
      );

      const validProducts = products.filter(isProduct);
      const uniqueStoreIds = Array.from(
        new Set(validProducts.map((product) => product.storeId).filter(Boolean))
      ) as string[];

      const stores = await Promise.all(
        uniqueStoreIds.map((storeId) => storeService.getStoreById(storeId))
      );
      const storesById = new Map(stores.filter(isStore).map((store) => [store.id, store.name]));

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

  async addFavorite(userId: string, productId: string) {
    try {
      const existing = await getFavoriteRow(userId, productId);
      if (existing) return existing.$id;

      const row = await tablesDB.createRow<FavoriteRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: ID.unique(),
        data: {
          user_id: userId,
          product_id: productId,
        },
        permissions: [
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

  async removeFavorite(userId: string, productId: string) {
    try {
      const existing = await getFavoriteRow(userId, productId);
      if (!existing) return;

      await tablesDB.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: existing.$id,
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async toggleFavorite(userId: string, productId: string) {
    const existing = await getFavoriteRow(userId, productId);
    if (existing) {
      await this.removeFavorite(userId, productId);
      return false;
    }

    await this.addFavorite(userId, productId);
    return true;
  },
};
