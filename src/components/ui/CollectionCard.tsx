"use client";

import React from "react";
import Image from "next/image";
import { cn, getAssetPath } from "@/lib/utils";
import { motion } from "framer-motion";
import { Icons } from "./Icons";

/**
 * Properti pendukung untuk komponen kartu koleksi.
 */
interface CollectionCardProps {
  /** Judul grup koleksi */
  title: string;
  /** Jumlah total item/kartu di dalam koleksi ini */
  count: number;
  /** Kelas CSS opsional */
  className?: string;
  /** Callback navigasi ketika kartu diklik */
  onClick?: () => void;
}

/**
 * Komponen antarmuka (Card) berorientasi vertikal (aspect-4/5) untuk menampilkan
 * folder/grup koleksi pengguna. Dihiasi dengan gradien halus dan logo CardToo sebagai latar.
 */
export const CollectionCard = ({
  title,
  count,
  className,
  onClick,
}: CollectionCardProps) => {
  return (
    // Pembungkus utama menggunakan Framer Motion div dengan efek hover terangkat (y: -5) dan tap mengecil (scale: 0.95)
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col w-full aspect-4/5 bg-white rounded-card overflow-hidden",
        "shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer select-none border border-surface-muted",
        className
      )}
    >
      {/* Bagian Visual Gambar (Atas 65% area kartu) */}
      <div className="relative w-full h-[65%] bg-surface-muted flex items-center justify-center p-3 overflow-hidden">
        {/* Lapisan overlay gradasi transparan estetis */}
        <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent pointer-events-none z-10" />
        
        {/* Dekorasi lingkaran warna primary bercahaya di pojok kanan bawah yang membesar saat di-hover */}
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
        
        {/* Kontainer Gambar Logo Utama dengan efek zoom lambat (scale-110) ketika kartu di-hover */}
        <div className="relative w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 z-0">
          <Image 
            src={getAssetPath("/assets/big-logo.svg")} 
            alt="Collection Visual" 
            fill
            className="object-contain p-2"
          />
        </div>
      </div>

      {/* Bagian Informasi Teks (Bawah 35% area kartu) */}
      <div className="h-[35%] flex flex-col justify-center px-3 gap-0.5 bg-white relative">
        {/* Baris Judul Koleksi */}
        <div className="flex items-center justify-between gap-1">
          <h3 className="text-[12px] font-extrabold text-text-main line-clamp-1 leading-tight uppercase tracking-tight">
            {title}
          </h3>
          {/* Ikon panah kecil di sebelah kanan judul yang muncul (opacity-100) saat di-hover */}
          <Icons.ChevronRight size={10} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {/* Badge Jumlah Item dengan latar belakang redup (bg-primary/10) */}
        <p className="text-[10px] font-bold text-primary bg-primary/10 w-fit px-2 py-0.5 rounded-full">
          {count} Items
        </p>
      </div>
    </motion.div>
  );
};
