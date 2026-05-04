"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  title: string;
  price: number;
  image?: string;
  condition?: "Mint" | "Near Mint" | "Excellent" | "Good";
  isWishlisted?: boolean;
  className?: string;
  onPress?: () => void;
}

export const ProductCard = ({
  title,
  price,
  image,
  condition = "Mint",
  isWishlisted = false,
  className,
  onPress,
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(isWishlisted);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      className={cn(
        "group relative flex flex-col items-start p-1 gap-2",
        "w-[172px] h-[250px] bg-surface-light rounded-card",
        "shadow-[0px_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0px_10px_20px_rgba(0,0,0,0.1)]",
        "transition-all duration-300 cursor-pointer select-none overflow-hidden",
        className
      )}
    >
      {/* Image Container with Inset Shadow */}
      <div className="relative w-full h-[146px] bg-skeleton rounded-t-card overflow-hidden shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-black/10 font-bold text-xs uppercase">
            No Image
          </div>
        )}

        {/* Condition Badge (Improvement) */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-full">
          <span className="text-[8px] font-bold text-white uppercase tracking-wider">
            {condition}
          </span>
        </div>

        {/* Wishlist Button (Improvement) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm active:scale-90 transition-transform"
        >
          <Heart
            size={12}
            className={cn(
              "transition-colors",
              isLiked ? "fill-danger text-danger" : "text-black/40"
            )}
          />
        </button>
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-1 px-2 w-full">
        <h3 className="text-[14px] font-bold text-black line-clamp-2 leading-[1.2] h-[34px]">
          {title}
        </h3>
        <p className="text-[16px] font-bold text-[#4CB6C4] mt-1">
          {formatPrice(price)}
        </p>
      </div>

      {/* Bottom Subtle Bar (Native feel) */}
      <div className="absolute bottom-1 left-4 right-4 h-1 bg-black/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};
