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

const tableId = appwriteConfig.tables.notifications;
type NotificationRecord = Models.Row & NotificationRow;

const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses notifikasi.";

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

const groupLabelFromDate = (value: string) => {
  const createdAt = new Date(value);
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const createdDayStart = new Date(
    createdAt.getFullYear(),
    createdAt.getMonth(),
    createdAt.getDate()
  );
  const diffDays = Math.floor(
    (dayStart.getTime() - createdDayStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) return "Hari Ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return "Minggu Ini";
  return "Sebelumnya";
};

const toNotificationItem = (row: NotificationRecord): NotificationItem => ({
  id: row.$id,
  title: row.title,
  description: row.description,
  time: formatTime(row.$createdAt),
  type: row.type,
  read: row.is_read,
  label: row.label || undefined,
  actionUrl: row.action_url,
});

export const notificationService = {
  async createNotification(input: {
    userId: string;
    title: string;
    description: string;
    type: NotificationRow["type"];
    label?: string | null;
    actionUrl?: string | null;
  }) {
    try {
      const row = await tablesDB.createRow<NotificationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
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
        permissions: [
          Permission.read(Role.user(input.userId)),
          Permission.update(Role.user(input.userId)),
          Permission.delete(Role.user(input.userId)),
        ],
      });

      return toNotificationItem(row);
    } catch (error) {
      if (
        error instanceof Error &&
        /(unauthorized|permission|permissions)/i.test(error.message)
      ) {
        return null;
      }

      throw new Error(normalizeError(error));
    }
  },

  async listNotifications(userId: string) {
    try {
      const result = await tablesDB.listRows<NotificationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("user_id", [userId]), Query.orderDesc("$createdAt")],
      });

      return result.rows.map(toNotificationItem);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async listNotificationGroups(userId: string) {
    try {
      const result = await tablesDB.listRows<NotificationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("user_id", [userId]), Query.orderDesc("$createdAt")],
      });

      const grouped = result.rows.reduce<Record<string, NotificationItem[]>>(
        (accumulator, row) => {
          const group = groupLabelFromDate(row.$createdAt);
          if (!accumulator[group]) accumulator[group] = [];
          accumulator[group].push(toNotificationItem(row));
          return accumulator;
        },
        {}
      );

      return Object.entries(grouped).map(([group, items]) => ({
        group,
        items,
      })) satisfies NotificationGroup[];
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async markAsRead(notificationId: string) {
    try {
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
