"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { FavoriteItemCard } from "@/components/ui/FavoriteItemCard";
import { Icons } from "@/components/ui/Icons";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";
import { useAuth } from "@/context/AuthContext";
import { favoriteService } from "@/lib/services/favorite";
import { cartService } from "@/lib/services/cart";
import { normalizeProductCondition, productService } from "@/lib/services/product";
import { storeService } from "@/lib/services/store";
import type { FavoriteItem } from "@/types";

/**
 * Halaman Wishlist Favorit Pengguna (MyFavoritePage)
 * Dibungkus dengan ProtectedRoute untuk mencegah akses langsung oleh user tamu (guest).
 */
export default function MyFavoritePage() {
  return (
    <ProtectedRoute>
      <MyFavoriteContent />
    </ProtectedRoute>
  );
}

/**
 * Komponen Konten Halaman Favorit (MyFavoriteContent)
 * Menampilkan daftar item kartu TCG yang disukai/difavoritkan oleh user:
 * - Load data favorit dari database Appwrite.
 * - Hapus item dari daftar favorit (wishlist).
 * - Tambahkan item langsung dari wishlist ke keranjang belanja (Add to Cart).
 */
function MyFavoriteContent() {
  // Status autentikasi global
  const { isGuest, user } = useAuth();

  // State daftar kartu favorit terdaftar
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // State loading status pemuatan data
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Effect Hook untuk memuat wishlist favorit pengguna.
   * Dijalankan ketika status login user aktif terdeteksi.
   */
  useEffect(() => {
    if (!user) return;

    const loadFavorites = async () => {
      try {
        setIsLoading(true); // Aktifkan spinner memuat
        // Panggil endpoint service mendapatkan data favorit
        const nextFavorites = await favoriteService.listFavorites(user.id);
        setFavorites(nextFavorites);
      } finally {
        setIsLoading(false); // Matikan spinner memuat
      }
    };

    void loadFavorites();
  }, [user]);

  /**
   * Menghapus salah satu kartu dari daftar favorit pengguna di database.
   * 
   * @param productId ID unik produk kartu
   */
  const handleRemove = async (productId: string) => {
    if (!user) return;
    // Kirim request penghapusan ke database
    await favoriteService.removeFavorite(user.id, productId);
    // Perbarui state lokal dengan membuang item bersangkutan
    setFavorites((prev) => prev.filter((item) => item.productId !== productId));
  };

  /**
   * Menambahkan item favorit secara instan ke keranjang belanja global.
   * Melakukan query detail produk & toko terlebih dahulu untuk sinkronisasi metadata keranjang.
   * 
   * @param item Item favorit yang dipilih
   */
  const handleAddToCart = async (item: FavoriteItem) => {
    if (!user || !item.storeId) return;

    // Tarik detail produk dan toko secara paralel dari database
    const [product, store] = await Promise.all([
      productService.getProductById(item.productId),
      storeService.getStoreById(item.storeId),
    ]);

    if (!product || !store) return;

    const normalizedCondition = normalizeProductCondition(product.condition || "Mint");
    if (!normalizedCondition) return;

    // Tambahkan payload lengkap ke service keranjang belanja
    await cartService.addItem(user.id, {
      productId: product.id,
      sellerUserId: store.ownerUserId || "",
      storeId: store.id,
      productTitle: product.title,
      productImageUrl: product.image || null,
      storeName: store.name,
      condition: normalizedCondition,
      price: product.price,
      quantity: 1,
      isSelected: true,
    });
  };

  // Varian animasi stagger masuk untuk daftar item wishlist
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  // UI STATE 1: Proteksi tamu (guest)
  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-background">
        <StickyHeader title="My Favorite" variant="logo" size="lg" />
        <GuestEmptyState
          title="Login untuk Melihat Favorit"
          description="Simpan kartu impian Anda di wishlist agar mudah ditemukan kembali saat siap checkout."
          icon={<Icons.Favorite size={48} />}
        />
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-white to-white/95">
      {/* Header Halaman atas dengan tombol pintasan Cart */}
      <StickyHeader
        title="My Favorite"
        variant="logo"
        size="lg"
        leftAction={<BackButton variant="primary" />}
        rightAction={
          <Link
            href="/cart"
            className="p-1 hover:opacity-70 transition-opacity active:scale-90"
          >
            <button className="relative p-2 hover:bg-surface-hover rounded-full transition-colors">
              <Icons.Cart size={32} className="text-accent" />
            </button>
          </Link>
        }
      />

      <main className="flex-1 px-6 pt-6 pb-20">
        {/* Render spinner loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {favorites.length > 0 ? (
              /* Render grid list kartu favorit */
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-4"
              >
                {favorites.map((item) => (
                  <FavoriteItemCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    shopName={item.shopName}
                    price={item.price}
                    image={item.image || undefined}
                    onRemove={() => void handleRemove(item.productId)}
                    onAddToCart={() => void handleAddToCart(item)}
                  />
                ))}
              </motion.div>
            ) : (
              /* Render empty state jika wishlist kosong */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 gap-4"
              >
                <div className="w-[120px] h-[120px] bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-soft">
                  <Icons.Favorite size={64} className="text-text-sub/30" />
                </div>
                <div className="text-center">
                  <p className="text-[18px] font-bold text-text-main">Belum ada favorit</p>
                  <p className="text-[13px] text-text-sub mt-2 max-w-[220px]">
                    Simpan kartu impianmu di sini agar tidak ketinggalan!
                  </p>
                </div>
                <Link
                  href="/search"
                  className="mt-4 px-8 h-[50px] bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all inline-flex items-center"
                >
                  Cari Kartu Sekarang
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
