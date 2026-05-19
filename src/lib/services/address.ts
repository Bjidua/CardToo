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

// Mendefinisikan Table ID untuk alamat pengiriman (Addresses)
const tableId = appwriteConfig.tables.addresses;

// Tipe data representasi dokumen Alamat di database Appwrite yang menggabungkan model baris bawaan
type AddressRecord = Models.Row & AddressRow;

/** 
 * Normalisasi objek error menjadi string pesan kesalahan.
 * @param error Objek error tidak dikenal
 */
const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses alamat.";

/**
 * Memetakan baris alamat mentah dari database Appwrite
 * ke format antarmuka Address yang bersih untuk digunakan oleh UI.
 * 
 * @param row Baris data alamat mentah
 */
const toAddress = (row: AddressRecord): Address => ({
  id: row.$id,
  label: row.label,
  name: row.name,
  phone: row.phone,
  details: row.details,
  isPrimary: row.is_primary,
});

/**
 * Membuat aturan perizinan agar data alamat eksklusif (hanya bisa diakses 
 * dan diubah oleh pemiliknya/pembeli tersebut).
 * 
 * @param userId ID pembeli pemilik alamat
 */
const buildPermissions = (userId: string) => [
  Permission.read(Role.user(userId)),
  Permission.update(Role.user(userId)),
  Permission.delete(Role.user(userId)),
];

/**
 * Memastikan hanya ada 1 alamat utama per pengguna. 
 * Fungsi ini me-reset flag is_primary alamat lainnya menjadi false, 
 * dan alamat target menjadi true.
 * 
 * @param userId - ID Pengguna
 * @param nextPrimaryId - ID alamat yang akan dijadikan alamat utama
 */
const resetPrimaryFlags = async (userId: string, nextPrimaryId?: string) => {
  // Ambil semua daftar alamat milik pengguna
  const result = await tablesDB.listRows<AddressRecord>({
    databaseId: appwriteConfig.databaseId,
    tableId,
    queries: [Query.equal("user_id", [userId])],
  });

  // Perbarui status is_primary pada seluruh alamat secara paralel
  await Promise.all(
    result.rows
      // Hanya lakukan pembaruan pada baris alamat yang status is_primary nya perlu diubah
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

/**
 * Layanan untuk mengelola Buku Alamat (Address Book) milik pembeli.
 */
export const addressService = {
  /**
   * Mengambil semua daftar alamat milik pengguna.
   * 
   * @param userId ID pengguna
   */
  async listAddresses(userId: string) {
    try {
      // Ambil seluruh baris alamat terikat user_id terkait
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

  /**
   * Mengambil satu alamat yang ditandai sebagai alamat utama (Primary).
   * Digunakan untuk opsi default saat checkout.
   * 
   * @param userId ID pengguna
   */
  async getPrimaryAddress(userId: string) {
    try {
      // Cari alamat milik user_id yang memiliki field is_primary bernilai true
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

  /**
   * Membuat alamat baru.
   * Jika pengguna belum punya alamat sama sekali, maka alamat ini otomatis
   * dijadikan alamat utama terlepas dari opsi isPrimary.
   * 
   * @param userId ID pengguna
   * @param input Data input alamat (label, nama, hp, rincian, status utama)
   */
  async createAddress(userId: string, input: CreateAddressInput) {
    try {
      const existing = await this.listAddresses(userId);
      // Jika ini adalah alamat pertama yang didaftarkan, paksa statusnya menjadi alamat utama
      const shouldBePrimary =
        input.isPrimary === true || existing.length === 0;

      // Tulis baris alamat baru ke database
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

      // Jika alamat baru ditandai sebagai utama, reset flag is_primary alamat lama lainnya
      if (shouldBePrimary) {
        await resetPrimaryFlags(userId, row.$id);
      }

      return toAddress(row);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Menjadikan alamat spesifik sebagai alamat utama yang baru.
   * 
   * @param userId ID pengguna
   * @param addressId ID alamat target
   */
  async setPrimaryAddress(userId: string, addressId: string) {
    try {
      // Lakukan reset flag is_primary ke alamat target
      await resetPrimaryFlags(userId, addressId);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Menghapus alamat dari buku alamat.
   * Jika yang dihapus adalah alamat utama, maka alamat lain yang tersisa (jika ada) 
   * akan otomatis di-promote menjadi alamat utama pengganti.
   * 
   * @param userId ID pengguna
   * @param addressId ID alamat target yang ingin dihapus
   */
  async deleteAddress(userId: string, addressId: string) {
    try {
      // Ambil daftar alamat saat ini sebelum proses penghapusan dilakukan
      const currentRows = await tablesDB.listRows<AddressRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.equal("user_id", [userId])],
      });

      const deletedRow = currentRows.rows.find((row) => row.$id === addressId);

      // Hapus baris alamat terkait dari database
      await tablesDB.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: addressId,
      });

      // Jika alamat yang dihapus sebelumnya adalah alamat utama, tentukan alamat pengganti secara otomatis
      if (deletedRow?.is_primary) {
        const nextRows = currentRows.rows.filter((row) => row.$id !== addressId);
        // Ambil alamat pertama yang tersisa dan tandai sebagai alamat utama baru
        if (nextRows[0]) {
          await resetPrimaryFlags(userId, nextRows[0].$id);
        }
      }
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
