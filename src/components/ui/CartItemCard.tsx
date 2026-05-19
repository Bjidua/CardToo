"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icons } from "./Icons";
import { Checkbox } from "./Checkbox";
import { motion } from "framer-motion";

/**
 * Properti pendukung untuk komponen item keranjang belanja.
 */
interface CartItemCardProps {
  /** Judul atau nama produk */
  title: string;
  /** Nama toko penjual produk tersebut */
  shopName: string;
  /** Harga per 1 unit produk (belum dikalikan kuantitas) */
  price: number;
  /** Jumlah kuantitas produk yang dimasukkan ke keranjang */
  quantity: number;
  /** URL gambar produk (opsional) */
  image?: string;
  /** Status apakah item ini dicentang (dipilih) untuk di-checkout */
  isChecked?: boolean;
  /** Callback saat status centang (checkbox) berubah */
  onCheck?: (checked: boolean) => void;
  /** Callback saat tombol tambah (+) ditekan */
  onIncrement?: () => void;
  /** Callback saat tombol kurangi (-) ditekan */
  onDecrement?: () => void;
  /** Callback saat tombol hapus (silang/X) ditekan */
  onRemove?: () => void;
  /** Kelas CSS tambahan */
  className?: string;
}

/**
 * Komponen UI untuk menampilkan satu buah baris produk di dalam daftar Keranjang (Cart).
 * Memuat fitur checkbox, gambar, detail singkat, serta kontrol kuantitas (+/-).
 * Menggunakan Framer Motion untuk animasi tata letak (layout animation).
 */
export const CartItemCard = ({
  title,
  shopName,
  price,
  quantity,
  image,
  isChecked = false,
  onCheck,
  onIncrement,
  onDecrement,
  onRemove,
  className,
}: CartItemCardProps) => {
  return (
    // Menggunakan motion.div untuk mendukung animasi layout, transisi saat item ditambahkan, dirubah, atau dihapus
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      // Jika item dicentang (dipilih), ubah latar belakang menjadi kebiruan lembut (primary/2)
      className={cn(
        "relative flex items-center gap-4 p-4 w-full h-[120px] bg-white rounded-card shadow-soft border border-surface-muted transition-all duration-300",
        isChecked && "border-primary/20 bg-primary/2",
        className
      )}
    >
      {/* Sisi Kiri: Checkbox Centangan & Miniatur Gambar Sampul Kartu */}
      <div className="flex items-center gap-3">
        <Checkbox 
          checked={isChecked}
          onChange={(e) => onCheck?.(e.target.checked)}
        />
        <div className="w-[60px] h-[85px] bg-surface-muted rounded-lg overflow-hidden shrink-0 shadow-sm border border-surface-muted">
          {image ? (
            <Image
              src={image}
              alt={title}
              width={60}
              height={85}
              className="w-full h-full object-cover"
            />
          ) : (
            // Tampilkan ikon placeholder jika file gambar produk tidak tersedia
            <div className="w-full h-full flex items-center justify-center text-text-sub/30">
              <Icons.Collection size={24} />
            </div>
          )}
        </div>
      </div>

      {/* Sisi Kanan: Detail Judul, Toko, Harga, Tombol Hapus & Kontrol Jumlah Barang */}
      <div className="flex-1 flex flex-col justify-between h-[85px] min-w-0">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            {/* Judul produk dipotong (truncate) jika melampaui batas lebar */}
            <h3 className="text-[15px] font-bold text-text-main truncate leading-tight">
              {title}
            </h3>
            {/* Tombol X untuk menghapus item ini dari keranjang */}
            <button
              onClick={onRemove}
              className="p-1 text-text-sub hover:text-danger transition-colors"
            >
              <Icons.X size={18} />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <Icons.Store size={12} className="text-primary" />
            <span className="text-[11px] font-medium text-text-sub truncate">
              {shopName}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Format visual mata uang Rupiah */}
          <span className="text-[16px] font-bold text-primary">
            Rp {price.toLocaleString("id-ID")}
          </span>
          
          {/* Kontrol Jumlah (Quantity Selector) */}
          <div className="flex items-center justify-between px-2 w-[100px] h-[34px] border border-surface-hover rounded-full bg-surface-light">
            <button
              onClick={onDecrement}
              // Nonaktifkan tombol minus jika kuantitas bernilai minimal 1
              disabled={quantity <= 1}
              className="p-1 text-text-main hover:text-primary disabled:opacity-30 transition-all"
            >
              <Icons.Minus size={14} />
            </button>
            <span className="text-[13px] font-bold text-text-main w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={onIncrement}
              className="p-1 text-text-main hover:text-primary transition-all"
            >
              <Icons.Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
