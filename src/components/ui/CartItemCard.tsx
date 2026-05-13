"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "./Icons";
import { Checkbox } from "./Checkbox";
import { motion } from "framer-motion";

interface CartItemCardProps {
  title: string;
  shopName: string;
  price: number;
  quantity: number;
  image?: string;
  isChecked?: boolean;
  onCheck?: (checked: boolean) => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
  className?: string;
}

export const CartItemCard = ({
  title,
  shopName,
  price,
  quantity,
  image,
  isChecked = false,
  onCheck,
  onIncrement,
  onDecrement,
  onRemove,
  className,
}: CartItemCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "relative flex items-center gap-4 p-4 w-full h-[120px] bg-white rounded-card shadow-soft border border-surface-muted transition-all duration-300",
        isChecked && "border-primary/20 bg-primary/2",
        className
      )}
    >
      {/* Checkbox & Image Section */}
      <div className="flex items-center gap-3">
        <Checkbox 
          checked={isChecked}
          onChange={(e) => onCheck?.(e.target.checked)}
        />
        <div className="w-[60px] h-[85px] bg-surface-muted rounded-lg overflow-hidden shrink-0 shadow-sm border border-surface-muted">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-sub/30">
              <Icons.Collection size={24} />
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between h-[85px] min-w-0">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[15px] font-bold text-text-main truncate leading-tight">
              {title}
            </h3>
            <button
              onClick={onRemove}
              className="p-1 text-text-sub hover:text-danger transition-colors"
            >
              <Icons.X size={18} />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <Icons.Store size={12} className="text-primary" />
            <span className="text-[11px] font-medium text-text-sub truncate">
              {shopName}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[16px] font-bold text-primary">
            Rp {price.toLocaleString("id-ID")}
          </span>
          
          {/* Quantity Selector */}
          <div className="flex items-center justify-between px-2 w-[100px] h-[34px] border border-surface-hover rounded-full bg-surface-light">
            <button
              onClick={onDecrement}
              disabled={quantity <= 1}
              className="p-1 text-text-main hover:text-primary disabled:opacity-30 transition-all"
            >
              <Icons.Minus size={14} />
            </button>
            <span className="text-[13px] font-bold text-text-main w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={onIncrement}
              className="p-1 text-text-main hover:text-primary transition-all"
            >
              <Icons.Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

