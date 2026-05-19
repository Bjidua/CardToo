import {
  Account,
  Client,
  ID,
  Permission,
  Query,
  Role,
  TablesDB,
} from "node-appwrite";

const requiredEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const optionalEnv = (key, fallback) => process.env[key] || fallback;

const config = {
  endpoint: optionalEnv("APPWRITE_ENDPOINT", "https://sgp.cloud.appwrite.io/v1"),
  projectId: requiredEnv("APPWRITE_FUNCTION_PROJECT_ID"),
  databaseId: optionalEnv("APPWRITE_DATABASE_ID", "69f63b060014c2f96188"),
  tables: {
    addresses: process.env.APPWRITE_TABLE_ADDRESSES_ID || "addresses",
    cartItems: process.env.APPWRITE_TABLE_CART_ITEMS_ID || "cart_items",
    orders: process.env.APPWRITE_TABLE_ORDERS_ID || "orders",
    orderItems: process.env.APPWRITE_TABLE_ORDER_ITEMS_ID || "order_items",
    conversations:
      process.env.APPWRITE_TABLE_CONVERSATIONS_ID || "conversations",
    chatMessages:
      process.env.APPWRITE_TABLE_CHAT_MESSAGES_ID || "chat_messages",
    notifications:
      process.env.APPWRITE_TABLE_NOTIFICATIONS_ID || "notifications",
    reviews: process.env.APPWRITE_TABLE_REVIEWS_ID || "reviews",
  },
};

const createAdminClient = (dynamicKey) =>
  new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(dynamicKey);

const createJwtClient = (jwt) =>
  new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setJWT(jwt);

const buildOrderPermissions = (buyerUserId, sellerUserId) => [
  Permission.read(Role.user(buyerUserId)),
  Permission.update(Role.user(buyerUserId)),
  Permission.delete(Role.user(buyerUserId)),
  Permission.read(Role.user(sellerUserId)),
  Permission.update(Role.user(sellerUserId)),
];

const buildConversationPermissions = (buyerUserId, sellerUserId) => [
  Permission.read(Role.user(buyerUserId)),
  Permission.update(Role.user(buyerUserId)),
  Permission.delete(Role.user(buyerUserId)),
  Permission.read(Role.user(sellerUserId)),
  Permission.update(Role.user(sellerUserId)),
  Permission.delete(Role.user(sellerUserId)),
];

const buildNotificationPermissions = (userId) => [
  Permission.read(Role.user(userId)),
  Permission.update(Role.user(userId)),
  Permission.delete(Role.user(userId)),
];

const buildReviewPermissions = (userId) => [
  Permission.read(Role.any()),
  Permission.update(Role.user(userId)),
  Permission.delete(Role.user(userId)),
];

const success = (res, data, status = 200) =>
  res.json({ ok: true, data }, status);

const failure = (res, message, status = 400) =>
  res.json({ ok: false, message }, status);

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

const createNotification = async (tablesDB, input) => {
  await tablesDB.createRow({
    databaseId: config.databaseId,
    tableId: config.tables.notifications,
    rowId: ID.unique(),
    data: {
      user_id: input.userId,
      title: input.title,
      description: input.description,
      type: input.type,
      label: input.label || null,
      action_url: input.actionUrl || null,
      is_read: false,
    },
    permissions: buildNotificationPermissions(input.userId),
  });
};

const getActor = async (req) => {
  const jwt = req.headers["x-appwrite-user-jwt"];
  if (!jwt) {
    throw new Error("Akses ditolak. Silakan login kembali.");
  }

  const dynamicKey = req.headers["x-appwrite-key"];
  if (!dynamicKey) {
    throw new Error("Dynamic API key untuk function tidak tersedia.");
  }

  const jwtClient = createJwtClient(jwt);
  const account = new Account(jwtClient);
  const user = await account.get();

  return {
    dynamicKey,
    user,
    jwtClient,
  };
};

const listRows = async (tablesDB, tableId, queries) =>
  tablesDB.listRows({
    databaseId: config.databaseId,
    tableId,
    queries,
  });

const createOrder = async ({ actorId, payload, adminTablesDB, userTablesDB }) => {
  const selectedItemsResult = await listRows(adminTablesDB, config.tables.cartItems, [
    Query.equal("user_id", [actorId]),
    Query.equal("is_selected", [true]),
  ]);

  const selectedItems = selectedItemsResult.rows;
  if (selectedItems.length === 0) {
    throw new Error("Belum ada item terpilih untuk checkout.");
  }

  const addressResult = await listRows(userTablesDB, config.tables.addresses, [
    Query.equal("user_id", [actorId]),
    Query.equal("is_primary", [true]),
    Query.limit(1),
  ]);

  const primaryAddress = addressResult.rows[0];
  if (!primaryAddress) {
    throw new Error("Silakan tambahkan alamat utama terlebih dahulu.");
  }

  const sellerIds = [...new Set(selectedItems.map((item) => item.seller_user_id))];
  const storeIds = [...new Set(selectedItems.map((item) => item.store_id))];

  if (sellerIds.length !== 1 || storeIds.length !== 1) {
    throw new Error(
      "Checkout v1 hanya mendukung item dari satu toko dan satu seller."
    );
  }

  const sellerUserId = sellerIds[0];
  if (sellerUserId === actorId) {
    throw new Error("Anda tidak bisa checkout produk dari toko milik sendiri.");
  }

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const appFee = 2500;
  const total = subtotal + payload.shippingMethod.price + appFee;
  const orderId = ID.unique();
  const orderCode = generateOrderCode();
  const permissions = buildOrderPermissions(actorId, sellerUserId);

  await adminTablesDB.createRow({
    databaseId: config.databaseId,
    tableId: config.tables.orders,
    rowId: orderId,
    data: {
      order_code: orderCode,
      buyer_user_id: actorId,
      seller_user_id: sellerUserId,
      store_id: storeIds[0],
      address_label: primaryAddress.label,
      recipient_name: primaryAddress.name,
      recipient_phone: primaryAddress.phone,
      address_details: primaryAddress.details,
      payment_method: payload.paymentMethod,
      shipping_method: payload.shippingMethod.name,
      shipping_etd: payload.shippingMethod.etd,
      shipping_fee: payload.shippingMethod.price,
      app_fee: appFee,
      subtotal,
      total,
      product_count: selectedItems.length,
      status: "unpaid",
      paid_at: null,
    },
    permissions,
  });

  await Promise.all(
    selectedItems.map((item) =>
      adminTablesDB.createRow({
        databaseId: config.databaseId,
        tableId: config.tables.orderItems,
        rowId: ID.unique(),
        data: {
          order_id: orderId,
          product_id: item.product_id,
          product_title: item.product_title,
          product_image_url: item.product_image_url || null,
          condition: item.condition,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        },
        permissions,
      })
    )
  );

  await Promise.all(
    selectedItems.map((item) =>
      adminTablesDB.deleteRow({
        databaseId: config.databaseId,
        tableId: config.tables.cartItems,
        rowId: item.$id,
      })
    )
  );

  await createNotification(adminTablesDB, {
    userId: sellerUserId,
    title: "Pesanan baru masuk",
    description: `${selectedItems.length} produk baru perlu diproses untuk order ${orderCode}.`,
    type: "order",
    label: "ORDER",
    actionUrl: `/seller/orders/detail?orderId=${orderId}`,
  });

  return { orderId };
};

const updateOrderStatus = async ({
  actorId,
  orderId,
  adminTablesDB,
  nextStatus,
  paidAt = undefined,
  allowedActorField,
  notification,
}) => {
  const order = await adminTablesDB.getRow({
    databaseId: config.databaseId,
    tableId: config.tables.orders,
    rowId: orderId,
  });

  if (order[allowedActorField] !== actorId) {
    throw new Error("Anda tidak memiliki akses ke pesanan ini.");
  }

  await adminTablesDB.updateRow({
    databaseId: config.databaseId,
    tableId: config.tables.orders,
    rowId: orderId,
    data: {
      status: nextStatus,
      ...(paidAt !== undefined ? { paid_at: paidAt } : {}),
    },
  });

  if (notification) {
    await createNotification(adminTablesDB, {
      userId: notification.userId(order),
      title: notification.title,
      description: notification.description(order),
      type: "order",
      label: notification.label,
      actionUrl: notification.actionUrl(order),
    });
  }

  return { orderId };
};

const getOrCreateConversation = async ({ actorId, payload, adminTablesDB }) => {
  if (payload.sellerUserId === actorId) {
    throw new Error("Anda tidak bisa membuka chat sebagai buyer ke toko sendiri.");
  }

  const existing = await listRows(adminTablesDB, config.tables.conversations, [
    Query.equal("buyer_user_id", [actorId]),
    Query.equal("seller_user_id", [payload.sellerUserId]),
    Query.equal("store_id", [payload.storeId]),
    Query.limit(1),
  ]);

  if (existing.rows[0]) {
    return { conversationId: existing.rows[0].$id };
  }

  const conversationId = ID.unique();
  const now = new Date().toISOString();

  await adminTablesDB.createRow({
    databaseId: config.databaseId,
    tableId: config.tables.conversations,
    rowId: conversationId,
    data: {
      buyer_user_id: actorId,
      seller_user_id: payload.sellerUserId,
      store_id: payload.storeId,
      last_message: null,
      last_message_at: now,
      last_sender_id: null,
      buyer_last_read_at: now,
      seller_last_read_at: null,
    },
    permissions: buildConversationPermissions(actorId, payload.sellerUserId),
  });

  return { conversationId };
};

const sendMessage = async ({ actorId, payload, adminTablesDB }) => {
  const conversation = await adminTablesDB.getRow({
    databaseId: config.databaseId,
    tableId: config.tables.conversations,
    rowId: payload.conversationId,
  });

  const isBuyer = conversation.buyer_user_id === actorId;
  const isSeller = conversation.seller_user_id === actorId;
  if (!isBuyer && !isSeller) {
    throw new Error("Anda tidak memiliki akses ke percakapan ini.");
  }

  const receiverUserId = isBuyer
    ? conversation.seller_user_id
    : conversation.buyer_user_id;
  const now = new Date().toISOString();
  const messageId = ID.unique();
  const messageText = String(payload.text || "").trim();

  if (!messageText) {
    throw new Error("Pesan tidak boleh kosong.");
  }

  await adminTablesDB.createRow({
    databaseId: config.databaseId,
    tableId: config.tables.chatMessages,
    rowId: messageId,
    data: {
      conversation_id: payload.conversationId,
      sender_user_id: actorId,
      receiver_user_id: receiverUserId,
      message_text: messageText,
      is_read: false,
    },
    permissions: buildConversationPermissions(
      conversation.buyer_user_id,
      conversation.seller_user_id
    ),
  });

  await adminTablesDB.updateRow({
    databaseId: config.databaseId,
    tableId: config.tables.conversations,
    rowId: payload.conversationId,
    data: isBuyer
      ? {
          last_message: messageText,
          last_message_at: now,
          last_sender_id: actorId,
          buyer_last_read_at: now,
        }
      : {
          last_message: messageText,
          last_message_at: now,
          last_sender_id: actorId,
          seller_last_read_at: now,
        },
  });

  await createNotification(adminTablesDB, {
    userId: receiverUserId,
    title: "Pesan baru masuk",
    description: messageText,
    type: "chat",
    label: "CHAT",
    actionUrl: `/messages/room?conversationId=${payload.conversationId}`,
  });

  return {
    message: {
      id: messageId,
      text: messageText,
      sender: "me",
      time: new Date(now).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: false,
      senderUserId: actorId,
      receiverUserId,
    },
  };
};

const createReview = async ({ actorId, payload, adminTablesDB }) => {
  const existing = await listRows(adminTablesDB, config.tables.reviews, [
    Query.equal("order_id", [payload.orderId]),
    Query.limit(1),
  ]);

  if (existing.rows[0]) {
    throw new Error("Pesanan ini sudah pernah diberi ulasan.");
  }

  const order = await adminTablesDB.getRow({
    databaseId: config.databaseId,
    tableId: config.tables.orders,
    rowId: payload.orderId,
  });

  if (order.buyer_user_id !== actorId) {
    throw new Error("Pesanan tidak ditemukan.");
  }

  const orderItems = await listRows(adminTablesDB, config.tables.orderItems, [
    Query.equal("order_id", [payload.orderId]),
    Query.limit(1),
  ]);

  const primaryItem = orderItems.rows[0];
  if (!primaryItem) {
    throw new Error("Produk pesanan tidak tersedia untuk diulas.");
  }

  const row = await adminTablesDB.createRow({
    databaseId: config.databaseId,
    tableId: config.tables.reviews,
    rowId: ID.unique(),
    data: {
      order_id: order.$id,
      product_id: primaryItem.product_id,
      store_id: order.store_id,
      user_id: actorId,
      rating: payload.rating,
      review_text: String(payload.reviewText || "").trim() || null,
    },
    permissions: buildReviewPermissions(actorId),
  });

  await createNotification(adminTablesDB, {
    userId: order.seller_user_id,
    title: "Ulasan baru diterima",
    description: `Pembeli baru saja memberi rating ${payload.rating}/5 untuk order ${order.order_code}.`,
    type: "message",
    label: "REVIEW",
    actionUrl: `/seller/orders/detail?orderId=${order.$id}`,
  });

  return {
    review: {
      id: row.$id,
      orderId: row.order_id,
      productId: row.product_id,
      storeId: row.store_id,
      userId: row.user_id,
      rating: row.rating,
      reviewText: row.review_text || "",
      createdAt: row.$createdAt,
    },
  };
};

const actionHandlers = {
  createOrder,
  markOrderAsPaid: ({ actorId, payload, adminTablesDB }) =>
    updateOrderStatus({
      actorId,
      orderId: payload.orderId,
      adminTablesDB,
      nextStatus: "packed",
      paidAt: new Date().toISOString(),
      allowedActorField: "buyer_user_id",
      notification: {
        userId: (order) => order.seller_user_id,
        title: "Pembayaran dikonfirmasi",
        description: (order) =>
          `Order ${order.order_code} sudah dibayar dan siap diproses.`,
        label: "PAID",
        actionUrl: (order) => `/seller/orders/detail?orderId=${order.$id}`,
      },
    }),
  markOrderAsShipped: ({ actorId, payload, adminTablesDB }) =>
    updateOrderStatus({
      actorId,
      orderId: payload.orderId,
      adminTablesDB,
      nextStatus: "shipped",
      allowedActorField: "seller_user_id",
      notification: {
        userId: (order) => order.buyer_user_id,
        title: "Pesanan sedang dikirim",
        description: (order) =>
          `Order ${order.order_code} sudah dikirim oleh penjual.`,
        label: "SHIP",
        actionUrl: (order) => `/orders/track?orderId=${order.$id}`,
      },
    }),
  markOrderAsCompleted: ({ actorId, payload, adminTablesDB }) =>
    updateOrderStatus({
      actorId,
      orderId: payload.orderId,
      adminTablesDB,
      nextStatus: "completed",
      allowedActorField: "buyer_user_id",
      notification: null,
    }),
  getOrCreateConversation,
  sendMessage,
  createReview,
};

const main = async ({ req, res, error }) => {
  try {
    const { user, jwtClient, dynamicKey } = await getActor(req);
    const body = req.bodyJson || {};
    const action = body.action;
    const payload = body.payload || {};

    if (!action || !(action in actionHandlers)) {
      return failure(res, "Aksi trusted backend tidak dikenal.", 400);
    }

    const adminTablesDB = new TablesDB(createAdminClient(dynamicKey));
    const userTablesDB = new TablesDB(jwtClient);

    const data = await actionHandlers[action]({
      actorId: user.$id,
      payload,
      adminTablesDB,
      userTablesDB,
    });

    return success(res, data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Trusted backend gagal diproses.";
    error(message);
    return failure(res, message, 400);
  }
};

export default main;
