import { readFile } from "node:fs/promises";

/**
 * Membaca dan mem-parsing berkas `.env.local` di root proyek.
 * Mengabaikan komentar dan baris kosong, lalu memetakan variabel key=value menjadi objek.
 * 
 * @returns {Promise<Record<string, string>>} Pasangan kunci-nilai environment variable
 */
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

/**
 * Wrapper pembungkus fetch HTTP khusus untuk memanggil API Appwrite TablesDB secara aman.
 * Otomatis menyematkan header X-Appwrite-Project dan X-Appwrite-Key untuk otorisasi.
 * Mengembalikan objek JSON dari body response.
 * 
 * @param {string} endpoint - API Endpoint Appwrite
 * @param {string} projectId - Project ID Appwrite
 * @param {string} apiKey - API Key Appwrite
 * @param {string} path - Rute API (misal: /tablesdb/{databaseId}/tables/{tableId})
 * @param {RequestInit} init - Konfigurasi tambahan fetch
 * @returns {Promise<any>} Response body hasil parse JSON
 */
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

/**
 * Fungsi pembantu untuk memberikan jeda waktu (delay) asinkron.
 * 
 * @param {number} ms - Durasi jeda dalam milidetik
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Melakukan polling berulang ke API Appwrite TablesDB untuk memastikan kolom baru yang baru saja dibuat
 * statusnya sudah berubah menjadi "available" dan siap digunakan untuk operasi database/migrasi data.
 * 
 * @param {object} params
 * @param {string} params.endpoint - URL Endpoint Appwrite
 * @param {string} params.projectId - ID Proyek Appwrite
 * @param {string} params.apiKey - Kunci API proyek
 * @param {string} params.databaseId - ID Database TablesDB
 * @param {string} params.tableId - ID Tabel target
 * @param {string} params.columnKey - Kunci nama kolom yang ditunggu (misal: idempotency_key)
 * @param {number} [params.attempts=40] - Jumlah maksimal percobaan polling
 * @param {number} [params.intervalMs=500] - Interval jeda setiap percobaan polling dalam ms
 */
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
    // Ambil skema tabel terbaru
    const table = await appwriteFetch(
      endpoint,
      projectId,
      apiKey,
      `/tablesdb/${databaseId}/tables/${tableId}`
    );
    // Cari kolom target dari list kolom tabel
    const column = (table.columns || []).find((col) => col.key === columnKey);
    // Jika status kolom sudah "available", hentikan iterasi dan return berhasil
    if (column && column.status === "available") return;
    // Jika belum tersedia, tunggu sebelum mencoba lagi
    await sleep(intervalMs);
  }
  throw new Error(
    `Column '${columnKey}' did not become available within expected time.`
  );
};

/**
 * Fungsi utama migrasi skema tabel "orders" di database TablesDB.
 * Skrip ini memastikan:
 * 1. Kolom "idempotency_key" (tipe varchar/string, opsional) dibuat di tabel orders.
 * 2. Index "orders_idempotency_key_index" tipe "key" dibuat untuk kolom tersebut demi efisiensi query pencarian.
 */
const main = async () => {
  // Ambil variabel environment lokal
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

  // Dapatkan skema database tabel orders saat ini
  const table = await appwriteFetch(
    endpoint,
    projectId,
    apiKey,
    `/tablesdb/${databaseId}/tables/${tableId}`
  );
  // Buat mapping nama kolom dan indeks yang sudah ada untuk validasi keberadaan
  const existingColumns = new Set((table.columns || []).map((col) => col.key));
  const existingIndexes = new Set((table.indexes || []).map((idx) => idx.key));

  // LANGKAH 1: Buat kolom idempotency_key jika belum terdaftar
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
          required: false, // Bersifat opsional untuk backward-compatibility transaksi lama
          array: false,
          encrypt: false,
        }),
      }
    );
    console.log("Column `idempotency_key` created.");
    // Polling hingga status kolom siap dipakai
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

  // LANGKAH 2: Buat indeks orders_idempotency_key_index jika belum terdaftar
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

// Jalankan migrasi
await main();
