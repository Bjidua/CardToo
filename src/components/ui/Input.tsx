import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Properti pendukung untuk komponen input teks kustom
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label teks yang ditampilkan di atas kolom input */
  label?: string;
  /** Pesan error yang ditampilkan di bawah kolom input jika ada kesalahan validasi */
  error?: string;
  /** Ikon yang ditampilkan di sisi kiri dalam kolom input */
  startIcon?: React.ReactNode;
  /** Ikon yang ditampilkan di sisi kanan dalam kolom input */
  endIcon?: React.ReactNode;
  /** Memastikan lebar penuh jika true (default: true) */
  fullWidth?: boolean;
}

/**
 * Komponen Input Teks yang disesuaikan dengan desain sistem aplikasi CardToo.
 * Mendukung label, pesan error, serta penambahan ikon di sebelah kiri (seperti ikon Search)
 * atau kanan (seperti ikon lihat Password).
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, startIcon, endIcon, fullWidth = true, ...props }, ref) => {
    return (
      // Kontainer utama input yang melingkupi label, kolom input, dan pesan kesalahan validasi
      <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-auto")}>
        {/* Render label teks jika dikirimkan oleh pemanggil komponen */}
        {label && (
          <label className="text-sm font-medium text-text-main ml-4">
            {label}
          </label>
        )}
        
        {/* Kontainer input relatif untuk menaruh ikon startIcon dan endIcon dengan posisi absolut */}
        <div className="relative flex items-center">
          {/* Tampilkan ikon awal di sisi kiri jika dikirim */}
          {startIcon && (
            <div className="absolute left-6 text-text-sub">
              {startIcon}
            </div>
          )}
          
          <input
            className={cn(
              "h-[50px] w-full border-none bg-surface-muted px-6 py-2 text-base text-text-main transition-all outline-none",
              "rounded-[26px]", // Tinggi 50px dan radius 26px sesuai standar desain sistem Figma
              "placeholder:text-text-sub/70",
              "focus:ring-2 focus:ring-primary/30",
              // Atur padding kiri jika ada ikon awal agar teks input tidak bertumpukan
              startIcon && "pl-14",
              // Atur padding kanan jika ada ikon akhir
              endIcon && "pr-14",
              // Tambahkan ring merah jika input mendeteksi adanya pesan error validasi
              error && "ring-2 ring-danger/50",
              className
            )}
            ref={ref}
            {...props}
          />

          {/* Tampilkan ikon penutup di sisi kanan jika dikirim (contoh: toggle password visibility) */}
          {endIcon && (
            <div className="absolute right-6 text-text-sub">
              {endIcon}
            </div>
          )}
        </div>

        {/* Tampilkan pesan kesalahan validasi di bawah kolom input jika ada */}
        {error && (
          <span className="text-xs text-danger ml-4 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
