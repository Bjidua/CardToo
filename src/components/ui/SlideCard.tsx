"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Properti pendukung untuk kartu tayangan geser (SlideCard).
 */
interface SlideCardProps {
  /** Teks sub-judul promosi (default: 'Promotion') */
  promotion?: string;
  /** Judul banner */
  title?: string;
  /** Deskripsi banner */
  description?: string;
  /** CSS class tambahan */
  className?: string;
  /** URL gambar promosi di sebelah kanan */
  image?: string;
}

/**
 * Komponen Banner Promo berorientasi horizontal lebar.
 * Biasa diletakkan di carousel bagian atas beranda (Home) untuk menarik 
 * perhatian pengguna ke penawaran/diskon terbaru.
 */
export const SlideCard = ({
  promotion = "Promotion",
  title,
  description,
  className,
  image,
}: SlideCardProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-row items-center justify-center p-[10px] gap-[10px]",
        // Ukuran lebar banner responsif maksimal 361px, tinggi 150px sesuai grid beranda
        "w-full max-w-[361px] h-[150px] bg-surface-light rounded-card",
        "shadow-soft",
        "overflow-hidden select-none", // Native App Feel (mematikan seleksi teks)
        className
      )}
    >
      {/* Sisi Kiri: Rincian Promosi (Sub-judul, Judul Promo, Deskripsi) */}
      <div className="flex flex-col flex-1 gap-1 px-4 z-20">
        <span className="text-primary font-bold text-[16px] leading-[19px] uppercase tracking-wider">
          {promotion}
        </span>
        {title && (
          <h3 className="text-[20px] font-bold text-text-main leading-tight">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-[12px] text-text-sub font-medium leading-normal">
            {description}
          </p>
        )}
      </div>

      {/* Sisi Kanan: Ilustrasi Visual Gambar Promosi */}
      {image && (
        <div className="w-[120px] h-full relative">
          {/* Efek denyut pemuat gambar promosi (animasi pulse) */}
          <div className="absolute inset-0 bg-surface-hover rounded-lg animate-pulse" />
        </div>
      )}
    </div>
  );
};
