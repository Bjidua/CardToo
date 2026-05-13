"use client";

import React from "react";
import Image from "next/image";
import { cn, getAssetPath } from "@/lib/utils";
import { motion } from "framer-motion";
import { Icons } from "./Icons";

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
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col w-full aspect-4/5 bg-white rounded-card overflow-hidden",
        "shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer select-none border border-surface-muted",
        className
      )}
    >
      {/* Background Section */}
      <div className="relative w-full h-[65%] bg-surface-muted flex items-center justify-center p-3 overflow-hidden">
        {/* Decorative Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent pointer-events-none z-10" />
        
        {/* Animated Background Pattern */}
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
        
        {/* Main Visual */}
        <div className="relative w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 z-0">
          <Image 
            src={getAssetPath("/assets/big-logo.svg")} 
            alt="Collection Visual" 
            fill
            className="object-contain p-2"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="h-[35%] flex flex-col justify-center px-3 gap-0.5 bg-white relative">
        <div className="flex items-center justify-between gap-1">
          <h3 className="text-[12px] font-extrabold text-text-main line-clamp-1 leading-tight uppercase tracking-tight">
            {title}
          </h3>
          <Icons.ChevronRight size={10} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-[10px] font-bold text-primary bg-primary/10 w-fit px-2 py-0.5 rounded-full">
          {count} Items
        </p>
      </div>
    </motion.div>
  );
};

