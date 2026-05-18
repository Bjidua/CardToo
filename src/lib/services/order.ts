import type { Models } from "appwrite";
import {
  ID,
  Permission,
  Query,
  Role,
  tablesDB,
} from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import { addressService } from "@/lib/services/address";
import { cartService } from "@/lib/services/cart";
import { notificationService } from "@/lib/services/notification";
import { storeService } from "@/lib/services/store";
import type {
  BuyerOrder,
  BuyerOrderItem,
  BuyerOrderStatusValue,
  CreateOrderInput,
  OrderItemRow,
  OrderRow,
  ProductCondition,
  ProductConditionValue,
  SellerOrder,
  SellerOrderItem,
} from "@/types";

const ordersTableId = appwriteConfig.tables.orders;
const orderItemsTableId = appwriteConfig.tables.orderItems;
type OrderRecord = Models.Row & OrderRow;
type OrderItemRecord = Models.Row & OrderItemRow;

const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses pesanan.";

const conditionLabelMap: Record<ProductConditionValue, ProductCondition> = {
  mint: "Mint",
  near_mint: "Near Mint",
  excellent: "Excellent",
  good: "Good",
  played: "Played",
};

const buildPermissions = (buyerUserId: string, sellerUserId: string) => [
  Permission.read(Role.user(buyerUserId)),
  Permission.update(Role.user(buyerUserId)),
  Permission.delete(Role.user(buyerUserId)),
  Permission.read(Role.user(sellerUserId)),
  Permission.update(Role.user(sellerUserId)),
];

const toOrderItem = (row: OrderItemRecord): BuyerOrderItem => ({
  id: row.$id,
  orderId: row.order_id,
  productId: row.product_id,
  productTitle: row.product_title,
  productImage: row.product_image_url,
  condition: conditionLabelMap[row.condition] || "Mint",
  quantity: row.quantity,
  unitPrice: row.unit_price,
  totalPrice: row.total_price,
});

const toBuyerOrder = (
  row: OrderRecord,
  items: BuyerOrderItem[],
  storeName?: string
): BuyerOrder => ({
  id: row.$id,
  orderCode: row.order_code,
  buyerUserId: row.buyer_user_id,
  sellerUserId: row.seller_user_id,
  storeId: row.store_id,
  addressLabel: row.address_label,
  recipientName: row.recipient_name,
  recipientPhone: row.recipient_phone,
  addressDetails: row.address_details,
  paymentMethod: row.payment_method,
  shippingMethod: row.shipping_method,
  shippingEtd: row.shipping_etd,
  shippingFee: row.shipping_fee,
  appFee: row.app_fee,
  subtotal: row.subtotal,
  total: row.total,
  productCount: row.product_count,
  status: row.status,
  paidAt: row.paid_at,
  createdAt: row.$createdAt,
  updatedAt: row.$updatedAt,
  storeName,
  items,
});

const toSellerOrderItem = (item: BuyerOrderItem): SellerOrderItem => ({
  id: item.id,
  productId: item.productId,
  title: item.productTitle,
  price: item.unitPrice,
  qty: item.quantity,
  totalPrice: item.totalPrice,
  condition: item.condition,
  image: item.productImage,
});

const toSellerOrder = (
  row: OrderRecord,
  items: BuyerOrderItem[],
  storeName?: string
): SellerOrder => ({
  id: row.$id,
  orderCode: row.order_code,
  buyerUserId: row.buyer_user_id,
  storeId: row.store_id,
  storeName,
  customerName: row.recipient_name,
  phone: row.recipient_phone,
  address: row.address_details,
  totalPrice: row.total,
  subtotal: row.subtotal,
  shippingFee: row.shipping_fee,
  appFee: row.app_fee,
  productCount: row.product_count,
  status: row.status,
  date: row.$createdAt,
  courier: row.shipping_method,
  shippingEtd: row.shipping_etd,
  paidAt: row.paid_at,
  items: items.map(toSellerOrderItem),
});

const generateOrderCode = () => {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ORD-${stamp}-${random}`;
};

const getOrderItems = async (orderId: string) => {
  const result = await tablesDB.listRows<OrderItemRecord>({
    databaseId: appwriteConfig.databaseId,
    tableId: orderItemsTableId,
    queries: [Query.equal("order_id", [orderId])],
  });

  return result.rows.map(toOrderItem);
};

export const formatBuyerOrderStatus = (status: BuyerOrderStatusValue) => {
  switch (status) {
    case "unpaid":
      return "Belum Bayar";
    case "packed":
      return "Dikemas";
    case "shipped":
      return "Dikirim";
    case "completed":
      return "Selesai";
    case "cancelled":
      return "Dibatalkan";
    default:
      return "Belum Bayar";
  }
};

export const formatSellerOrderStatus = (status: BuyerOrderStatusValue) => {
  switch (status) {
    case "packed":
      return "Perlu Dikirim";
    case "shipped":
      return "Dikirim";
    case "completed":
      return "Selesai";
    case "cancelled":
      return "Dibatalkan";
    case "unpaid":
      return "Belum Bayar";
    default:
      return "Perlu Dikirim";
  }
};

export const orderService = {
  async createOrderFromSelectedCart(userId: string, input: CreateOrderInput) {
    try {
      const selectedItems = await cartService.getSelectedItems(userId);
      if (selectedItems.length === 0) {
        throw new Error("Belum ada item terpilih untuk checkout.");
      }

      const primaryAddress = await addressService.getPrimaryAddress(userId);
      if (!primaryAddress) {
        throw new Error("Silakan tambahkan alamat utama terlebih dahulu.");
      }

      const storeIds = Array.from(
        new Set(selectedItems.map((item) => item.storeId))
      );
      if (storeIds.length > 1) {
        throw new Error(
          "Checkout v1 hanya mendukung item dari satu toko dalam satu transaksi."
        );
      }

      const sellerIds = Array.from(
        new Set(selectedItems.map((item) => item.sellerUserId))
      );
      if (sellerIds.length !== 1) {
        throw new Error("Data seller pada item checkout tidak valid.");
      }

      const subtotal = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const appFee = 2500;
      const total = subtotal + input.shippingMethod.price + appFee;
      const orderCode = generateOrderCode();
      const sellerUserId = sellerIds[0];

      const orderRow = await tablesDB.createRow<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        rowId: ID.unique(),
        data: {
          order_code: orderCode,
          buyer_user_id: userId,
          seller_user_id: sellerUserId,
          store_id: storeIds[0],
          address_label: primaryAddress.label,
          recipient_name: primaryAddress.name,
          recipient_phone: primaryAddress.phone,
          address_details: primaryAddress.details,
          payment_method: input.paymentMethod,
          shipping_method: input.shippingMethod.name,
          shipping_etd: input.shippingMethod.etd,
          shipping_fee: input.shippingMethod.price,
          app_fee: appFee,
          subtotal,
          total,
          product_count: selectedItems.length,
          status: "unpaid",
          paid_at: null,
        },
        permissions: buildPermissions(userId, sellerUserId),
      });

      const itemPermissions = buildPermissions(userId, sellerUserId);

      await Promise.all(
        selectedItems.map((item) =>
          tablesDB.createRow<OrderItemRecord>({
            databaseId: appwriteConfig.databaseId,
            tableId: orderItemsTableId,
            rowId: ID.unique(),
            data: {
              order_id: orderRow.$id,
              product_id: item.productId,
              product_title: item.title,
              product_image_url: item.image || null,
              condition: item.condition
                .toLowerCase()
                .replace(/\s+/g, "_") as ProductConditionValue,
              quantity: item.quantity,
              unit_price: item.price,
              total_price: item.price * item.quantity,
            },
            permissions: itemPermissions,
          })
        )
      );

      await notificationService.createNotification({
        userId: sellerUserId,
        title: "Pesanan baru masuk",
        description: `${selectedItems.length} produk baru perlu diproses untuk order ${orderCode}.`,
        type: "order",
        label: "ORDER",
        actionUrl: `/seller/orders/detail?orderId=${orderRow.$id}`,
      });

      await cartService.removeSelectedItems(userId);

      const items = await getOrderItems(orderRow.$id);
      return toBuyerOrder(orderRow, items, selectedItems[0]?.shopName || "Toko CardToo");
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async listBuyerOrders(userId: string) {
    try {
      const result = await tablesDB.listRows<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        queries: [Query.equal("buyer_user_id", [userId]), Query.orderDesc("$createdAt")],
      });

      const orders = await Promise.all(
        result.rows.map(async (row) => {
          const [items, store] = await Promise.all([
            getOrderItems(row.$id),
            storeService.getStoreById(row.store_id),
          ]);
          return toBuyerOrder(row, items, store?.name || "Toko CardToo");
        })
      );

      return orders;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async getBuyerOrderById(userId: string, orderId: string) {
    try {
      const row = await tablesDB.getRow<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        rowId: orderId,
      });

      if (row.buyer_user_id !== userId) {
        return null;
      }

      const items = await getOrderItems(orderId);
      const store = await storeService.getStoreById(row.store_id);
      return toBuyerOrder(row, items, store?.name || "Toko CardToo");
    } catch {
      return null;
    }
  },

  async listSellerOrders(userId: string) {
    try {
      const result = await tablesDB.listRows<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        queries: [
          Query.equal("seller_user_id", [userId]),
          Query.orderDesc("$createdAt"),
        ],
      });

      return Promise.all(
        result.rows.map(async (row) => {
          const [items, store] = await Promise.all([
            getOrderItems(row.$id),
            storeService.getStoreById(row.store_id),
          ]);

          return toSellerOrder(row, items, store?.name || "Toko CardToo");
        })
      );
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async getSellerOrderById(userId: string, orderId: string) {
    try {
      const row = await tablesDB.getRow<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        rowId: orderId,
      });

      if (row.seller_user_id !== userId) {
        return null;
      }

      const [items, store] = await Promise.all([
        getOrderItems(orderId),
        storeService.getStoreById(row.store_id),
      ]);

      return toSellerOrder(row, items, store?.name || "Toko CardToo");
    } catch {
      return null;
    }
  },

  async markOrderAsPaid(orderId: string) {
    try {
      const row = await tablesDB.updateRow<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        rowId: orderId,
        data: {
          status: "packed",
          paid_at: new Date().toISOString(),
        },
      });

      const items = await getOrderItems(orderId);
      const store = await storeService.getStoreById(row.store_id);
      await notificationService.createNotification({
        userId: row.seller_user_id,
        title: "Pembayaran dikonfirmasi",
        description: `Order ${row.order_code} sudah dibayar dan siap diproses.`,
        type: "order",
        label: "PAID",
        actionUrl: `/seller/orders/detail?orderId=${row.$id}`,
      });
      return toBuyerOrder(row, items, store?.name || "Toko CardToo");
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async markOrderAsShipped(orderId: string, sellerUserId: string) {
    try {
      const currentOrder = await tablesDB.getRow<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        rowId: orderId,
      });

      if (currentOrder.seller_user_id !== sellerUserId) {
        throw new Error("Anda tidak memiliki akses ke pesanan ini.");
      }

      const row = await tablesDB.updateRow<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        rowId: orderId,
        data: {
          status: "shipped",
        },
      });

      const [items, store] = await Promise.all([
        getOrderItems(orderId),
        storeService.getStoreById(row.store_id),
      ]);

      await notificationService.createNotification({
        userId: row.buyer_user_id,
        title: "Pesanan sedang dikirim",
        description: `Order ${row.order_code} sudah dikirim oleh penjual.`,
        type: "order",
        label: "SHIP",
        actionUrl: `/orders/track?orderId=${row.$id}`,
      });

      return toSellerOrder(row, items, store?.name || "Toko CardToo");
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async markOrderAsCompleted(orderId: string) {
    try {
      const row = await tablesDB.updateRow<OrderRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: ordersTableId,
        rowId: orderId,
        data: {
          status: "completed",
        },
      });

      const items = await getOrderItems(orderId);
      const store = await storeService.getStoreById(row.store_id);
      await notificationService.createNotification({
        userId: row.buyer_user_id,
        title: "Pesanan selesai",
        description: `Order ${row.order_code} sudah selesai. Yuk beri ulasan untuk produk yang dibeli.`,
        type: "order",
        label: "DONE",
        actionUrl: `/orders/review?orderId=${row.$id}`,
      });
      return toBuyerOrder(row, items, store?.name || "Toko CardToo");
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
