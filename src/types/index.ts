// ==========================================
// CardToo - Centralized Type Definitions
// ==========================================

export type UserRole = "buyer" | "seller";

export type ProductConditionValue =
  | "mint"
  | "near_mint"
  | "excellent"
  | "good"
  | "played";

export type ProductCondition =
  | "Mint"
  | "Near Mint"
  | "Excellent"
  | "Good"
  | "Played";

export type ProductCategoryValue =
  | "pokemon"
  | "onepiece"
  | "boboiboy"
  | "yugioh"
  | "magic"
  | "digimon"
  | "sports"
  | "other";

export type ProductStatus = "draft" | "published" | "archived";
export type StoreStatus = "draft" | "active" | "suspended";
export type BuyerOrderStatusValue =
  | "unpaid"
  | "packed"
  | "shipped"
  | "completed"
  | "cancelled";
export type PaymentMethodValue = "qris";

export interface UserProfileRow {
  username: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  avatar_file_id: string | null;
  avatar_url: string | null;
  is_active: boolean;
}

export interface UserProfile extends UserProfileRow {
  id: string;
}

export interface ProductRow {
  store_id: string;
  title: string;
  slug: string;
  category: ProductCategoryValue;
  price: number;
  stock: number;
  condition: ProductConditionValue;
  description: string | null;
  cover_file_id: string | null;
  cover_url: string | null;
  gallery_file_ids: string[] | null;
  gallery_urls: string[] | null;
  status: ProductStatus;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  condition?: ProductCondition;
  category?: string;
  image?: string | null;
  stock?: number;
  storeId?: string;
  status?: ProductStatus;
  description?: string | null;
  slug?: string;
  gallery?: string[];
}

export interface StoreRow {
  store_name: string;
  store_slug: string;
  location: string | null;
  description: string | null;
  logo_file_id: string | null;
  logo_url: string | null;
  banner_file_id: string | null;
  banner_url: string | null;
  is_verified: boolean;
  status: StoreStatus;
  owner_user_id: string;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  createdAt?: string;
  rating: string;
  followers: string;
  isVerified: boolean;
  coverImage: string | null;
  description: string;
  performance: {
    chat: string;
    process: string;
    onTime: string;
  };
  products: Product[];
  ownerUserId?: string;
  slug?: string;
  status?: StoreStatus;
  logoUrl?: string | null;
  bannerUrl?: string | null;
}

export interface AddressRow {
  user_id: string;
  label: string;
  name: string;
  phone: string;
  details: string;
  is_primary: boolean;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  details: string;
  isPrimary: boolean;
}

export interface CartItemRow {
  user_id: string;
  product_id: string;
  seller_user_id: string;
  store_id: string;
  product_title: string;
  product_image_url: string | null;
  store_name: string;
  condition: ProductConditionValue;
  price: number;
  quantity: number;
  is_selected: boolean;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  sellerUserId: string;
  storeId: string;
  title: string;
  shopName: string;
  price: number;
  image?: string | null;
  quantity: number;
  condition: ProductCondition;
  selected: boolean;
}

export interface OrderRow {
  order_code: string;
  idempotency_key?: string | null;
  buyer_user_id: string;
  seller_user_id: string;
  store_id: string;
  address_label: string;
  recipient_name: string;
  recipient_phone: string;
  address_details: string;
  payment_method: PaymentMethodValue;
  shipping_method: string;
  shipping_etd: string;
  shipping_fee: number;
  app_fee: number;
  subtotal: number;
  total: number;
  product_count: number;
  status: BuyerOrderStatusValue;
  paid_at: string | null;
}

export interface OrderItemRow {
  order_id: string;
  product_id: string;
  product_title: string;
  product_image_url: string | null;
  condition: ProductConditionValue;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ReviewRow {
  order_id: string;
  product_id: string;
  store_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
}

export interface Review {
  id: string;
  orderId: string;
  productId: string;
  storeId: string;
  userId: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  reviews: Review[];
}

export interface ConversationRow {
  buyer_user_id: string;
  seller_user_id: string;
  store_id: string;
  last_message: string | null;
  last_message_at: string;
  last_sender_id: string | null;
  buyer_last_read_at: string | null;
  seller_last_read_at: string | null;
}

export interface ChatMessageRow {
  conversation_id: string;
  sender_user_id: string;
  receiver_user_id: string;
  message_text: string;
  is_read: boolean;
}

export interface NotificationRow {
  user_id: string;
  title: string;
  description: string;
  type: "order" | "promo" | "system" | "chat" | "alert" | "message";
  label: string | null;
  action_url: string | null;
  is_read: boolean;
}

export interface FavoriteRow {
  user_id: string;
  product_id: string;
}

export interface CollectionRow {
  user_id: string;
  title: string;
}

export interface CollectionItemRow {
  collection_id: string;
  product_id: string | null;
  custom_title: string;
  price_snapshot: number;
  condition: ProductConditionValue;
  image_url: string | null;
}

export interface BuyerOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  productImage?: string | null;
  condition: ProductCondition;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface BuyerOrder {
  id: string;
  orderCode: string;
  idempotencyKey?: string | null;
  buyerUserId: string;
  sellerUserId: string;
  storeId: string;
  addressLabel: string;
  recipientName: string;
  recipientPhone: string;
  addressDetails: string;
  paymentMethod: PaymentMethodValue;
  shippingMethod: string;
  shippingEtd: string;
  shippingFee: number;
  appFee: number;
  subtotal: number;
  total: number;
  productCount: number;
  status: BuyerOrderStatusValue;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  storeName?: string;
  items: BuyerOrderItem[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface SellerOnboardingInput {
  storeName: string;
  preferredSlug?: string;
  description?: string;
  fullName?: string;
  phone?: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateProductInput {
  storeId: string;
  title: string;
  category: ProductCategoryValue;
  price: number;
  stock: number;
  condition: ProductConditionValue;
  description?: string;
  coverFile?: File | null;
}

export interface CreateAddressInput {
  label: string;
  name: string;
  phone: string;
  details: string;
  isPrimary?: boolean;
}

export interface AddCartItemInput {
  productId: string;
  sellerUserId: string;
  storeId: string;
  productTitle: string;
  productImageUrl?: string | null;
  storeName: string;
  condition: ProductConditionValue;
  price: number;
  quantity?: number;
  isSelected?: boolean;
}

export interface ShippingMethodOption {
  id: string;
  name: string;
  price: number;
  etd: string;
}

export interface CreateOrderInput {
  shippingMethod: ShippingMethodOption;
  paymentMethod: PaymentMethodValue;
  idempotencyKey?: string;
}

export interface UpdateProductInput {
  title: string;
  category: ProductCategoryValue;
  price: number;
  stock: number;
  condition: ProductConditionValue;
  description?: string;
  coverFile?: File | null;
}

export interface UpdateStoreInput {
  storeName: string;
  location?: string;
  description?: string;
  bannerFile?: File | null;
}

export interface Order {
  id: string;
  shopName: string;
  productTitle: string;
  condition: string;
  quantity: number;
  totalPrice: number;
  status: "Belum Bayar" | "Dikemas" | "Dikirim" | "Selesai" | "Dibatalkan";
  productImage?: string;
  date?: string;
}

export interface SellerOrder {
  id: string;
  orderCode: string;
  idempotencyKey?: string | null;
  buyerUserId: string;
  storeId: string;
  storeName?: string;
  customerName: string;
  phone: string;
  address: string;
  totalPrice: number;
  subtotal: number;
  shippingFee: number;
  appFee: number;
  productCount: number;
  status: BuyerOrderStatusValue;
  date: string;
  courier: string;
  shippingEtd: string;
  paidAt: string | null;
  items: SellerOrderItem[];
}

export interface SellerOrderItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  qty: number;
  totalPrice: number;
  condition: ProductCondition;
  image?: string | null;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  msg: string;
  time: string;
  unread: number;
  sellerId?: string;
  buyerId?: string;
  storeId?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
  createdAt?: string;
  isRead: boolean;
  senderUserId: string;
  receiverUserId: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "order" | "promo" | "system" | "chat" | "alert" | "message";
  read: boolean;
  label?: string;
  actionUrl?: string | null;
}

export interface NotificationGroup {
  group: string;
  items: NotificationItem[];
}

export interface Collection {
  id: string;
  title: string;
  count: number;
}

export interface FavoriteItem {
  id: string;
  productId: string;
  storeId?: string;
  title: string;
  shopName: string;
  price: number;
  image?: string | null;
}

export interface CollectionItem {
  id: string;
  collectionId: string;
  productId?: string | null;
  title: string;
  price: number;
  condition: ProductCondition;
  image?: string | null;
}

export interface TransactionDetail {
  id: string;
  orderId: string;
  date: string;
  productName: string;
  grossAmount: number;
  serviceFee: number;
  netAmount: number;
  status: "Completed" | "Processing";
}

export interface Device {
  id: string;
  name: string;
  location: string;
  time: string;
  isCurrent: boolean;
}
