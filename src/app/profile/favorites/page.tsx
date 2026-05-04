"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { FavoriteItemCard } from "@/components/ui/FavoriteItemCard";
import { Icons } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";

const DUMMY_FAVORITES = [
  {
    id: "1",
    title: "Pikachu VMAX Rainbow",
    shopName: "Pokemon Center",
    price: 3500000,
  },
  {
    id: "2",
    title: "Luffy Gear 5 Card",
    shopName: "Onepiece Shop",
    price: 1250000,
  },
  {
    id: "3",
    title: "Blue Eyes White Dragon",
    shopName: "Yu-Gi-Oh! Official",
    price: 5000000,
  },
  {
    id: "4",
    title: "Charizard GX Shiny",
    shopName: "TCG Master",
    price: 2800000,
  },
  {
    id: "5",
    title: "Mewtwo EX Full Art",
    shopName: "Card House",
    price: 1500000,
  },
];

export default function MyFavoritePage() {
  const [favorites, setFavorites] = useState(DUMMY_FAVORITES);

  const handleRemove = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-[#F6DFFF]">
      <StickyHeader
        title="My Favorite"
        variant="logo"
        size="lg"
        leftAction={<BackButton variant="primary" />}
        rightAction={
          <button className="relative p-2 hover:bg-black/5 rounded-full transition-colors">
            <Icons.Cart size={24} className="text-black/60" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        }
      />

      <main className="flex-1 px-6 pt-6 pb-20">
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
                  onRemove={() => handleRemove(item.id)}
                  onAddToCart={() => console.log("Added to cart", item.id)}
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
                <Icons.Favorite size={64} className="text-black/10" />
              </div>
              <div className="text-center">
                <p className="text-[18px] font-bold text-black/80">Belum ada favorit</p>
                <p className="text-[13px] text-black/30 mt-2 max-w-[220px]">
                  Simpan kartu impianmu di sini agar tidak ketinggalan!
                </p>
              </div>
              <button className="mt-4 px-8 h-[50px] bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all">
                Cari Kartu Sekarang
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
