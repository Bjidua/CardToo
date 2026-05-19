"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { buildProductDetailHref } from "@/lib/routes";

/**
 * Properti pendukung untuk komponen ProductCard.
 */
interface ProductCardProps {
  /** Nama/judul produk kartu */
  title: string;
  /** Harga produk dalam format angka murni (akan otomatis diformat ke Rupiah) */
  price: number;
  /** URL gambar produk (akan menggunakan skeleton placeholder jika kosong) */
  image?: string;
  /** Label kondisi fisik kartu (standar TCG: Mint, Near Mint, dll) */
  condition?: "Mint" | "Near Mint" | "Excellent" | "Good" | "Played";
  /** Status apakah kartu ini sudah ada di dalam wishlist/favorit pengguna aktif */
  isWishlisted?: boolean;
  /** Ekstra CSS class */
  className?: string;
  /** URL rute spesifik saat kartu diklik (default: akan diarahkan ke /product/1) */
  href?: string;
  /** Tema kartu (primary = warna utama/ungu, secondary = warna alternatif) */
  theme?: "primary" | "secondary";
  /** Callback opsional jika ingin melakukan aksi khusus saat kartu diklik, menimpa navigasi href */
  onPress?: () => void;
  /** Callback saat tombol love/wishlist diklik */
  onWishlistToggle?: () => void;
}

/**
 * Komponen UI Card (Kartu) standar untuk menampilkan ringkasan informasi produk 
 * di halaman grid produk, beranda, dan favorit.
 * Dilengkapi dengan animasi *hover* dan gestur tekan (menggunakan Framer Motion) 
 * agar terasa lebih responsif seperti aplikasi native.
 */
export const ProductCard = ({
  title,
  price,
  image,
  condition = "Mint",
  isWishlisted = false,
  className,
  href,
  theme = "primary",
  onPress,
  onWishlistToggle,
}: ProductCardProps) => {
  // Instance router Next.js untuk navigasi antar rute detail produk
  const router = useRouter();

  /**
   * Menangani peristiwa klik pada kartu produk.
   * Jika disediakan callback kustom onPress, jalankan onPress.
   * Jika tidak, arahkan pengguna ke rute URL detail produk terkait.
   */
  const handleCardClick = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(href || buildProductDetailHref("1"));
    }
  };

  /**
   * Memformat angka desimal harga menjadi format mata uang Rupiah (IDR).
   * @param amount Angka nominal harga
   */
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    // Pembungkus kartu utama menggunakan motion.div dengan efek mereduksi skala (tap scale 0.98) saat ditekan
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col items-start p-1 gap-2",
        "w-[172px] h-[250px] bg-surface-light rounded-card",
        "shadow-soft hover:shadow-medium",
        "transition-all duration-300 cursor-pointer select-none overflow-hidden",
        className
      )}
    >
      {/* KONTENER GAMBAR UTAMA: Memiliki drop-shadow inner dan efek zoom scale-105 saat di-hover */}
      <div className="relative w-full h-[146px] bg-skeleton rounded-t-card overflow-hidden shadow-inner">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-sub/30 font-bold text-xs uppercase">
            No Image
          </div>
        )}

        {/* Badge Kondisi Produk (Mint / Near Mint / Excellent / dsb) */}
        <div className="absolute left-2 top-2 rounded-full bg-text-main/50 px-2 py-0.5 backdrop-blur-md">
          <span className="text-[8px] font-bold text-white uppercase tracking-wider">
            {condition}
          </span>
        </div>

        {/* Tombol Wishlist (Love) melayang. stopPropagation digunakan agar klik love tidak memicu navigasi detail kartu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle?.();
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm active:scale-90 transition-transform z-10"
        >
          <Heart
            size={12}
            className={cn(
              "transition-colors",
              isWishlisted ? "fill-danger text-danger" : "text-text-sub/60"
            )}
          />
        </button>
      </div>

      {/* SEKSI INFORMASI TEKS: Judul Produk (maksimal 2 baris) & Label Harga Terformat */}
      <div className="flex flex-col gap-1 px-2 w-full">
        <h3 className="text-[14px] font-bold text-text-main line-clamp-2 leading-[1.2] h-[34px]">
          {title}
        </h3>
        {/* Penentuan warna teks harga berdasarkan tema (primary = ungu, secondary = pink/cyan) */}
        <p className={cn(
          "text-[16px] font-bold mt-1",
          theme === "primary" ? "text-primary" : "text-secondary"
        )}>
          {formatPrice(price)}
        </p>
      </div>

      {/* Garis Dekoratif Halus di Bagian Bawah Kartu saat di-hover */}
      <div className="absolute bottom-1 left-4 right-4 h-1 rounded-full bg-text-main/5 opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
};

