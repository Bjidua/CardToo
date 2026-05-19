"use client";

import React from "react";
import { BackButton } from "@/components/ui/BackButton";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { motion } from "framer-motion";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { useRouter } from "next/navigation";

// Daftar statis kategori kartu TCG yang didukung oleh aplikasi
const CATEGORIES = [
  { name: "Pokemon" },
  { name: "Boboiboy" },
  { name: "Onepiece" },
  { name: "Digimon" },
  { name: "Yu-Gi-Oh!" },
];

/**
 * Halaman Semua Kategori (AllCategoriesPage)
 * Menampilkan daftar kategori kartu TCG secara vertikal dengan animasi fade-in berjenjang (stagger).
 */
export default function AllCategoriesPage() {
  // Instance router Next.js untuk perpindahan ke halaman slug kategori produk
  const router = useRouter();

  /**
   * Menangani pemilihan kategori.
   * Mengarahkan ke rute kategori dinamis berdasarkan nama kategori yang di-slug-kan.
   */
  const handleCategorySelect = (name: string) => {
    router.push(`/categories/${name.toLowerCase()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      {/* Bagian Header atas dengan tombol kembali */}
      <StickyHeader
        title="All Category"
        leftAction={<BackButton variant="primary" />}
      />

      {/* Main daftar kategori */}
      <main className="flex-1 px-4 pt-4 pb-20">
        <div className="flex flex-col gap-4 max-w-[361px] mx-auto">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              // Penundaan transisi masuk berurutan (stagger delay)
              transition={{ delay: index * 0.05 }}
            >
              <CategoryCard 
                name={category.name} 
                onClick={() => handleCategorySelect(category.name)}
              />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
