"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/Icons";
import { motion } from "framer-motion";

export interface OrderItem {
  id: string;
  shopName: string;
  productTitle: string;
  productImage?: string;
  condition: string;
  quantity: number;
  totalPrice: number;
  status: "Belum Bayar" | "Dikemas" | "Dikirim" | "Selesai" | "Dibatalkan";
}

interface OrderItemCardProps {
  order: OrderItem;
  className?: string;
}

export const OrderItemCard = ({ order, className }: OrderItemCardProps) => {
  const getStatusColor = (status: OrderItem["status"]) => {
    switch (status) {
      case "Belum Bayar": return "text-warning bg-warning/10";
      case "Dikemas": return "text-primary bg-primary/10";
      case "Dikirim": return "text-accent bg-accent/10";
      case "Selesai": return "text-success bg-success/10";
      case "Dibatalkan": return "text-danger bg-danger/10";
      default: return "text-black/40 bg-black/5";
    }
  };

  const getStatusIcon = (status: OrderItem["status"]) => {
    switch (status) {
      case "Belum Bayar": return <Icons.Wallet size={14} />;
      case "Dikemas": return <Icons.Dikemas size={14} />;
      case "Dikirim": return <Icons.Delivery size={14} />;
      case "Selesai": return <Icons.History size={14} />;
      default: return null;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white rounded-card p-4 shadow-soft flex flex-col gap-4 border border-black/5",
        className
      )}
    >
      {/* Header: Shop Name & Status */}
      <div className="flex items-center justify-between border-b border-black/5 pb-3">
        <div className="flex items-center gap-2">
          <Icons.Store size={18} className="text-black/60" />
          <span className="text-[14px] font-bold text-black">{order.shopName}</span>
          <Icons.ChevronRight size={14} className="text-black/20" />
        </div>
        <div className={cn(
          "px-2 py-1 rounded-full flex items-center gap-1.5",
          getStatusColor(order.status)
        )}>
          {getStatusIcon(order.status)}
          <span className="text-[11px] font-bold uppercase tracking-wider">{order.status}</span>
        </div>
      </div>

      {/* Body: Product Info */}
      <div className="flex gap-4">
        <div className="w-[80px] h-[80px] bg-skeleton rounded-card overflow-hidden shrink-0 relative">
          {order.productImage ? (
            <Image src={order.productImage} alt={order.productTitle} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-black/10 font-bold uppercase">No Image</div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h4 className="text-[14px] font-bold text-black line-clamp-1">{order.productTitle}</h4>
            <p className="text-[12px] text-black/40">{order.condition}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-black/60">x{order.quantity}</span>
            <span className="text-[14px] font-bold text-primary">
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(order.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Actions */}
      <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-black/5">
        {order.status === "Belum Bayar" && (
          <button 
            onClick={() => window.location.href = "/checkout/payment"}
            className="px-4 h-[36px] bg-primary text-white text-[13px] font-bold rounded-full active:scale-95 transition-all"
          >
            Bayar Sekarang
          </button>
        )}
        {order.status === "Dikirim" && (
          <>
            <button className="px-4 h-[36px] bg-primary text-white text-[13px] font-bold rounded-full active:scale-95 transition-all">
              Terima Pesanan
            </button>
            <button 
              onClick={() => window.location.href = `/orders/${order.id}/track`}
              className="px-4 h-[36px] border border-primary text-primary text-[13px] font-bold rounded-full active:scale-95 transition-all"
            >
              Lacak
            </button>
          </>
        )}
        {order.status === "Selesai" && (
          <>
            <button className="px-4 h-[36px] border border-black/10 text-black/60 text-[13px] font-bold rounded-full active:scale-95 transition-all">
              Beli Lagi
            </button>
            <button 
              onClick={() => window.location.href = `/orders/${order.id}/review`}
              className="px-4 h-[36px] bg-accent text-white text-[13px] font-bold rounded-full active:scale-95 transition-all"
            >
              Nilai
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};
