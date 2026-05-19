import {
  Account,
  Channel,
  Client,
  ExecutionMethod,
  Functions,
  ID,
  Realtime,
  Permission,
  Query,
  Role,
  Storage,
  TablesDB,
} from "appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";

// Inisialisasi instance klien Appwrite menggunakan endpoint dan Project ID dari konfigurasi
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

/** Ekspor klien utama untuk digunakan di layanan/komponen lain jika diperlukan */
export const appwriteClient = client;

/** Modul akun Appwrite untuk mengelola otentikasi sesi, login, register, dan logout */
export const account = new Account(client);

/** Modul database Appwrite TablesDB untuk berinteraksi dengan koleksi data tabel */
export const tablesDB = new TablesDB(client);

/** Modul storage Appwrite untuk mengunggah, mengunduh, dan menghapus file media (gambar) */
export const storage = new Storage(client);

/** Modul functions Appwrite untuk menjalankan Serverless Cloud Functions secara dinamis */
export const functions = new Functions(client);

/** Modul realtime Appwrite untuk menerima update data database secara instan (realtime) via WebSocket */
export const realtime = new Realtime(client);

// Ekspor kembali tipe data dan utilitas pembantu Appwrite bawaan agar mudah di-import secara sentral
export { Channel, ExecutionMethod, ID, Permission, Query, Role };
