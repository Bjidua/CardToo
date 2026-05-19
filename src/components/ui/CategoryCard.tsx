"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Properti pendukung komponen CategoryCard.
 */
interface CategoryCardProps {
  /** Nama kategori (misal: "Pokemon", "Yu-Gi-Oh!") */
  name: string;
  /** Ikon React untuk merepresentasikan kategori tersebut */
  icon?: React.ReactNode;
  /** Callback ketika tombol kategori diklik */
  onClick?: () => void;
  /** Ekstra CSS class */
  className?: string;
}

/**
 * Komponen tombol berbentuk kartu lebar untuk menampilkan pilihan kategori utama.
 * Memiliki ikon chevron di bagian kanan untuk indikasi navigasi.
 */
export const CategoryCard = ({ name, icon, onClick, className }: CategoryCardProps) => {
  return (
    // Motion button dengan respon mengecil sedikit (scale 0.98) saat diketuk (tap) di perangkat seluler
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full h-[73px] bg-white rounded-card px-5 shadow-soft active:shadow-none transition-all",
        className
      )}
    >
      <div className="flex items-center gap-[15px]">
        {/* Kontainer Ikon Kategori dengan background abu-abu terang bulat halus (rounded-16px) */}
        <div className="w-[41px] h-[41px] bg-surface-hover rounded-card flex items-center justify-center overflow-hidden">
          {icon || <div className="w-full h-full bg-surface-hover" />}
        </div>
        
        {/* Label Judul Kategori */}
        <span className="text-[18px] font-normal text-text-main font-dm-sans">
          {name}
        </span>
      </div>

      {/* Indikator Navigasi: Ikon Chevron kanan */}
      <ChevronRight size={20} className="text-text-main" />
    </motion.button>
  );
};
