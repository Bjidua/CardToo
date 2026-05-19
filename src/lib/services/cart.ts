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

const tableId = appwriteConfig.tables.cartItems;
type CartItemRecord = Models.Row & CartItemRow;
type ProductRecord = Models.Row & ProductRow;
type StoreRecord = Models.Row & StoreRow;

const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses keranjang.";

const buildPermissions = (userId: string) => [
  Permission.read(Role.user(userId)),
  Permission.update(Role.user(userId)),
  Permission.delete(Role.user(userId)),
];

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

const getRowByUserAndProduct = async (userId: string, productId: string) => {
  const result = await tablesDB.listRows<CartItemRecord>({
    databaseId: appwriteConfig.databaseId,
    tableId,
    queries: [
      Query.equal("user_id", [userId]),
      Query.equal("product_id", [productId]),
    ],
  });

  return result.rows[0] || null;
};

export const cartService = {
  async listItems(userId: string) {
    try {
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

  async getSelectedItems(userId: string) {
    try {
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

  async addItem(userId: string, input: AddCartItemInput) {
    try {
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

      const canonicalSellerUserId = store.owner_user_id;
      if (!canonicalSellerUserId) {
        throw new Error("Data pemilik toko tidak valid.");
      }
      if (product.store_id !== input.storeId) {
        throw new Error("Produk tidak cocok dengan toko yang dipilih.");
      }
      if (canonicalSellerUserId === userId) {
        throw new Error("Anda tidak bisa membeli produk dari toko Anda sendiri.");
      }

      const existing = await getRowByUserAndProduct(userId, input.productId);
      const nextQuantity = Math.max(1, input.quantity || 1);
      const shouldSelect = input.isSelected ?? true;

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
        permissions: buildPermissions(userId),
      });

      return toCartItem(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async updateQuantity(cartItemId: string, quantity: number) {
    try {
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

  async setSelected(cartItemId: string, selected: boolean) {
    try {
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

  async setAllSelected(userId: string, selected: boolean) {
    try {
      const items = await this.listItems(userId);
      await Promise.all(
        items.map((item) => this.setSelected(item.id, selected))
      );
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async selectOnlyItem(userId: string, input: AddCartItemInput) {
    try {
      await this.setAllSelected(userId, false);
      return await this.addItem(userId, {
        ...input,
        isSelected: true,
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async removeItem(cartItemId: string) {
    try {
      await tablesDB.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: cartItemId,
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async removeSelectedItems(userId: string) {
    try {
      const items = await this.getSelectedItems(userId);
      await Promise.all(items.map((item) => this.removeItem(item.id)));
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
