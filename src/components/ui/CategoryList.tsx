"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

/**
 * Properti pendukung untuk komponen daftar gulir kategori.
 */
interface CategoryListProps {
  /** Daftar nama string kategori yang tersedia */
  categories?: string[];
  /** Kategori yang sedang aktif terpilih saat ini */
  activeCategory?: string;
  /** Callback ketika pengguna memilih salah satu chip kategori */
  onSelect?: (category: string) => void;
  /** Ekstra CSS class */
  className?: string;
}

/**
 * Komponen daftar kategori bergaya pill (chip) yang bisa di-scroll secara horizontal.
 * Digunakan di halaman beranda (Home) atau filter pencarian untuk 
 * memudahkan pengguna berpindah kategori TCG secara cepat.
 */
export const CategoryList = ({
  categories = ["All", "Pokemon", "Boboiboy", "Onepiece", "Digimon", "Yu-Gi-Oh!"],
  activeCategory: externalActiveCategory,
  onSelect,
  className,
}: CategoryListProps) => {
  // Inisialisasi router Next.js untuk navigasi antar kategori
  const router = useRouter();
  
  // State internal untuk menyimpan kategori aktif jika tidak disuplai secara eksternal (uncontrolled component)
  const [internalActiveCategory, setInternalActiveCategory] = useState("All");
  
  // Penentuan kategori terpilih (memprioritaskan properti eksternal jika dikirimkan)
  const activeCategory = externalActiveCategory || internalActiveCategory;

  /**
   * Menangani peristiwa klik kategori oleh pengguna.
   * Mengatur kategori aktif, memicu callback onSelect, atau mengarahkan navigasi ke rute kategori yang bersangkutan.
   * @param category Kategori target
   */
  const handleSelect = (category: string) => {
    setInternalActiveCategory(category);
    if (onSelect) {
      onSelect(category);
    } else if (category !== "All") {
      router.push(`/categories/${category.toLowerCase()}`);
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      {/* BAGIAN HEADER: Judul Kategori & Tombol Tampilkan Semua */}
      <div className="flex items-center justify-between px-6">
        <h2 className="text-[20px] font-bold text-text-main tracking-tight">
          Categories
        </h2>
        <Link href="/categories">
          <button className="text-[14px] font-bold text-primary hover:opacity-70 transition-opacity active:scale-95">
            See All
          </button>
        </Link>
      </div>

      {/* AREA SCROLL KATEGORI: Di-scroll secara horizontal dengan scrollbar disembunyikan */}
      <div className="w-full overflow-x-scroll scrollbar-hide pb-2 touch-pan-x relative z-10">
        <div className="flex items-center gap-2 px-6 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleSelect(category)}
              // Mengubah visual background tombol chip jika berstatus aktif terpilih (warna putih dengan shadow)
              className={cn(
                "whitespace-nowrap shrink-0 relative px-6 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 select-none",
                activeCategory === category
                  ? "bg-white text-text-main shadow-medium"
                  : "bg-transparent text-text-sub hover:text-text-main"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
