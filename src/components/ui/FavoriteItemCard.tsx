"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/Icons";
import { motion } from "framer-motion";
import Image from "next/image";

interface FavoriteItemCardProps {
  id: string;
  title: string;
  shopName: string;
  price: number;
  image?: string;
  onRemove?: () => void;
  onAddToCart?: () => void;
  className?: string;
}

export const FavoriteItemCard = ({
  title,
  shopName,
  price,
  image,
  onRemove,
  onAddToCart,
  className,
}: FavoriteItemCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative flex items-center gap-4 p-4 w-full h-[120px] bg-white rounded-[20px] shadow-soft border border-black/5 overflow-hidden group",
        className
      )}
    >
      {/* Product Image */}
      <div className="w-[70px] h-[90px] bg-skeleton rounded-card overflow-hidden flex-shrink-0 relative shadow-inner">
        {image ? (
          <Image src={image} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-black/10 font-bold uppercase">No Image</div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between h-[90px] min-w-0">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[18px] font-bold text-black truncate leading-tight">
              {title}
            </h3>
            <button
              onClick={onRemove}
              className="w-8 h-8 rounded-full flex items-center justify-center text-danger hover:bg-danger/10 active:scale-90 transition-all"
            >
              <Icons.Favorite size={20} className="fill-current" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 opacity-60">
            <Icons.Store size={14} className="text-black" />
            <span className="text-[12px] font-medium text-black truncate">
              {shopName}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[18px] font-bold text-primary">
            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price)}
          </span>
          
          <button
            onClick={onAddToCart}
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 h-[34px] rounded-full text-[12px] font-bold transition-all active:scale-95"
          >
            <Icons.Plus size={14} />
            Add to Cart
          </button>
        </div>
      </div>
      
      {/* Subtle background decoration */}
      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
    </motion.div>
  );
};
