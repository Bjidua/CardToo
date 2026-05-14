"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { TransactionDetail } from "@/types";

const DUMMY_DETAILS: TransactionDetail[] = [];

export default function SalesDetailPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredDetails = DUMMY_DETAILS.filter(d => 
    d.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-white pb-32">
      <StickyHeader 
        title="Detail Penjualan" 
        variant="minimal" 
        size="sm" 
        leftAction={<BackButton variant="secondary"/>} 
        rightAction={
          <button className="w-10 h-10 bg-white rounded-xl shadow-soft flex items-center justify-center text-secondary border border-surface-muted active:scale-90 transition-transform">
            <Icons.Export size={20} />
          </button>
        }
      />

      <main className="flex-1">
        {/* Search Bar */}
        <div className="px-6 pt-6 pb-2">
          <Input 
            placeholder="Cari ID Pesanan atau Nama Produk..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={<Icons.Search size={18} />}
            className="h-[52px] bg-white shadow-soft"
          />
        </div>

        {/* Transaction List */}
        <div className="p-6 flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredDetails.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[24px] p-5 shadow-soft border border-surface-muted flex flex-col gap-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-sub uppercase tracking-widest">{item.orderId}</span>
                    <h4 className="text-[14px] font-bold text-text-main line-clamp-1">{item.productName}</h4>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                    item.status === "Completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>
                    {item.status === "Completed" ? "Selesai" : "Diproses"}
                  </span>
                </div>

                <div className="flex flex-col gap-2 py-3 border-y border-surface-muted/50 border-dashed">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-text-sub">Harga Produk</span>
                    <span className="font-bold text-text-main">{formatPrice(item.grossAmount)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-text-sub">Biaya Layanan (1%)</span>
                    <span className="font-bold text-danger">-{formatPrice(item.serviceFee)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-text-sub font-medium">{item.date}</span>
                    <span className="text-[12px] font-bold text-text-main">Penghasilan Bersih</span>
                  </div>
                  <span className="text-[18px] font-bold text-secondary">{formatPrice(item.netAmount)}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredDetails.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-text-sub">
              <Icons.Search size={40} className="opacity-20 mb-4" />
              <p className="text-[14px] font-bold text-text-main">Data tidak ditemukan</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
