import type { Models } from "appwrite";
import {
  ID,
  Permission,
  Query,
  Role,
  storage,
  tablesDB,
} from "@/lib/appwrite/client";
import { appwriteConfig, getFileViewUrl } from "@/lib/appwrite/config";
import { buildSlugBase, withSlugSuffix } from "@/lib/slug";
import type {
  CreateProductInput,
  Product,
  ProductCategoryValue,
  ProductCondition,
  ProductConditionValue,
  ProductRow,
  UpdateProductInput,
} from "@/types";

const tableId = appwriteConfig.tables.products;
const bucketId = appwriteConfig.buckets.productImages;
type ProductRecord = Models.Row & ProductRow;

const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses data produk.";

const conditionLabelMap: Record<ProductConditionValue, ProductCondition> = {
  mint: "Mint",
  near_mint: "Near Mint",
  excellent: "Excellent",
  good: "Good",
  played: "Played",
};

const categoryLabelMap: Record<ProductCategoryValue, string> = {
  pokemon: "Pokemon",
  onepiece: "Onepiece",
  boboiboy: "Boboiboy",
  yugioh: "Yu-Gi-Oh!",
  magic: "Magic",
  digimon: "Digimon",
  sports: "Sports",
  other: "Other",
};

export const formatProductCondition = (value?: ProductConditionValue | null) =>
  value ? conditionLabelMap[value] : undefined;

export const formatProductCategory = (value?: ProductCategoryValue | null) =>
  value ? categoryLabelMap[value] : "Other";

export const normalizeProductCondition = (
  value: string
): ProductConditionValue | null => {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "_");
  const allowed: ProductConditionValue[] = [
    "mint",
    "near_mint",
    "excellent",
    "good",
    "played",
  ];
  return allowed.includes(normalized as ProductConditionValue)
    ? (normalized as ProductConditionValue)
    : null;
};

export const normalizeProductCategory = (
  value: string
): ProductCategoryValue | null => {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const map: Record<string, ProductCategoryValue> = {
    pokemon: "pokemon",
    onepiece: "onepiece",
    boboiboy: "boboiboy",
    yugioh: "yugioh",
    yugiohcard: "yugioh",
    magic: "magic",
    digimon: "digimon",
    sports: "sports",
    other: "other",
  };
  return map[normalized] || null;
};

export const slugifyProductTitle = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const toProduct = (
  row: ProductRecord
): Product => ({
  id: row.$id,
  title: row.title,
  price: row.price,
  condition: formatProductCondition(row.condition),
  category: formatProductCategory(row.category),
  image: row.cover_url,
  stock: row.stock,
  storeId: row.store_id,
  status: row.status,
  description: row.description,
  slug: row.slug,
  gallery: row.gallery_urls || [],
});

const ensureUniqueSlug = async (baseSlug: string) => {
  const normalizedBaseSlug = buildSlugBase(baseSlug, "product");
  let slug = normalizedBaseSlug;
  let suffix = 1;

  while (true) {
    const { total } = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId,
      queries: [Query.equal("slug", [slug])],
    });

    if (total === 0) return slug;

    slug = withSlugSuffix(normalizedBaseSlug, suffix);
    suffix += 1;
  }
};

const uploadCoverImage = async (file: File, ownerUserId: string) => {
  const uploaded = await storage.createFile({
    bucketId,
    fileId: ID.unique(),
    file,
    permissions: [
      Permission.read(Role.any()),
      Permission.update(Role.user(ownerUserId)),
      Permission.delete(Role.user(ownerUserId)),
    ],
  });

  return {
    fileId: uploaded.$id,
    url: getFileViewUrl(bucketId, uploaded.$id),
  };
};

export const productService = {
  async listPublishedProducts(filters?: {
    category?: ProductCategoryValue;
    storeId?: string;
  }) {
    try {
      const queries = [Query.equal("status", ["published"])];

      if (filters?.category) {
        queries.push(Query.equal("category", [filters.category]));
      }

      if (filters?.storeId) {
        queries.push(Query.equal("store_id", [filters.storeId]));
      }

      const result = await tablesDB.listRows<ProductRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries,
      });

      return result.rows.map(toProduct);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async listSellerProducts(storeId: string) {
    try {
      const result = await tablesDB.listRows<ProductRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("store_id", [storeId])],
      });

      return result.rows.map(toProduct);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async getProductById(productId: string) {
    try {
      const row = await tablesDB.getRow<ProductRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: productId,
      });
      return toProduct(row);
    } catch {
      return null;
    }
  },

  async createProduct(ownerUserId: string, input: CreateProductInput) {
    try {
      const slug = await ensureUniqueSlug(slugifyProductTitle(input.title));
      const uploaded = input.coverFile
        ? await uploadCoverImage(input.coverFile, ownerUserId)
        : null;

      const row = await tablesDB.createRow<ProductRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: ID.unique(),
        data: {
          store_id: input.storeId,
          title: input.title.trim(),
          slug,
          category: input.category,
          price: input.price,
          stock: input.stock,
          condition: input.condition,
          description: input.description?.trim() || null,
          cover_file_id: uploaded?.fileId || null,
          cover_url: uploaded?.url || null,
          gallery_file_ids: uploaded?.fileId ? [uploaded.fileId] : null,
          gallery_urls: uploaded?.url ? [uploaded.url] : null,
          status: "published",
        },
        permissions: [
          Permission.read(Role.any()),
          Permission.update(Role.user(ownerUserId)),
          Permission.delete(Role.user(ownerUserId)),
        ],
      });

      return toProduct(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async updateProduct(
    ownerUserId: string,
    productId: string,
    input: UpdateProductInput
  ) {
    try {
      const existing = await tablesDB.getRow<ProductRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: productId,
      });

      const uploaded = input.coverFile
        ? await uploadCoverImage(input.coverFile, ownerUserId)
        : null;
      const nextSlug =
        slugifyProductTitle(input.title) === slugifyProductTitle(existing.title)
          ? existing.slug
          : await ensureUniqueSlug(slugifyProductTitle(input.title));

      const row = await tablesDB.updateRow<ProductRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: productId,
        data: {
          title: input.title.trim(),
          slug: nextSlug,
          category: input.category,
          price: input.price,
          stock: input.stock,
          condition: input.condition,
          description: input.description?.trim() || null,
          cover_file_id: uploaded?.fileId || existing.cover_file_id,
          cover_url: uploaded?.url || existing.cover_url,
          gallery_file_ids:
            uploaded?.fileId
              ? [uploaded.fileId]
              : existing.gallery_file_ids,
          gallery_urls:
            uploaded?.url ? [uploaded.url] : existing.gallery_urls,
        },
      });

      return toProduct(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async deleteProduct(productId: string) {
    try {
      await tablesDB.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: productId,
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
