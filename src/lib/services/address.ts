import type { Models } from "appwrite";
import {
  ID,
  Permission,
  Query,
  Role,
  tablesDB,
} from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import type { Address, AddressRow, CreateAddressInput } from "@/types";

const tableId = appwriteConfig.tables.addresses;
type AddressRecord = Models.Row & AddressRow;

const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses alamat.";

const toAddress = (row: AddressRecord): Address => ({
  id: row.$id,
  label: row.label,
  name: row.name,
  phone: row.phone,
  details: row.details,
  isPrimary: row.is_primary,
});

const buildPermissions = (userId: string) => [
  Permission.read(Role.user(userId)),
  Permission.update(Role.user(userId)),
  Permission.delete(Role.user(userId)),
];

const resetPrimaryFlags = async (userId: string, nextPrimaryId?: string) => {
  const result = await tablesDB.listRows<AddressRecord>({
    databaseId: appwriteConfig.databaseId,
    tableId,
    queries: [Query.equal("user_id", [userId])],
  });

  await Promise.all(
    result.rows
      .filter((row) => row.is_primary !== (row.$id === nextPrimaryId))
      .map((row) =>
        tablesDB.updateRow<AddressRecord>({
          databaseId: appwriteConfig.databaseId,
          tableId,
          rowId: row.$id,
          data: {
            is_primary: row.$id === nextPrimaryId,
          },
        })
      )
  );
};

export const addressService = {
  async listAddresses(userId: string) {
    try {
      const result = await tablesDB.listRows<AddressRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("user_id", [userId])],
      });

      return result.rows.map(toAddress);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async getPrimaryAddress(userId: string) {
    try {
      const result = await tablesDB.listRows<AddressRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [
          Query.equal("user_id", [userId]),
          Query.equal("is_primary", [true]),
        ],
      });

      const primary = result.rows[0];
      return primary ? toAddress(primary) : null;
    } catch {
      return null;
    }
  },

  async createAddress(userId: string, input: CreateAddressInput) {
    try {
      const existing = await this.listAddresses(userId);
      const shouldBePrimary =
        input.isPrimary === true || existing.length === 0;

      const row = await tablesDB.createRow<AddressRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: ID.unique(),
        data: {
          user_id: userId,
          label: input.label.trim(),
          name: input.name.trim(),
          phone: input.phone.trim(),
          details: input.details.trim(),
          is_primary: shouldBePrimary,
        },
        permissions: buildPermissions(userId),
      });

      if (shouldBePrimary) {
        await resetPrimaryFlags(userId, row.$id);
      }

      return toAddress(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async setPrimaryAddress(userId: string, addressId: string) {
    try {
      await resetPrimaryFlags(userId, addressId);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async deleteAddress(userId: string, addressId: string) {
    try {
      const currentRows = await tablesDB.listRows<AddressRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("user_id", [userId])],
      });

      const deletedRow = currentRows.rows.find((row) => row.$id === addressId);

      await tablesDB.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: addressId,
      });

      if (deletedRow?.is_primary) {
        const nextRows = currentRows.rows.filter((row) => row.$id !== addressId);
        if (nextRows[0]) {
          await resetPrimaryFlags(userId, nextRows[0].$id);
        }
      }
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
