"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Properti pendukung komponen garis pemisah.
 */
interface SeparatorProps {
  /** Teks label yang opsional ditampilkan di tengah-tengah garis pemisah */
  label?: string;
  /** Ekstra CSS class */
  className?: string;
}

/**
 * Komponen UI untuk memisahkan konten, sering disebut sebagai "Divider".
 * Jika properti `label` diberikan, akan muncul teks di tengah garis putus-putus 
 * (seperti pada "Atau masuk dengan" di halaman login).
 */
export const Separator = ({ label, className }: SeparatorProps) => {
  return (
    // Flex container yang menyusun elemen secara horizontal (row) dengan gap seimbang
    <div className={cn("w-full flex items-center gap-4 py-2", className)}>
      {/* Sisi Kiri: Garis horizontal tipis putus-putus (dashed border) */}
      <div className="h-px flex-1 bg-surface-muted border-t border-dashed border-surface-hover" />
      
      {/* Tampilkan label teks di tengah-tengah pemisah hanya jika dikirimkan oleh pemanggil */}
      {label && (
        <span className="text-base text-text-sub font-medium">{label}</span>
      )}
      
      {/* Sisi Kanan: Garis horizontal tipis putus-putus (dashed border) */}
      <div className="h-px flex-1 bg-surface-muted border-t border-dashed border-surface-hover" />
    </div>
  );
};
