"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronsLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Properti pendukung untuk komponen tombol kembali.
 */
interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Pilihan warna latar tombol (primary = biru/cyan, secondary = ungu) */
  variant?: "primary" | "secondary";
}

/**
 * Komponen Tombol Navigasi Kembali (Back).
 * Secara otomatis memanggil fungsi `router.back()` dari Next.js jika tidak ada fungsi `onClick` kustom yang diberikan.
 * Menggunakan ikon ChevronsLeft dari lucide-react.
 */
const BackButton = ({ variant = "primary", className, ...props }: BackButtonProps) => {
  // Hook useRouter untuk mengelola navigasi mundur secara native di sisi client
  const router = useRouter();

  // Konfigurasi warna latar tombol sesuai dengan token warna desain sistem
  const variants = {
    primary: "bg-primary", // Biru Khas (#00CAE0 / #00E6FF)
    secondary: "bg-secondary", // Ungu Khas (#A78BFA)
  };

  return (
    // Elemen tombol HTML dengan animasi tap-down scale dinamis dan brightness hover
    <button
      type="button"
      // Menggunakan handler onClick kustom jika dilewatkan lewat props, jika tidak lakukan router.back()
      onClick={props.onClick || (() => router.back())}
      className={cn(
        "flex items-center justify-center p-[10px] w-[42px] h-[40px] rounded-[24px] shadow-soft",
        "transition-all active:scale-90 hover:brightness-110",
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Ikon Lucide ChevronsLeft berwarna putih rata tengah */}
      <ChevronsLeft size={22} className="text-white" />
    </button>
  );
};

export { BackButton };
