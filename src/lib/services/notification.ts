import type { Models } from "appwrite";
import {
  ID,
  Permission,
  Query,
  Role,
  tablesDB,
} from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import type {
  NotificationGroup,
  NotificationItem,
  NotificationRow,
} from "@/types";

// Mendefinisikan Table ID dari konfigurasi global Appwrite untuk database notifikasi
const tableId = appwriteConfig.tables.notifications;

// Tipe data representasi dokumen Notifikasi di database Appwrite yang menggabungkan model baris bawaan
type NotificationRecord = Models.Row & NotificationRow;

/**
 * Normalisasi objek error menjadi string pesan kesalahan.
 * @param error Objek error tidak dikenal
 */
const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses notifikasi.";

/**
 * Format waktu menjadi HH:MM untuk tampilan UI.
 * @param value Waktu dalam format ISO string
 */
const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

/**
 * Menentukan label grup waktu ("Hari Ini", "Kemarin", "Minggu Ini", atau "Sebelumnya")
 * berdasarkan selisih hari dari waktu saat ini.
 * 
 * @param value Waktu pembuatan dokumen dalam ISO string
 */
const groupLabelFromDate = (value: string) => {
  const createdAt = new Date(value);
  const now = new Date();
  
  // Mencari awal hari saat ini (jam 00:00:00)
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Mencari awal hari saat notifikasi dibuat (jam 00:00:00)
  const createdDayStart = new Date(
    createdAt.getFullYear(),
    createdAt.getMonth(),
    createdAt.getDate()
  );
  
  // Menghitung selisih hari dengan cara membagi selisih milidetik dengan jumlah milidetik dalam sehari
  const diffDays = Math.floor(
    (dayStart.getTime() - createdDayStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Jika selisih hari <= 0, tandai sebagai Hari Ini
  if (diffDays <= 0) return "Hari Ini";
  // Jika selisih hari === 1, tandai sebagai Kemarin
  if (diffDays === 1) return "Kemarin";
  // Jika selisih hari kurang dari seminggu, tandai sebagai Minggu Ini
  if (diffDays < 7) return "Minggu Ini";
  // Fallback sebagai Sebelumnya
  return "Sebelumnya";
};

/**
 * Memetakan rekaman data mentah notifikasi dari database Appwrite 
 * ke format antarmuka `NotificationItem` standar aplikasi.
 * 
 * @param row Dokumen baris data mentah dari database
 */
const toNotificationItem = (row: NotificationRecord): NotificationItem => ({
  id: row.$id,
  title: row.title,
  description: row.description,
  time: formatTime(row.$createdAt), // Mengubah waktu pembuatan ISO ke format jam menit (HH:MM)
  type: row.type,
  read: row.is_read,
  label: row.label || undefined,
  actionUrl: row.action_url,
});

/**
 * Kumpulan layanan untuk mengelola sistem notifikasi (seperti pesanan, sistem, dll).
 */
export const notificationService = {
  /**
   * Membuat entri notifikasi baru untuk pengguna tertentu.
   * Biasanya dipanggil secara internal (oleh sistem) saat ada event penting, misal: pesanan dibayar.
   * 
   * @param input Data lengkap notifikasi baru (userId, judul, deskripsi, jenis, label, link navigasi)
   */
  async createNotification(input: {
    userId: string;
    title: string;
    description: string;
    type: NotificationRow["type"];
    label?: string | null;
    actionUrl?: string | null;
  }) {
    try {
      // Membuat baris dokumen notifikasi baru di database
      const row = await tablesDB.createRow<NotificationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: ID.unique(), // ID acak unik
        data: {
          user_id: input.userId,
          title: input.title,
          description: input.description,
          type: input.type,
          label: input.label || null,
          action_url: input.actionUrl || null,
          is_read: false, // Default: belum dibaca saat pertama kali dibuat
        },
        permissions: [
          // Mengamankan agar hanya user bersangkutan yang bisa melihat, merubah, atau menghapus notifikasinya
          Permission.read(Role.user(input.userId)),
          Permission.update(Role.user(input.userId)),
          Permission.delete(Role.user(input.userId)),
        ],
      });

      return toNotificationItem(row);
    } catch (error) {
      // Menangani error jika user tidak memiliki otorisasi/izin untuk memicu notifikasi
      if (
        error instanceof Error &&
        /(unauthorized|permission|permissions)/i.test(error.message)
      ) {
        return null;
      }

      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengambil semua notifikasi mentah milik pengguna secara urut waktu turun (terbaru di atas).
   * 
   * @param userId ID pengguna target
   */
  async listNotifications(userId: string) {
    try {
      // Mengambil daftar notifikasi terikat user_id terurut berdasarkan waktu pembuatan terbaru
      const result = await tablesDB.listRows<NotificationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("user_id", [userId]), Query.orderDesc("$createdAt")],
      });

      // Memetakan seluruh respon dokumen mentah ke format UI
      return result.rows.map(toNotificationItem);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengambil daftar notifikasi, namun langsung dikelompokkan (grouped) 
   * berdasarkan label waktu (Hari Ini, Kemarin, dll) agar siap dirender oleh UI.
   * 
   * @param userId ID pengguna target
   */
  async listNotificationGroups(userId: string) {
    try {
      // Mengambil daftar seluruh dokumen notifikasi terurut terbaru
      const result = await tablesDB.listRows<NotificationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("user_id", [userId]), Query.orderDesc("$createdAt")],
      });

      // Mengelompokkan item notifikasi ke dalam kelompok label waktu yang bersangkutan
      const grouped = result.rows.reduce<Record<string, NotificationItem[]>>(
        (accumulator, row) => {
          const group = groupLabelFromDate(row.$createdAt);
          if (!accumulator[group]) accumulator[group] = [];
          accumulator[group].push(toNotificationItem(row));
          return accumulator;
        },
        {}
      );

      // Mengubah objek map grouped menjadi array of objects yang didukung oleh interface UI
      return Object.entries(grouped).map(([group, items]) => ({
        group,
        items,
      })) satisfies NotificationGroup[];
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Menandai suatu notifikasi sebagai "sudah dibaca".
   * 
   * @param notificationId ID unik notifikasi yang ingin ditandai
   */
  async markAsRead(notificationId: string) {
    try {
      // Mengupdate field is_read menjadi true pada baris notifikasi terkait
      await tablesDB.updateRow<NotificationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: notificationId,
        data: { is_read: true },
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
