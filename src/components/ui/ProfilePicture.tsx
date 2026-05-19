"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, getAssetPath } from "@/lib/utils";

/**
 * Properti pendukung untuk komponen foto profil.
 */
interface ProfilePictureProps {
  /** URL gambar avatar (opsional, akan menggunakan default jika kosong) */
  src?: string;
  /** Teks alternatif untuk aksesibilitas pembaca layar */
  alt?: string;
  /** Kelas CSS tambahan (untuk styling luar seperti margin) */
  className?: string;
  /** Ukuran lebar dan tinggi gambar dalam pixel (default: 60) */
  size?: number;
}

/**
 * Komponen UI untuk menampilkan gambar profil bundar (Avatar).
 * Secara otomatis menggunakan gambar default / placeholder jika `src` tidak diberikan.
 * Dilengkapi dengan fallback loader dan pencegahan *drag* untuk memberikan "Native App Feel".
 */
export const ProfilePicture = ({
  src,
  alt = "Profile Picture",
  className,
  size = 60,
}: ProfilePictureProps) => {
  // Gunakan aset placeholder bawaan (ProfilePicture.svg) jika url src tidak disediakan
  const imageSrc = src || getAssetPath("/assets/ProfilePicture.svg");
  
  // Deteksi apakah gambar berasal dari file lokal (Object URL / Base64) saat preview sebelum diunggah
  const isPreviewSource =
    imageSrc.startsWith("blob:") || imageSrc.startsWith("data:");

  return (
    // Kontainer avatar berbentuk bundar sempurna (rounded-full) dengan border putih luar tebal
    <div
      className={cn(
        "relative rounded-full overflow-hidden border-[5px] border-white shadow-soft bg-skeleton shrink-0",
        "select-none pointer-events-none", // Native App Feel: mematikan seleksi dan interaksi pointer bawaan browser
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
        draggable={false} // Matikan kemampuan drag gambar bawaan browser agar menyerupai aplikasi mobile native
        unoptimized={isPreviewSource} // Lewati optimasi kompilasi Next.js Image jika format berupa preview local blob
      />
    </div>
  );
};
