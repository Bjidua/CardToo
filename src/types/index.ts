// ==========================================
// CardToo — Centralized Type Definitions
// ==========================================
// Semua interface entity didefinisikan di sini
// agar type-safe di seluruh codebase.
// Saat integrasi Appwrite, cukup update file ini.
// ==========================================

// === PRODUCT ===
export interface Product {
  id: string;
  title: string;
  price: number;
  condition?: "Mint" | "Near Mint" | "Excellent" | "Good" | "Played";
  category?: string;
  image?: string;
  stock?: number;
  storeId?: string;
}

// === STORE ===
export interface Store {
  id: string;
  name: string;
  location: string;
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
}

// === ORDER ===
export interface Order {
  id: string;
  shopName: string;
  productTitle: string;
  condition: string;
  quantity: number;
  totalPrice: number;
  status: "Dikemas" | "Dikirim" | "Selesai" | "Dibatalkan";
  productImage?: string;
  date?: string;
}

// === SELLER ORDER ===
export interface SellerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Completed";
  date: string;
  courier: string;
  items: SellerOrderItem[];
}

export interface SellerOrderItem {
  id: string;
  title: string;
  price: number;
  qty: number;
  image?: string;
}

// === CART ===
export interface CartItem {
  id: string;
  title: string;
  shopName: string;
  price: number;
  image?: string;
  quantity: number;
  selected?: boolean;
}

// === MESSAGE / CHAT ===
export interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  msg: string;
  time: string;
  unread: number;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: "me" | "other";
  time: string;
}

// === NOTIFICATION ===
export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "order" | "promo" | "system" | "chat" | "alert" | "message";
  read: boolean;
}

export interface NotificationGroup {
  group: string;
  items: NotificationItem[];
}

// === COLLECTION ===
export interface Collection {
  id: number;
  title: string;
  count: number;
}

// === FAVORITE ===
export interface FavoriteItem {
  id: string;
  title: string;
  shopName: string;
  price: number;
  image?: string;
}

// === ADDRESS ===
export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  details: string;
  isPrimary: boolean;
}

// === TRANSACTION DETAIL (Seller Reports) ===
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

// === DEVICE (Security) ===
export interface Device {
  id: string;
  name: string;
  location: string;
  time: string;
  isCurrent: boolean;
}
