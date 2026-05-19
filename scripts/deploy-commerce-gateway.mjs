import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

/**
 * Jalur ke berkas arsip tarball kode sumber fungsi gateway yang akan diunggah.
 * Menerima argumen CLI pertama atau menggunakan lokasi fallback default di C:/tmp.
 */
const tarPath =
  process.argv[2] || "C:/tmp/commerce-gateway.tar.gz";

// Identifikasi ID unik fungsi di Appwrite
const functionId = "commerce-gateway";
// Nama tampilan fungsi di dashboard Appwrite
const functionName = "CardToo Commerce Gateway";

/**
 * Membaca dan mem-parsing berkas `.env.local` di root proyek.
 * Mengabaikan baris kosong dan baris komentar, lalu memetakan variabel key=value menjadi objek.
 * 
 * @returns {Promise<Record<string, string>>} Objek berisi pasangan kunci-nilai environment variable
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
 * Wrapper pembungkus fetch HTTP khusus untuk memanggil API Appwrite secara aman.
 * Otomatis menyematkan header X-Appwrite-Project dan X-Appwrite-Key untuk otorisasi.
 * 
 * @param {string} endpoint - API Endpoint Appwrite
 * @param {string} projectId - Project ID Appwrite target
 * @param {string} apiKey - API Key Appwrite dengan hak akses memadai
 * @param {string} path - Rute API (misal: /functions)
 * @param {RequestInit} init - Konfigurasi tambahan fetch
 * @returns {Promise<Response>} Kembalian Response dari fetch
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

  // Jika response error, baca teks body dan lempar sebagai Exception
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }

  return response;
};

/**
 * Memastikan bahwa entitas Appwrite Function sudah terdaftar di server.
 * Jika belum ada (404), fungsi ini akan membuat fungsi baru (POST).
 * Jika sudah ada, ia akan memperbarui konfigurasinya (PUT).
 * 
 * @param {object} params
 * @param {string} params.endpoint - URL Endpoint Appwrite
 * @param {string} params.projectId - ID Proyek Appwrite
 * @param {string} params.apiKey - Kunci API proyek
 */
const ensureFunction = async ({ endpoint, projectId, apiKey }) => {
  // Cek keberadaan fungsi terlebih dahulu
  const getResponse = await fetch(`${endpoint}/functions/${functionId}`, {
    headers: {
      "X-Appwrite-Project": projectId,
      "X-Appwrite-Key": apiKey,
    },
  });

  // Skema konfigurasi dasar untuk fungsi Appwrite
  const body = {
    functionId,
    name: functionName,
    runtime: "node-22",
    execute: ["users"], // Hak eksekusi diberikan kepada pengguna terdaftar
    events: [],
    schedule: "",
    timeout: 30,
    enabled: true,
    logging: true,
    entrypoint: "src/main.js",
    commands: "npm install",
    scopes: [
      "rows.read",
      "rows.write",
      "files.read",
      "files.write",
      "users.read",
      "users.write",
    ],
  };

  // Jika fungsi sudah ada di server, lakukan update konfigurasi (PUT)
  if (getResponse.ok) {
    await appwriteFetch(endpoint, projectId, apiKey, `/functions/${functionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return;
  }

  // Jika gagal memeriksa karena alasan lain selain tidak ditemukan (404), lempar error
  if (getResponse.status !== 404) {
    throw new Error(await getResponse.text());
  }

  // Jika benar-benar belum ada, buat entitas fungsi baru (POST)
  await appwriteFetch(endpoint, projectId, apiKey, "/functions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

/**
 * Mengunggah file arsip kode sumber (tarball) ke Appwrite Function sebagai deployment aktif.
 * Menggunakan format multipart/form-data.
 * 
 * @param {object} params
 * @param {string} params.endpoint - URL Endpoint Appwrite
 * @param {string} params.projectId - ID Proyek Appwrite
 * @param {string} params.apiKey - Kunci API proyek
 */
const uploadDeployment = async ({ endpoint, projectId, apiKey }) => {
  // Membaca file biner gzip tarball
  const fileBuffer = await readFile(tarPath);
  const file = new File([fileBuffer], "commerce-gateway.tar.gz", {
    type: "application/gzip",
  });
  
  // Mengonstruksi payload form-data untuk kebutuhan unggah berkas deployment
  const form = new FormData();
  form.set("activate", "true"); // Tandai agar langsung diaktifkan setelah build selesai
  form.set("entrypoint", "src/main.js");
  form.set("commands", "npm install");
  form.set("code", file);

  await appwriteFetch(
    endpoint,
    projectId,
    apiKey,
    `/functions/${functionId}/deployments`,
    {
      method: "POST",
      body: form,
    }
  );
};

/**
 * Titik masuk utama eksekusi skrip deployment.
 * Memvalidasi keberadaan file tarball, memuat konfigurasi dari .env.local,
 * memastikan entitas fungsi ada, kemudian mengunggah kode fungsi tersebut.
 */
const main = async () => {
  // Pastikan file tarball sumber benar-benar ada di lokal sebelum lanjut
  if (!existsSync(tarPath)) {
    throw new Error(`Deployment package not found: ${tarPath}`);
  }

  // Ambil data konfigurasi server dari berkas env lokal
  const env = await readEnvFile();
  const endpoint = env.APPWRITE_ENDPOINT;
  const projectId = env.APPWRITE_PROJECT_ID;
  const apiKey = env.APPWRITE_API_KEY;

  if (!endpoint || !projectId || !apiKey) {
    throw new Error("Missing APPWRITE_ENDPOINT / APPWRITE_PROJECT_ID / APPWRITE_API_KEY.");
  }

  // Lakukan inisialisasi entitas fungsi di server
  await ensureFunction({ endpoint, projectId, apiKey });
  // Unggah paket deployment aktif
  await uploadDeployment({ endpoint, projectId, apiKey });

  console.log("commerce-gateway function ensured and deployment uploaded.");
};

// Jalankan fungsi utama
await main();
