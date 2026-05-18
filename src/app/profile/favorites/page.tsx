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

export default function MyFavoritePage() {
  return (
    <ProtectedRoute>
      <MyFavoriteContent />
    </ProtectedRoute>
  );
}

function MyFavoriteContent() {
  const { isGuest, user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        const nextFavorites = await favoriteService.listFavorites(user.id);
        setFavorites(nextFavorites);
      } finally {
        setIsLoading(false);
      }
    };

    void loadFavorites();
  }, [user]);

  const handleRemove = async (productId: string) => {
    if (!user) return;
    await favoriteService.removeFavorite(user.id, productId);
    setFavorites((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleAddToCart = async (item: FavoriteItem) => {
    if (!user || !item.storeId) return;

    const [product, store] = await Promise.all([
      productService.getProductById(item.productId),
      storeService.getStoreById(item.storeId),
    ]);

    if (!product || !store) return;

    const normalizedCondition = normalizeProductCondition(product.condition || "Mint");
    if (!normalizedCondition) return;

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

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
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {favorites.length > 0 ? (
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
