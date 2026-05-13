"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SlideCardProps {
  promotion?: string;
  title?: string;
  description?: string;
  className?: string;
  image?: string;
}

export const SlideCard = ({
  promotion = "Promotion",
  title,
  description,
  className,
  image,
}: SlideCardProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-row items-center justify-center p-[10px] gap-[10px]",
        "w-full max-w-[361px] h-[150px] bg-surface-light rounded-card",
        "shadow-soft",
        "overflow-hidden select-none", // Native App Feel
        className
      )}
    >
      <div className="flex flex-col flex-1 gap-1 px-4 z-20">
        <span className="text-primary font-bold text-[16px] leading-[19px] uppercase tracking-wider">
          {promotion}
        </span>
        {title && (
          <h3 className="text-[20px] font-bold text-black leading-tight">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-[12px] text-black/60 font-medium leading-normal">
            {description}
          </p>
        )}
      </div>

      {image && (
        <div className="w-[120px] h-full relative">
          {/* Placeholder for Promo Image */}
          <div className="absolute inset-0 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      )}
    </div>
  );
};
