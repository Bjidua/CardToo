import { readFile } from "node:fs/promises";

const readEnvFile = async () => {
  const raw = await readFile(".env.local", "utf8");
  return raw
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.trim().startsWith("/*"))
    .reduce((acc, line) => {
      const index = line.indexOf("=");
      if (index === -1) return acc;
      acc[line.slice(0, index).trim()] = line.slice(index + 1).trim();
      return acc;
    }, {});
};

const appwriteFetch = async (endpoint, projectId, apiKey, path, init = {}) => {
  const response = await fetch(`${endpoint}${path}`, {
    ...init,
    headers: {
      "X-Appwrite-Project": projectId,
      "X-Appwrite-Key": apiKey,
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }

  return response.json();
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForColumnAvailable = async ({
  endpoint,
  projectId,
  apiKey,
  databaseId,
  tableId,
  columnKey,
  attempts = 40,
  intervalMs = 500,
}) => {
  for (let i = 0; i < attempts; i += 1) {
    const table = await appwriteFetch(
      endpoint,
      projectId,
      apiKey,
      `/tablesdb/${databaseId}/tables/${tableId}`
    );
    const column = (table.columns || []).find((col) => col.key === columnKey);
    if (column && column.status === "available") return;
    await sleep(intervalMs);
  }
  throw new Error(
    `Column '${columnKey}' did not become available within expected time.`
  );
};

const main = async () => {
  const env = await readEnvFile();
  const endpoint = env.APPWRITE_ENDPOINT;
  const projectId = env.APPWRITE_PROJECT_ID;
  const databaseId = env.APPWRITE_DATABASE_ID;
  const apiKey = env.APPWRITE_API_KEY;
  const tableId = env.APPWRITE_TABLE_ORDERS_ID || "orders";

  if (!endpoint || !projectId || !databaseId || !apiKey) {
    throw new Error(
      "Missing APPWRITE_ENDPOINT / APPWRITE_PROJECT_ID / APPWRITE_DATABASE_ID / APPWRITE_API_KEY."
    );
  }

  const table = await appwriteFetch(
    endpoint,
    projectId,
    apiKey,
    `/tablesdb/${databaseId}/tables/${tableId}`
  );
  const existingColumns = new Set((table.columns || []).map((col) => col.key));
  const existingIndexes = new Set((table.indexes || []).map((idx) => idx.key));

  if (!existingColumns.has("idempotency_key")) {
    await appwriteFetch(
      endpoint,
      projectId,
      apiKey,
      `/tablesdb/${databaseId}/tables/${tableId}/columns/varchar`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "idempotency_key",
          size: 128,
          required: false,
          array: false,
          encrypt: false,
        }),
      }
    );
    console.log("Column `idempotency_key` created.");
    await waitForColumnAvailable({
      endpoint,
      projectId,
      apiKey,
      databaseId,
      tableId,
      columnKey: "idempotency_key",
    });
  } else {
    console.log("Column `idempotency_key` already exists.");
    await waitForColumnAvailable({
      endpoint,
      projectId,
      apiKey,
      databaseId,
      tableId,
      columnKey: "idempotency_key",
    });
  }

  if (!existingIndexes.has("orders_idempotency_key_index")) {
    await appwriteFetch(
      endpoint,
      projectId,
      apiKey,
      `/tablesdb/${databaseId}/tables/${tableId}/indexes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "orders_idempotency_key_index",
          type: "key",
          columns: ["idempotency_key"],
        }),
      }
    );
    console.log("Index `orders_idempotency_key_index` created.");
  } else {
    console.log("Index `orders_idempotency_key_index` already exists.");
  }
};

await main();
