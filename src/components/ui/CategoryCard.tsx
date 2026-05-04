"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryCardProps {
  name: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const CategoryCard = ({ name, icon, onClick, className }: CategoryCardProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full h-[73px] bg-white rounded-[16px] px-5 shadow-soft active:shadow-none transition-all",
        className
      )}
    >
      <div className="flex items-center gap-[15px]">
        {/* Icon Container */}
        <div className="w-[41px] h-[41px] bg-surface-hover rounded-[16px] flex items-center justify-center overflow-hidden">
          {icon || <div className="w-full h-full bg-surface-hover" />}
        </div>
        
        {/* Label */}
        <span className="text-[18px] font-normal text-black font-dm-sans">
          {name}
        </span>
      </div>

      {/* Chevron */}
      <ChevronRight size={20} className="text-black" />
    </motion.button>
  );
};
