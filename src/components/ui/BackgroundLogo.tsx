"use client";

import React from "react";
import Image from "next/image";
import { cn, getAssetPath } from "@/lib/utils";

/**
 * Komponen UI murni untuk merender logo latar belakang (watermark/corak)
 * yang dipasang di bagian atas layar (seperti di StickyHeader logo variant).
 */
export const BackgroundLogo = ({ className }: { className?: string }) => {
  return (
    // Kontainer pembungkus absolute yang memenuhi seluruh area layar (inset-0)
    <div className={cn("w-full h-full absolute inset-0 overflow-hidden", className)}>
      <Image
        src={getAssetPath("/assets/BackgroundLogo.svg")}
        alt="Background Pattern"
        fill // Mengisi penuh kontainer parent-nya secara responsif
        sizes="100vw"
        className="object-cover opacity-60" // Menggunakan transparansi sedang (60%) agar tidak mendominasi konten utama
      />
    </div>
  );
};
