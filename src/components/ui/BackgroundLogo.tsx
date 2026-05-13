"use client";

import React from "react";
import { cn, getAssetPath } from "@/lib/utils";

export const BackgroundLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-full h-full absolute inset-0 overflow-hidden", className)}>
      <img
        src={getAssetPath("/assets/BackgroundLogo.svg")}
        alt="Background Pattern"
        className="w-full h-full object-cover opacity-60"
      />
    </div>
  );
};

