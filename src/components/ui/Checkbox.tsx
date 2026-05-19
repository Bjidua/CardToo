"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Properti untuk komponen kotak centang (Checkbox).
 * Menggabungkan atribut input HTML bawaan dengan label kustom.
 */
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label teks atau elemen React yang ditampilkan di sebelah kanan checkbox */
  label?: React.ReactNode;
}

/**
 * Komponen Checkbox kustom yang menggantikan desain bawaan browser.
 * Di-styling agar seragam dengan desain sistem menggunakan Tailwind CSS, 
 * lengkap dengan animasi centang yang halus.
 */
const Checkbox = ({ label, className, ...props }: CheckboxProps) => {
  return (
    // Label pembungkus agar seluruh area (termasuk label teks) dapat diklik untuk memicu centang
    <label className={cn("flex items-center gap-2 cursor-pointer group", className)}>
      {/* Input checkbox bawaan HTML yang disembunyikan (hidden) untuk dihias secara kustom */}
      <input type="checkbox" className="hidden peer" {...props} />
      
      {/* Box visual kustom. Menggunakan peer-checked dari tailwind untuk merubah warna bg saat input tercentang */}
      <div className="w-[20px] h-[20px] bg-surface-muted rounded-md peer-checked:bg-primary border border-surface-hover flex items-center justify-center transition-all duration-300 peer-checked:border-primary">
        {/* Ikon centang SVG yang tersembunyi (scale-0) dan membesar (scale-100) saat peer tercentang */}
        <svg 
          className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      
      {/* Label teks di sebelah kanan kotak centang (hanya dirender jika prop label ada) */}
      {label && <span className="text-[14px] text-text-main select-none">{label}</span>}
    </label>
  );
};

export { Checkbox };
