"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-full overflow-hidden relative", className)}>
      <svg
        viewBox="0 0 472 234"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-auto max-h-32 md:max-h-40 opacity-60 rounded-t-card"
      >
        {/* Konten SVG dari BackgroundLogo.svg (disederhanakan untuk efisiensi jika perlu, 
            namun di sini kita asumsikan menggunakan konten asli atau mereferensikannya) */}
        {/* Karena file aslinya sangat besar (132KB), kita gunakan <image> tag 
            di dalam SVG untuk menjaga performa sambil tetap mendukung preserveAspectRatio slice */}
        <image 
          href="/assets/BackgroundLogo.svg" 
          width="472" 
          height="234" 
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    </div>
  );
};
