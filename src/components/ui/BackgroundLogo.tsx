"use client";

import React from "react";
import Image from "next/image";
import { cn, getAssetPath } from "@/lib/utils";

export const BackgroundLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-full h-full absolute inset-0 overflow-hidden", className)}>
      <Image
        src={getAssetPath("/assets/BackgroundLogo.svg")}
        alt="Background Pattern"
        fill
        sizes="100vw"
        className="object-cover opacity-60"
      />
    </div>
  );
};

