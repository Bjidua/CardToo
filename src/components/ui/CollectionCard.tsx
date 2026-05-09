"use client";

import React from "react";
import Image from "next/image";
import { cn, getAssetPath } from "@/lib/utils";
import { motion } from "framer-motion";

interface CollectionCardProps {
  title: string;
  count: number;
  className?: string;
  onClick?: () => void;
}

export const CollectionCard = ({
  title,
  count,
  className,
  onClick,
}: CollectionCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col w-full aspect-4/5 bg-white rounded-card overflow-hidden",
        "shadow-soft cursor-pointer select-none",
        className
      )}
    >
      {/* Background Section (Grey Area from Image) */}
      <div className="relative w-full h-[65%] bg-skeleton/50 flex items-center justify-center p-2">
        {/* Decorative Light Glow */}
        <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent pointer-events-none" />
        
        {/* Main Visual: Big Logo TCG Stack */}
        <div className="relative w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <Image 
            src={getAssetPath("/assets/big-logo.svg")} 
            alt="Collection Visual" 
            fill
            className="object-contain p-2"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="h-[35%] flex flex-col justify-center px-2 gap-0.5">
        <h3 className="text-[12px] font-bold text-black line-clamp-1 leading-tight">
          {title}
        </h3>
        <p className="text-[10px] font-medium text-accent/60">
          {count} Items
        </p>
      </div>

      {/* Subtle Inset Shadow for Depth */}
      <div className="absolute inset-0 rounded-card shadow-[inset_0px_1px_2px_rgba(255,255,255,0.5)] pointer-events-none" />
    </motion.div>
  );
};
