const fallback = {
  endpoint: "https://sgp.cloud.appwrite.io/v1",
  projectId: "69e2486e0031d1797cb8",
  databaseId: "69f63b060014c2f96188",
  userProfilesTableId: "user_profiles",
  storesTableId: "stores",
  productsTableId: "products",
  addressesTableId: "addresses",
  cartItemsTableId: "cart_items",
  ordersTableId: "orders",
  orderItemsTableId: "order_items",
  reviewsTableId: "reviews",
  conversationsTableId: "conversations",
  chatMessagesTableId: "chat_messages",
  notificationsTableId: "notifications",
  favoritesTableId: "favorites",
  collectionsTableId: "collections",
  collectionItemsTableId: "collection_items",
  profileAvatarsBucketId: "profile-avatars",
  storeAssetsBucketId: "store-assets",
  productImagesBucketId: "product-images",
} as const;

export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || fallback.endpoint,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || fallback.projectId,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || fallback.databaseId,
  tables: {
    userProfiles:
      process.env.NEXT_PUBLIC_APPWRITE_TABLE_USER_PROFILES_ID ||
      fallback.userProfilesTableId,
    stores:
      process.env.NEXT_PUBLIC_APPWRITE_TABLE_STORES_ID || fallback.storesTableId,
    products:
      process.env.NEXT_PUBLIC_APPWRITE_TABLE_PRODUCTS_ID ||
      fallback.productsTableId,
    addresses:
      process.env.NEXT_PUBLIC_APPWRITE_TABLE_ADDRESSES_ID ||
      fallback.addressesTableId,
    cartItems:
      process.env.NEXT_PUBLIC_APPWRITE_TABLE_CART_ITEMS_ID ||
      fallback.cartItemsTableId,
    orders:
      process.env.NEXT_PUBLIC_APPWRITE_TABLE_ORDERS_ID ||
      fallback.ordersTableId,
    orderItems:
      process.env.NEXT_PUBLIC_APPWRITE_TABLE_ORDER_ITEMS_ID ||
      fallback.orderItemsTableId,
    reviews:
      process.env.NEXT_PUBLIC_APPWRITE_TABLE_REVIEWS_ID ||
      fallback.reviewsTableId,
    conversations:
      process.env.NEXT_PUBLIC_APPWRITE_TABLE_CONVERSATIONS_ID ||
      fallback.conversationsTableId,
    chatMessages:
      process.env.NEXT_PUBLIC_APPWRITE_TABLE_CHAT_MESSAGES_ID ||
      fallback.chatMessagesTableId,
    notifications:
      process.env.NEXT_PUBLIC_APPWRITE_TABLE_NOTIFICATIONS_ID ||
      fallback.notificationsTableId,
    favorites:
      process.env.NEXT_PUBLIC_APPWRITE_TABLE_FAVORITES_ID ||
      fallback.favoritesTableId,
    collections:
      process.env.NEXT_PUBLIC_APPWRITE_TABLE_COLLECTIONS_ID ||
      fallback.collectionsTableId,
    collectionItems:
      process.env.NEXT_PUBLIC_APPWRITE_TABLE_COLLECTION_ITEMS_ID ||
      fallback.collectionItemsTableId,
  },
  buckets: {
    profileAvatars:
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_PROFILE_AVATARS_ID ||
      fallback.profileAvatarsBucketId,
    storeAssets:
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_STORE_ASSETS_ID ||
      fallback.storeAssetsBucketId,
    productImages:
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_PRODUCT_IMAGES_ID ||
      fallback.productImagesBucketId,
  },
} as const;

export const getFileViewUrl = (bucketId: string, fileId: string) => {
  const url = new URL(
    `${appwriteConfig.endpoint}/storage/buckets/${bucketId}/files/${fileId}/view`
  );
  url.searchParams.set("project", appwriteConfig.projectId);
  return url.toString();
};
