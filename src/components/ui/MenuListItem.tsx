"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/Icons";
import Link from "next/link";

/**
 * Properti pendukung untuk komponen baris menu.
 */
interface MenuListItemProps {
  /** Ikon React yang tampil di sebelah kiri label */
  icon: React.ReactNode;
  /** Teks label utama menu */
  label: string;
  /** URL navigasi jika menu ini bertindak sebagai tautan/link */
  href?: string;
  /** Memunculkan garis bawah sebagai pemisah jika bernilai true */
  showBorder?: boolean;
  /** Teks tambahan sekunder (warna lebih redup) di bagian sebelah kanan label */
  subValue?: string;
  /** Callback jika menu ini ditekan (dan tidak menggunakan `href`) */
  onClick?: () => void;
  /** Ekstra CSS class */
  className?: string;
}

/**
 * Komponen item daftar menu yang serbaguna (versatile). 
 * Digunakan secara ekstensif di halaman Profil, Pengaturan, atau Dasbor Penjual.
 * Dapat bertindak sebagai Link (jika ada `href`) atau Button (jika ada `onClick`).
 */
export const MenuListItem = ({
  icon,
  label,
  href,
  showBorder = false,
  subValue,
  onClick,
  className,
}: MenuListItemProps) => {
  // Blok isi visual item menu yang dirender baik untuk elemen Link maupun Button
  const content = (
    <>
      {/* Sisi Kiri: Ikon Visual dan Label Menu */}
      <div className="flex items-center gap-4">
        {/* Kontainer Ikon dengan efek scale zoom saat area menu di-hover */}
        <div className="w-10 h-10 rounded-card bg-surface-hover flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-[16px] font-medium text-text-main">{label}</span>
      </div>
      
      {/* Sisi Kanan: Nilai Sekunder opsional (subValue) dan Ikon Panah Navigasi */}
      <div className="flex items-center gap-2">
        {/* Merender nilai deskripsi kanan jika disediakan */}
        {subValue && (
          <span className="text-[14px] text-text-sub font-medium">{subValue}</span>
        )}
        {/* Ikon panah kanan dengan efek transisi pergeseran x (translate-x-1) saat di-hover */}
        <Icons.ChevronRight
          size={18}
          className="text-text-sub group-hover:translate-x-1 transition-transform"
        />
      </div>
    </>
  );

  // Kelas CSS dasar kontainer menu yang digabungkan menggunakan utility cn()
  const containerClasses = cn(
    "flex items-center justify-between p-5 hover:bg-surface-hover/40 transition-colors group w-full text-left",
    // Menambahkan border pemisah bawah jika showBorder bernilai true
    showBorder && "border-b border-surface-muted",
    className
  );

  // Jika properti URL navigasi (href) dikirimkan, gunakan tag Link Next.js untuk optimasi SPA routing
  if (href) {
    return (
      <Link href={href} className={containerClasses}>
        {content}
      </Link>
    );
  }

  // Jika tidak memiliki href, render sebagai elemen button interaktif biasa dengan callback click handler
  return (
    <button onClick={onClick} className={containerClasses} type="button">
      {content}
    </button>
  );
};
