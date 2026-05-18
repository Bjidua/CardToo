import type { Models } from "appwrite";
import {
  Permission,
  Role,
  tablesDB,
} from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import type { UserProfile, UserProfileRow, UserRole } from "@/types";

const tableId = appwriteConfig.tables.userProfiles;
type UserProfileRecord = Models.Row & UserProfileRow;

const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses profil pengguna.";

const toUserProfile = (
  row: UserProfileRecord
): UserProfile => ({
  id: row.$id,
  username: row.username,
  email: row.email,
  role: row.role,
  full_name: row.full_name,
  phone: row.phone,
  avatar_file_id: row.avatar_file_id,
  avatar_url: row.avatar_url,
  is_active: row.is_active,
});

export const profileService = {
  async createProfile(input: {
    userId: string;
    username: string;
    email: string;
    role?: UserRole;
  }) {
    try {
      const row = await tablesDB.createRow<UserProfileRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: input.userId,
        data: {
          username: input.username,
          email: input.email,
          role: input.role || "buyer",
          full_name: null,
          phone: null,
          avatar_file_id: null,
          avatar_url: null,
          is_active: true,
        },
        permissions: [
          Permission.read(Role.user(input.userId)),
          Permission.update(Role.user(input.userId)),
          Permission.delete(Role.user(input.userId)),
        ],
      });
      return toUserProfile(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async getProfile(userId: string) {
    try {
      const row = await tablesDB.getRow<UserProfileRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: userId,
      });
      return toUserProfile(row);
    } catch {
      return null;
    }
  },

  async updateProfile(
    userId: string,
    data: Partial<
      Pick<
        UserProfileRow,
        | "username"
        | "role"
        | "full_name"
        | "phone"
        | "avatar_file_id"
        | "avatar_url"
        | "is_active"
      >
    >
  ) {
    try {
      const row = await tablesDB.updateRow<UserProfileRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: userId,
        data,
      });
      return toUserProfile(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
