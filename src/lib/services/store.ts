import type { Models } from "appwrite";
import {
  ID,
  Permission,
  Query,
  Role,
  tablesDB,
} from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import type { SellerOnboardingInput, Store, StoreRow } from "@/types";

const tableId = appwriteConfig.tables.stores;
type StoreRecord = Models.Row & StoreRow;

const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses data toko.";

export const slugifyStoreName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const toStore = (
  row: StoreRecord
): Store => ({
  id: row.$id,
  name: row.store_name,
  location: "Indonesia",
  rating: "0.0",
  followers: "0",
  isVerified: row.is_verified,
  coverImage: row.banner_url,
  description: row.description || "Belum ada deskripsi toko.",
  performance: {
    chat: "0%",
    process: "-",
    onTime: "0%",
  },
  products: [],
  ownerUserId: row.owner_user_id,
  slug: row.store_slug,
  status: row.status,
  logoUrl: row.logo_url,
  bannerUrl: row.banner_url,
});

const ensureUniqueSlug = async (baseSlug: string) => {
  let slug = baseSlug || `store-${Date.now()}`;
  let suffix = 1;

  while (true) {
    const { total } = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId,
      queries: [Query.equal("store_slug", [slug])],
    });

    if (total === 0) return slug;

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
};

export const storeService = {
  async getStoreById(storeId: string) {
    try {
      const row = await tablesDB.getRow<StoreRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: storeId,
      });
      return toStore(row);
    } catch {
      return null;
    }
  },

  async getStoreByOwnerUserId(ownerUserId: string) {
    try {
      const result = await tablesDB.listRows<StoreRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("owner_user_id", [ownerUserId])],
      });

      const row = result.rows[0];
      return row ? toStore(row) : null;
    } catch {
      return null;
    }
  },

  async createStore(ownerUserId: string, input: SellerOnboardingInput) {
    try {
      const existing = await this.getStoreByOwnerUserId(ownerUserId);
      if (existing) {
        throw new Error("Akun ini sudah memiliki toko.");
      }

      const baseSlug = slugifyStoreName(input.preferredSlug || input.storeName);
      const uniqueSlug = await ensureUniqueSlug(baseSlug);

      const row = await tablesDB.createRow<StoreRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: ID.unique(),
        data: {
          store_name: input.storeName.trim(),
          store_slug: uniqueSlug,
          description: input.description?.trim() || null,
          logo_file_id: null,
          logo_url: null,
          banner_file_id: null,
          banner_url: null,
          is_verified: false,
          status: "active",
          owner_user_id: ownerUserId,
        },
        permissions: [
          Permission.read(Role.any()),
          Permission.update(Role.user(ownerUserId)),
          Permission.delete(Role.user(ownerUserId)),
        ],
      });

      return toStore(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
