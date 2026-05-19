import {
  Account,
  Client,
  ID,
  Permission,
  Query,
  Role,
  TablesDB,
  Users,
  Storage,
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
    userProfiles: process.env.APPWRITE_TABLE_USER_PROFILES_ID || "user_profiles",
    addresses: process.env.APPWRITE_TABLE_ADDRESSES_ID || "addresses",
    cartItems: process.env.APPWRITE_TABLE_CART_ITEMS_ID || "cart_items",
    favorites: process.env.APPWRITE_TABLE_FAVORITES_ID || "favorites",
    collections: process.env.APPWRITE_TABLE_COLLECTIONS_ID || "collections",
    collectionItems:
      process.env.APPWRITE_TABLE_COLLECTION_ITEMS_ID || "collection_items",
    products: process.env.APPWRITE_TABLE_PRODUCTS_ID || "products",
    stores: process.env.APPWRITE_TABLE_STORES_ID || "stores",
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
  buckets: {
    profileAvatars:
      process.env.APPWRITE_BUCKET_PROFILE_AVATARS_ID || "profile-avatars",
    storeAssets: process.env.APPWRITE_BUCKET_STORE_ASSETS_ID || "store-assets",
    productImages:
      process.env.APPWRITE_BUCKET_PRODUCT_IMAGES_ID || "product-images",
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

const createUsersClient = (dynamicKey) => new Users(createAdminClient(dynamicKey));
const createStorageClient = (dynamicKey) =>
  new Storage(createAdminClient(dynamicKey));

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

const SHIPPING_METHODS = {
  reg: { id: "reg", name: "J&T Reguler", price: 15000, etd: "2-3 Hari" },
  exp: { id: "exp", name: "JNE YES", price: 35000, etd: "Esok Sampai" },
  hmt: { id: "hmt", name: "SiCepat Halu", price: 12000, etd: "4-5 Hari" },
};

const VALID_ORDER_STATUSES = new Set([
  "unpaid",
  "packed",
  "shipped",
  "completed",
  "cancelled",
]);
const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000;
const PAYMENT_TIMEOUT_MS = 15 * 60 * 1000;
const createOrderIdempotencyCache = new Map();

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

const listAllRows = async (tablesDB, tableId, baseQueries = []) => {
  const allRows = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const page = await listRows(tablesDB, tableId, [
      ...baseQueries,
      Query.limit(limit),
      Query.offset(offset),
    ]);
    allRows.push(...page.rows);
    if (page.rows.length < limit) break;
    offset += limit;
  }

  return allRows;
};

const deleteRowsByIds = async (tablesDB, tableId, rowIds) => {
  if (!rowIds.length) return 0;
  await Promise.all(
    rowIds.map((rowId) =>
      tablesDB.deleteRow({
        databaseId: config.databaseId,
        tableId,
        rowId,
      })
    )
  );
  return rowIds.length;
};

const deleteRowsByQueries = async (tablesDB, tableId, queries) => {
  const rows = await listAllRows(tablesDB, tableId, queries);
  const deleted = await deleteRowsByIds(
    tablesDB,
    tableId,
    rows.map((row) => row.$id)
  );
  return { rows, deleted };
};

const deleteStorageFiles = async (storage, bucketId, fileIds) => {
  const uniqueIds = [...new Set(fileIds.filter(Boolean))];
  if (!uniqueIds.length) return 0;

  await Promise.all(
    uniqueIds.map(async (fileId) => {
      try {
        await storage.deleteFile({ bucketId, fileId });
      } catch {
        // ignore missing/already deleted
      }
    })
  );

  return uniqueIds.length;
};

const validateShippingMethod = (input) => {
  if (!input || typeof input !== "object") {
    throw new Error("Metode pengiriman tidak valid.");
  }

  const methodId = typeof input.id === "string" ? input.id : "";
  const selected = SHIPPING_METHODS[methodId];
  if (!selected) {
    throw new Error("Metode pengiriman tidak tersedia.");
  }

  return selected;
};

const normalizeQuantity = (value) => {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Jumlah item keranjang tidak valid.");
  }
  return quantity;
};

const normalizeIdempotencyKey = (value) => {
  if (typeof value !== "string") return null;
  const key = value.trim();
  if (!key || key.length < 8 || key.length > 128) return null;
  return key;
};

const getIdempotencyCacheKey = (actorId, key) => `${actorId}:${key}`;

const getCachedOrderId = (cacheKey) => {
  const cached = createOrderIdempotencyCache.get(cacheKey);
  if (!cached) return null;
  if (cached.expiresAt < Date.now()) {
    createOrderIdempotencyCache.delete(cacheKey);
    return null;
  }
  return cached.orderId;
};

const setCachedOrderId = (cacheKey, orderId) => {
  createOrderIdempotencyCache.set(cacheKey, {
    orderId,
    expiresAt: Date.now() + IDEMPOTENCY_TTL_MS,
  });
};

const isMissingIdempotencySchemaError = (error) => {
  const message = error instanceof Error ? error.message : String(error || "");
  return /idempotency[_\s-]?key/i.test(message);
};

const buildOrderItemsSignature = (items) =>
  items
    .map((item) => ({
      productId: item.product_id,
      quantity: normalizeQuantity(item.quantity),
      unitPrice: Number(item.unitPrice),
    }))
    .sort((a, b) => a.productId.localeCompare(b.productId))
    .map((item) => `${item.productId}:${item.quantity}:${item.unitPrice}`)
    .join("|");

const findExistingUnpaidOrder = async ({
  actorId,
  sellerUserId,
  storeId,
  expectedItems,
  subtotal,
  total,
  shippingMethodName,
  shippingEtd,
  shippingFee,
  appFee,
  adminTablesDB,
}) => {
  const recentOrders = await listRows(adminTablesDB, config.tables.orders, [
    Query.equal("buyer_user_id", [actorId]),
    Query.equal("seller_user_id", [sellerUserId]),
    Query.equal("store_id", [storeId]),
    Query.equal("status", ["unpaid"]),
    Query.equal("shipping_method", [shippingMethodName]),
    Query.equal("shipping_etd", [shippingEtd]),
    Query.equal("shipping_fee", [shippingFee]),
    Query.equal("app_fee", [appFee]),
    Query.equal("subtotal", [subtotal]),
    Query.equal("total", [total]),
    Query.orderDesc("$createdAt"),
    Query.limit(10),
  ]);

  if (recentOrders.rows.length === 0) {
    return null;
  }

  const expectedSignature = buildOrderItemsSignature(expectedItems);
  for (const order of recentOrders.rows) {
    const orderItems = await listRows(adminTablesDB, config.tables.orderItems, [
      Query.equal("order_id", [order.$id]),
      Query.limit(200),
    ]);

    if (orderItems.total !== expectedItems.length) {
      continue;
    }

    const existingSignature = buildOrderItemsSignature(
      orderItems.rows.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unitPrice: item.unit_price,
      }))
    );
    if (existingSignature === expectedSignature) {
      return order.$id;
    }
  }

  return null;
};

const findOrderByIdempotencyKey = async ({
  actorId,
  idempotencyKey,
  adminTablesDB,
}) => {
  if (!idempotencyKey) return null;

  try {
    const result = await listRows(adminTablesDB, config.tables.orders, [
      Query.equal("buyer_user_id", [actorId]),
      Query.equal("idempotency_key", [idempotencyKey]),
      Query.orderDesc("$createdAt"),
      Query.limit(1),
    ]);
    return result.rows[0]?.$id || null;
  } catch (error) {
    if (isMissingIdempotencySchemaError(error)) {
      return null;
    }
    throw error;
  }
};

const createOrderRow = async ({
  adminTablesDB,
  orderId,
  orderCode,
  actorId,
  sellerUserId,
  storeId,
  primaryAddress,
  payload,
  selectedShippingMethod,
  appFee,
  subtotal,
  total,
  selectedItemsLength,
  permissions,
  idempotencyKey,
}) => {
  const baseData = {
    order_code: orderCode,
    buyer_user_id: actorId,
    seller_user_id: sellerUserId,
    store_id: storeId,
    address_label: primaryAddress.label,
    recipient_name: primaryAddress.name,
    recipient_phone: primaryAddress.phone,
    address_details: primaryAddress.details,
    payment_method: payload.paymentMethod,
    shipping_method: selectedShippingMethod.name,
    shipping_etd: selectedShippingMethod.etd,
    shipping_fee: selectedShippingMethod.price,
    app_fee: appFee,
    subtotal,
    total,
    product_count: selectedItemsLength,
    status: "unpaid",
    paid_at: null,
  };

  try {
    await adminTablesDB.createRow({
      databaseId: config.databaseId,
      tableId: config.tables.orders,
      rowId: orderId,
      data: {
        ...baseData,
        idempotency_key: idempotencyKey || null,
      },
      permissions,
    });
  } catch (error) {
    if (!isMissingIdempotencySchemaError(error)) {
      throw error;
    }

    await adminTablesDB.createRow({
      databaseId: config.databaseId,
      tableId: config.tables.orders,
      rowId: orderId,
      data: baseData,
      permissions,
    });
  }
};

const createOrder = async ({ actorId, payload, adminTablesDB, userTablesDB }) => {
  const idempotencyKey = normalizeIdempotencyKey(payload.idempotencyKey);
  const idempotencyCacheKey = idempotencyKey
    ? getIdempotencyCacheKey(actorId, idempotencyKey)
    : null;
  if (idempotencyCacheKey) {
    const cachedOrderId = getCachedOrderId(idempotencyCacheKey);
    if (cachedOrderId) {
      return { orderId: cachedOrderId };
    }
  }
  const existingOrderIdByKey = await findOrderByIdempotencyKey({
    actorId,
    idempotencyKey,
    adminTablesDB,
  });
  if (existingOrderIdByKey) {
    if (idempotencyCacheKey) {
      setCachedOrderId(idempotencyCacheKey, existingOrderIdByKey);
    }
    return { orderId: existingOrderIdByKey };
  }

  const selectedItemsResult = await listRows(adminTablesDB, config.tables.cartItems, [
    Query.equal("user_id", [actorId]),
    Query.equal("is_selected", [true]),
  ]);

  const selectedItems = selectedItemsResult.rows;
  if (selectedItems.length === 0) {
    throw new Error("Belum ada item terpilih untuk checkout.");
  }

  const uniqueStoreIds = [...new Set(selectedItems.map((item) => item.store_id))];
  const storeOwnersById = new Map();
  await Promise.all(
    uniqueStoreIds.map(async (storeId) => {
      const storeRow = await adminTablesDB.getRow({
        databaseId: config.databaseId,
        tableId: config.tables.stores,
        rowId: storeId,
      });
      storeOwnersById.set(storeId, String(storeRow.owner_user_id || ""));
    })
  );

  const hasSelfOwnedItem = selectedItems.some((item) => {
    const owner = storeOwnersById.get(item.store_id);
    return owner && owner === actorId;
  });
  if (hasSelfOwnedItem) {
    throw new Error("Keranjang berisi produk dari toko Anda sendiri. Hapus item tersebut terlebih dahulu.");
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

  const storeIds = [...new Set(selectedItems.map((item) => item.store_id))];

  if (storeIds.length !== 1) {
    throw new Error(
      "Checkout v1 hanya mendukung item dari satu toko."
    );
  }

  const sellerUserId = storeOwnersById.get(storeIds[0]) || "";
  if (!sellerUserId) {
    throw new Error("Data pemilik toko tidak valid.");
  }
  if (sellerUserId === actorId) {
    throw new Error("Anda tidak bisa checkout produk dari toko milik sendiri.");
  }

  const selectedShippingMethod = validateShippingMethod(payload.shippingMethod);
  if (payload.paymentMethod !== "qris") {
    throw new Error("Metode pembayaran tidak didukung.");
  }

  const productIds = [...new Set(selectedItems.map((item) => item.product_id))];
  const productsResult = await listRows(adminTablesDB, config.tables.products, [
    Query.equal("$id", productIds),
  ]);
  const productsById = new Map(productsResult.rows.map((row) => [row.$id, row]));

  let subtotal = 0;
  for (const item of selectedItems) {
    const product = productsById.get(item.product_id);
    if (!product) {
      throw new Error("Produk pada keranjang tidak ditemukan.");
    }
    if (product.status !== "published") {
      throw new Error("Ada produk yang sudah tidak tersedia.");
    }
    if (product.store_id !== item.store_id) {
      throw new Error("Data keranjang tidak sinkron. Silakan muat ulang keranjang.");
    }

    const unitPrice = Number(product.price);
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error("Harga produk tidak valid.");
    }

    const quantity = normalizeQuantity(item.quantity);
    subtotal += unitPrice * quantity;
  }

  const appFee = 2500;
  const total = subtotal + selectedShippingMethod.price + appFee;
  const orderId = ID.unique();
  const orderCode = generateOrderCode();
  const permissions = buildOrderPermissions(actorId, sellerUserId);

  const expectedItems = selectedItems.map((item) => {
    const product = productsById.get(item.product_id);
    const quantity = normalizeQuantity(item.quantity);
    const unitPrice = Number(product.price);
    return {
      product_id: item.product_id,
      quantity,
      unitPrice,
    };
  });

  const existingOrderId = await findExistingUnpaidOrder({
    actorId,
    sellerUserId,
    storeId: storeIds[0],
    expectedItems,
    subtotal,
    total,
    shippingMethodName: selectedShippingMethod.name,
    shippingEtd: selectedShippingMethod.etd,
    shippingFee: selectedShippingMethod.price,
    appFee,
    adminTablesDB,
  });
  if (existingOrderId) {
    if (idempotencyCacheKey) {
      setCachedOrderId(idempotencyCacheKey, existingOrderId);
    }
    return { orderId: existingOrderId };
  }

  let orderCreated = false;
  try {
    await createOrderRow({
      adminTablesDB,
      orderId,
      orderCode,
      actorId,
      sellerUserId,
      storeId: storeIds[0],
      primaryAddress,
      payload,
      selectedShippingMethod,
      appFee,
      subtotal,
      total,
      selectedItemsLength: selectedItems.length,
      permissions,
      idempotencyKey,
    });
    orderCreated = true;

    await Promise.all(
      selectedItems.map((item) => {
        const product = productsById.get(item.product_id);
        const quantity = normalizeQuantity(item.quantity);
        const unitPrice = Number(product.price);

        return adminTablesDB.createRow({
          databaseId: config.databaseId,
          tableId: config.tables.orderItems,
          rowId: ID.unique(),
          data: {
            order_id: orderId,
            product_id: item.product_id,
            product_title: item.product_title,
            product_image_url: item.product_image_url || null,
            condition: item.condition,
            quantity,
            unit_price: unitPrice,
            total_price: unitPrice * quantity,
          },
          permissions,
        });
      })
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
  } catch (error) {
    if (orderCreated) {
      try {
        const createdItems = await listRows(adminTablesDB, config.tables.orderItems, [
          Query.equal("order_id", [orderId]),
          Query.limit(200),
        ]);
        await Promise.all(
          createdItems.rows.map((item) =>
            adminTablesDB.deleteRow({
              databaseId: config.databaseId,
              tableId: config.tables.orderItems,
              rowId: item.$id,
            })
          )
        );
        await adminTablesDB.deleteRow({
          databaseId: config.databaseId,
          tableId: config.tables.orders,
          rowId: orderId,
        });
      } catch {
        // best-effort compensation
      }
    }
    throw error;
  }

  try {
    await createNotification(adminTablesDB, {
      userId: sellerUserId,
      title: "Pesanan baru masuk",
      description: `${selectedItems.length} produk baru perlu diproses untuk order ${orderCode}.`,
      type: "order",
      label: "ORDER",
      actionUrl: `/seller/orders/detail?orderId=${orderId}`,
    });
  } catch {
    // Notification failure should not cancel successful checkout.
  }

  if (idempotencyCacheKey) {
    setCachedOrderId(idempotencyCacheKey, orderId);
  }

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
  if (!VALID_ORDER_STATUSES.has(order.status)) {
    throw new Error("Status pesanan saat ini tidak valid.");
  }

  const allowedTransitions = {
    packed: new Set(["unpaid"]),
    shipped: new Set(["packed"]),
    completed: new Set(["shipped"]),
    cancelled: new Set(["unpaid"]),
  };
  const allowedPrev = allowedTransitions[nextStatus];
  if (!allowedPrev) {
    throw new Error("Perubahan status pesanan tidak didukung.");
  }
  if (!allowedPrev.has(order.status)) {
    throw new Error("Transisi status pesanan tidak valid.");
  }

  if (nextStatus === "packed") {
    const createdAtMs = new Date(order.$createdAt).getTime();
    if (Number.isFinite(createdAtMs) && Date.now() - createdAtMs > PAYMENT_TIMEOUT_MS) {
      await adminTablesDB.updateRow({
        databaseId: config.databaseId,
        tableId: config.tables.orders,
        rowId: orderId,
        data: {
          status: "cancelled",
        },
      });
      throw new Error("Waktu pembayaran sudah habis. Pesanan otomatis dibatalkan.");
    }
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
      createdAt: now,
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
  if (order.status !== "completed") {
    throw new Error("Ulasan hanya dapat dibuat setelah pesanan selesai.");
  }

  const rating = Number(payload.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating harus berupa angka 1 sampai 5.");
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
      rating,
      review_text: String(payload.reviewText || "").trim() || null,
    },
    permissions: buildReviewPermissions(actorId),
  });

  await createNotification(adminTablesDB, {
    userId: order.seller_user_id,
    title: "Ulasan baru diterima",
    description: `Pembeli baru saja memberi rating ${rating}/5 untuk order ${order.order_code}.`,
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

const closeStore = async ({ actorId, adminTablesDB, dynamicKey }) => {
  const storeRows = await listAllRows(adminTablesDB, config.tables.stores, [
    Query.equal("owner_user_id", [actorId]),
  ]);
  if (!storeRows.length) {
    throw new Error("Toko tidak ditemukan atau sudah ditutup.");
  }

  const storage = createStorageClient(dynamicKey);
  const storeIds = storeRows.map((store) => store.$id);

  const products = await listAllRows(adminTablesDB, config.tables.products, [
    Query.equal("store_id", storeIds),
  ]);
  const productIds = products.map((product) => product.$id);

  const sellerOrders = await listAllRows(adminTablesDB, config.tables.orders, [
    Query.equal("seller_user_id", [actorId]),
  ]);
  const sellerOrderIds = sellerOrders.map((order) => order.$id);

  const conversations = await listAllRows(adminTablesDB, config.tables.conversations, [
    Query.equal("seller_user_id", [actorId]),
  ]);
  const conversationIds = conversations.map((conversation) => conversation.$id);

  const profileRows = await listAllRows(adminTablesDB, config.tables.userProfiles, [
    Query.equal("$id", [actorId]),
  ]);
  if (profileRows[0]) {
    await adminTablesDB.updateRow({
      databaseId: config.databaseId,
      tableId: config.tables.userProfiles,
      rowId: profileRows[0].$id,
      data: { role: "buyer" },
    });
  }

  if (conversationIds.length) {
    await Promise.all(
      conversationIds.map(async (conversationId) => {
        await deleteRowsByQueries(adminTablesDB, config.tables.chatMessages, [
          Query.equal("conversation_id", [conversationId]),
        ]);
      })
    );
  }

  if (sellerOrderIds.length) {
    await Promise.all(
      sellerOrderIds.map(async (orderId) => {
        await deleteRowsByQueries(adminTablesDB, config.tables.orderItems, [
          Query.equal("order_id", [orderId]),
        ]);
      })
    );
  }

  await deleteRowsByQueries(adminTablesDB, config.tables.notifications, [
    Query.equal("user_id", [actorId]),
  ]);
  await deleteRowsByQueries(adminTablesDB, config.tables.reviews, [
    Query.equal("store_id", storeIds),
  ]);
  await deleteRowsByQueries(adminTablesDB, config.tables.cartItems, [
    Query.equal("seller_user_id", [actorId]),
  ]);
  await deleteRowsByQueries(adminTablesDB, config.tables.conversations, [
    Query.equal("seller_user_id", [actorId]),
  ]);
  await deleteRowsByQueries(adminTablesDB, config.tables.orders, [
    Query.equal("seller_user_id", [actorId]),
  ]);

  if (productIds.length) {
    await Promise.all(
      productIds.map(async (productId) => {
        await deleteRowsByQueries(adminTablesDB, config.tables.favorites, [
          Query.equal("product_id", [productId]),
        ]);
        await deleteRowsByQueries(adminTablesDB, config.tables.collectionItems, [
          Query.equal("product_id", [productId]),
        ]);
      })
    );
  }

  await deleteStorageFiles(
    storage,
    config.buckets.productImages,
    products.flatMap((product) => [
      product.cover_file_id,
      ...(Array.isArray(product.gallery_file_ids)
        ? product.gallery_file_ids
        : []),
    ])
  );
  await deleteRowsByQueries(adminTablesDB, config.tables.products, [
    Query.equal("store_id", storeIds),
  ]);

  await deleteStorageFiles(
    storage,
    config.buckets.storeAssets,
    storeRows.flatMap((store) => [store.logo_file_id, store.banner_file_id])
  );
  await deleteRowsByIds(adminTablesDB, config.tables.stores, storeIds);

  return { closedStoreId: storeIds[0], closedStoreCount: storeIds.length };
};

const deleteAccount = async ({ actorId, adminTablesDB, dynamicKey }) => {
  const activeStores = await listAllRows(adminTablesDB, config.tables.stores, [
    Query.equal("owner_user_id", [actorId]),
    Query.equal("status", ["active"]),
  ]);
  if (activeStores.length > 0) {
    throw new Error(
      "Toko Anda masih aktif. Tutup toko terlebih dahulu sebelum menghapus akun."
    );
  }

  const storage = createStorageClient(dynamicKey);
  const users = createUsersClient(dynamicKey);

  const allStores = await listAllRows(adminTablesDB, config.tables.stores, [
    Query.equal("owner_user_id", [actorId]),
  ]);
  const storeIds = allStores.map((store) => store.$id);

  const allProducts =
    storeIds.length === 0
      ? []
      : await listAllRows(adminTablesDB, config.tables.products, [
          Query.equal("store_id", storeIds),
        ]);
  const productIds = allProducts.map((product) => product.$id);

  const sellerOrders = await listAllRows(adminTablesDB, config.tables.orders, [
    Query.equal("seller_user_id", [actorId]),
  ]);
  const buyerOrders = await listAllRows(adminTablesDB, config.tables.orders, [
    Query.equal("buyer_user_id", [actorId]),
  ]);
  const allOrderIds = [...new Set([...sellerOrders, ...buyerOrders].map((o) => o.$id))];

  const sellerConversations = await listAllRows(
    adminTablesDB,
    config.tables.conversations,
    [Query.equal("seller_user_id", [actorId])]
  );
  const buyerConversations = await listAllRows(
    adminTablesDB,
    config.tables.conversations,
    [Query.equal("buyer_user_id", [actorId])]
  );
  const allConversationIds = [
    ...new Set([...sellerConversations, ...buyerConversations].map((c) => c.$id)),
  ];

  if (allConversationIds.length) {
    await Promise.all(
      allConversationIds.map(async (conversationId) => {
        await deleteRowsByQueries(adminTablesDB, config.tables.chatMessages, [
          Query.equal("conversation_id", [conversationId]),
        ]);
      })
    );
  }

  if (allOrderIds.length) {
    await Promise.all(
      allOrderIds.map(async (orderId) => {
        await deleteRowsByQueries(adminTablesDB, config.tables.orderItems, [
          Query.equal("order_id", [orderId]),
        ]);
      })
    );
  }

  await deleteRowsByQueries(adminTablesDB, config.tables.addresses, [
    Query.equal("user_id", [actorId]),
  ]);
  await deleteRowsByQueries(adminTablesDB, config.tables.cartItems, [
    Query.equal("user_id", [actorId]),
  ]);
  await deleteRowsByQueries(adminTablesDB, config.tables.cartItems, [
    Query.equal("seller_user_id", [actorId]),
  ]);
  await deleteRowsByQueries(adminTablesDB, config.tables.notifications, [
    Query.equal("user_id", [actorId]),
  ]);
  await deleteRowsByQueries(adminTablesDB, config.tables.favorites, [
    Query.equal("user_id", [actorId]),
  ]);
  await deleteRowsByQueries(adminTablesDB, config.tables.collections, [
    Query.equal("user_id", [actorId]),
  ]);
  await deleteRowsByQueries(adminTablesDB, config.tables.reviews, [
    Query.equal("user_id", [actorId]),
  ]);
  if (storeIds.length > 0) {
    await deleteRowsByQueries(adminTablesDB, config.tables.reviews, [
      Query.equal("store_id", storeIds),
    ]);
  }

  if (productIds.length) {
    await Promise.all(
      productIds.map(async (productId) => {
        await deleteRowsByQueries(adminTablesDB, config.tables.collectionItems, [
          Query.equal("product_id", [productId]),
        ]);
        await deleteRowsByQueries(adminTablesDB, config.tables.favorites, [
          Query.equal("product_id", [productId]),
        ]);
      })
    );
  }

  await deleteRowsByQueries(adminTablesDB, config.tables.conversations, [
    Query.equal("seller_user_id", [actorId]),
  ]);
  await deleteRowsByQueries(adminTablesDB, config.tables.conversations, [
    Query.equal("buyer_user_id", [actorId]),
  ]);
  await deleteRowsByQueries(adminTablesDB, config.tables.orders, [
    Query.equal("seller_user_id", [actorId]),
  ]);
  await deleteRowsByQueries(adminTablesDB, config.tables.orders, [
    Query.equal("buyer_user_id", [actorId]),
  ]);

  await deleteStorageFiles(
    storage,
    config.buckets.productImages,
    allProducts.flatMap((product) => [
      product.cover_file_id,
      ...(Array.isArray(product.gallery_file_ids)
        ? product.gallery_file_ids
        : []),
    ])
  );
  if (storeIds.length > 0) {
    await deleteRowsByQueries(adminTablesDB, config.tables.products, [
      Query.equal("store_id", storeIds),
    ]);
  }

  await deleteStorageFiles(
    storage,
    config.buckets.storeAssets,
    allStores.flatMap((store) => [store.logo_file_id, store.banner_file_id])
  );
  if (storeIds.length > 0) {
    await deleteRowsByIds(adminTablesDB, config.tables.stores, storeIds);
  }

  const profileRows = await listAllRows(adminTablesDB, config.tables.userProfiles, [
    Query.equal("$id", [actorId]),
  ]);
  if (profileRows[0]) {
    await deleteStorageFiles(storage, config.buckets.profileAvatars, [
      profileRows[0].avatar_file_id,
    ]);
    await adminTablesDB.deleteRow({
      databaseId: config.databaseId,
      tableId: config.tables.userProfiles,
      rowId: profileRows[0].$id,
    });
  }

  await users.delete(actorId);

  return { deletedUserId: actorId };
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
  markOrderAsCancelled: ({ actorId, payload, adminTablesDB }) =>
    updateOrderStatus({
      actorId,
      orderId: payload.orderId,
      adminTablesDB,
      nextStatus: "cancelled",
      allowedActorField: "buyer_user_id",
      notification: {
        userId: (order) => order.seller_user_id,
        title: "Pesanan dibatalkan",
        description: (order) =>
          `Order ${order.order_code} dibatalkan oleh pembeli.`,
        label: "CANCEL",
        actionUrl: (order) => `/seller/orders/detail?orderId=${order.$id}`,
      },
    }),
  closeStore: ({ actorId, adminTablesDB, dynamicKey }) =>
    closeStore({ actorId, adminTablesDB, dynamicKey }),
  deleteAccount: ({ actorId, adminTablesDB, dynamicKey }) =>
    deleteAccount({ actorId, adminTablesDB, dynamicKey }),
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
