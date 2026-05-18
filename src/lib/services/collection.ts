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

const collectionsTableId = appwriteConfig.tables.collections;
const collectionItemsTableId = appwriteConfig.tables.collectionItems;

type CollectionRecord = Models.Row & CollectionRow;
type CollectionItemRecord = Models.Row & CollectionItemRow;

const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses data koleksi.";

const toCollection = (
  row: CollectionRecord,
  itemCount: number
): Collection => ({
  id: row.$id,
  title: row.title,
  count: itemCount,
});

const toCollectionItem = (row: CollectionItemRecord): CollectionItem => ({
  id: row.$id,
  collectionId: row.collection_id,
  productId: row.product_id,
  title: row.custom_title,
  price: row.price_snapshot,
  condition: formatProductCondition(row.condition) || "Mint",
  image: row.image_url,
});

export const collectionService = {
  async listCollections(userId: string) {
    try {
      const result = await tablesDB.listRows<CollectionRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: collectionsTableId,
        queries: [Query.equal("user_id", [userId])],
      });

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

  async createCollection(userId: string, title: string) {
    try {
      const row = await tablesDB.createRow<CollectionRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: collectionsTableId,
        rowId: ID.unique(),
        data: {
          user_id: userId,
          title: title.trim(),
        },
        permissions: [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ],
      });

      return toCollection(row, 0);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async getCollectionById(userId: string, collectionId: string) {
    try {
      const row = await tablesDB.getRow<CollectionRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: collectionsTableId,
        rowId: collectionId,
      });

      if (row.user_id !== userId) return null;

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
      const row = await tablesDB.createRow<CollectionItemRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: collectionItemsTableId,
        rowId: ID.unique(),
        data: {
          collection_id: input.collectionId,
          product_id: null,
          custom_title: input.title.trim(),
          price_snapshot: input.price,
          condition: input.condition || "mint",
          image_url: input.imageUrl || null,
        },
        permissions: [
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

  async removeItem(collectionItemId: string) {
    try {
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
