"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { X, Minus, Plus, Store } from "lucide-react";

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
    <div
      className={cn(
        "relative flex items-center gap-4 p-4 w-full h-[114px] bg-surface-light rounded-[16px] shadow-soft",
        className
      )}
    >
      {/* Checkbox & Image Section */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onCheck?.(e.target.checked)}
          className="w-[15px] h-[15px] rounded-sm accent-primary cursor-pointer"
        />
        <div className="w-[50px] h-[75px] bg-skeleton rounded-lg overflow-hidden flex-shrink-0 shadow-inner">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between h-[75px] min-w-0">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[20px] font-bold text-black truncate leading-tight">
              {title}
            </h3>
            <button
              onClick={onRemove}
              className="p-1 hover:text-red-500 transition-colors"
            >
              <X size={18} className="text-accent" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <Store size={12} className="text-accent" />
            <span className="text-[12px] font-normal text-black truncate">
              {shopName}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[16px] font-bold text-secondary">
            Rp {price.toLocaleString("id-ID")}
          </span>
          
          {/* Quantity Selector */}
          <div className="flex items-center justify-between px-3 py-1.5 w-[93px] h-[36px] border border-black/20 rounded-[16px] bg-white">
            <button
              onClick={onDecrement}
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <Minus size={14} className="text-accent" />
            </button>
            <span className="text-[14px] font-normal text-black w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={onIncrement}
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <Plus size={14} className="text-accent" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
