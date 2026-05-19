"use client";

import React from "react";

/**
 * Properti pendukung untuk komponen kotak detail.
 */
interface DetailBoxProps {
  /** Label informasi yang ditampilkan (huruf besar/kapital, ukuran kecil) */
  label: string;
  /** Nilai isi/teks dari label tersebut (huruf tebal) */
  value: string;
  /** Ekstra CSS class */
  className?: string;
}

/**
 * Komponen kotak sederhana untuk menampilkan pasangan Label dan Nilai (Key-Value)
 * Berguna di dalam rincian produk, profil, atau rangkuman struk tagihan.
 */
export function DetailBox({ label, value, className }: DetailBoxProps) {
  return (
    // Container utama Box Detail dengan styling background redup (bg-surface-light) dan padding (p-4)
    <div className={`bg-surface-light p-4 rounded-2xl border border-surface-muted flex flex-col gap-0.5 ${className}`}>
      {/* Label/Header teks berukuran kecil (text-[10px]) dan huruf kapital (uppercase) */}
      <span className="text-[10px] text-text-sub font-bold uppercase tracking-wider">{label}</span>
      {/* Value/Isi utama berukuran 13px, huruf tebal, dan dipotong jika terlalu panjang (line-clamp-1) */}
      <span className="text-[13px] font-bold text-text-main line-clamp-1">{value}</span>
    </div>
  );
}
