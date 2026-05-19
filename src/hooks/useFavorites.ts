"use client";

import React from "react";
import { favoriteService } from "@/lib/services/favorite";

/**
 * Custom hook untuk mengelola state daftar produk favorit secara lokal dan menyinkronkannya
 * dengan Appwrite backend melalui favoriteService.
 * 
 * @param userId - ID pengguna yang sedang login. Jika tidak ada, state akan kosong.
 * @returns Objek yang berisi state favorit dan fungsi untuk menambah/menghapus favorit
 */
export const useFavorites = (userId?: string | null) => {
  // Menyimpan daftar ID produk yang difavoritkan secara lokal agar pembaruan visual instan
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>([]);
  // Mengelola state loading saat penarikan daftar ID favorit awal dari database
  const [isLoading, setIsLoading] = React.useState(false);

  // Efek samping untuk memuat daftar ID produk favorit saat komponen pertama kali dirender atau userId berubah
  React.useEffect(() => {
    if (!userId) return;

    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        const ids = await favoriteService.listFavoriteProductIds(userId);
        setFavoriteIds(ids);
      } finally {
        setIsLoading(false);
      }
    };

    void loadFavorites();
  }, [userId]);

  /**
   * Fungsi untuk mengubah status favorit suatu produk.
   * Akan memanggil backend Appwrite, lalu memperbarui state lokal berdasarkan hasilnya.
   * 
   * @param productId - ID produk yang akan ditambahkan atau dihapus dari favorit
   * @returns boolean - true jika sekarang menjadi favorit, false jika dihapus
   */
  const toggleFavorite = async (productId: string) => {
    if (!userId) return false;

    // Lakukan pemanggilan service toggle di database
    const isNowFavorite = await favoriteService.toggleFavorite(userId, productId);
    
    // Perbarui state lokal favoriteIds agar komponen visual (seperti tombol hati) langsung merespon tanpa reload
    setFavoriteIds((prev) =>
      isNowFavorite ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
    return isNowFavorite;
  };

  return {
    /** Daftar ID produk yang difavoritkan pengguna saat ini */
    favoriteIds: userId ? favoriteIds : [],
    /** Status proses fetching data favorit pertama kali */
    isLoading,
    /** Fungsi utilitas untuk mengecek apakah suatu ID produk ada di daftar favorit */
    isFavorite: (productId: string) =>
      (userId ? favoriteIds : []).includes(productId),
    toggleFavorite,
  };
};
