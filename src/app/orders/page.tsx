"use client";

import React, { useState, useMemo, useEffect } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrderItemCard, type OrderItem } from "@/components/ui/OrderItemCard";
import { useSearchParams } from "next/navigation";

const ALL_ORDERS: OrderItem[] = [
  {
    id: "ORD-001",
    shopName: "Pokemon Official Store",
    productTitle: "Pikachu VMAX Rainbow Rare",
    condition: "Mint",
    quantity: 1,
    totalPrice: 2500000,
    status: "Dikirim",
  },
  {
    id: "ORD-002",
    shopName: "CardToo Market",
    productTitle: "Charizard GX Shiny",
    condition: "Near Mint",
    quantity: 1,
    totalPrice: 1800000,
    status: "Dikemas",
  },
  {
    id: "ORD-003",
    shopName: "Gamer Store",
    productTitle: "Lugia Legend Bottom",
    condition: "Excellent",
    quantity: 1,
    totalPrice: 950000,
    status: "Selesai",
  },
  {
    id: "ORD-004",
    shopName: "Collector Zone",
    productTitle: "Mewtwo EX Full Art",
    condition: "Mint",
    quantity: 1,
    totalPrice: 1200000,
    status: "Belum Bayar",
  },
  {
    id: "ORD-005",
    shopName: "Hobby Shop",
    productTitle: "Dragonite V alternate",
    condition: "Near Mint",
    quantity: 1,
    totalPrice: 3500000,
    status: "Dibatalkan",
  }
];

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status");

  const [activeTab, setActiveTab] = useState<"Order" | "History">("Order");
  const [subFilter, setSubFilter] = useState("Semua");

  useEffect(() => {
    if (initialStatus) {
      if (initialStatus === "unpaid") { setActiveTab("Order"); setSubFilter("Belum Bayar"); }
      else if (initialStatus === "processing") { setActiveTab("Order"); setSubFilter("Dikemas"); }
      else if (initialStatus === "shipped") { setActiveTab("Order"); setSubFilter("Dikirim"); }
      else if (initialStatus === "review") { setActiveTab("History"); setSubFilter("Selesai"); }
    }
  }, [initialStatus]);

  const orderFilters = ["Semua", "Belum Bayar", "Dikemas", "Dikirim"];
  const historyFilters = ["Semua", "Selesai", "Dibatalkan"];

  const currentFilters = activeTab === "Order" ? orderFilters : historyFilters;

  const filteredOrders = useMemo(() => {
    return ALL_ORDERS.filter((order) => {
      const isMainTabMatch = activeTab === "Order" 
        ? ["Belum Bayar", "Dikemas", "Dikirim"].includes(order.status)
        : ["Selesai", "Dibatalkan"].includes(order.status);
      
      if (!isMainTabMatch) return false;
      if (subFilter === "Semua") return true;
      return order.status === subFilter;
    });
  }, [activeTab, subFilter]);

  const handleMainTabChange = (tab: "Order" | "History") => {
    setActiveTab(tab);
    setSubFilter("Semua");
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-[#F7F9FA] to-[#F6DFFF]">
      <StickyHeader
        title="My Orders"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 flex flex-col pb-20">
        {/* Main Tabs Wrapper */}
        <div className="px-6 pt-6 bg-white/20">
          <div className="relative w-full h-[52px] bg-black/5 rounded-[16px] p-1.5 flex items-center mb-6">
            <motion.div
              layoutId="activeTabBg"
              className="absolute h-[40px] bg-white rounded-[12px] shadow-soft z-0"
              initial={false}
              animate={{
                left: activeTab === "Order" ? "6px" : "calc(50% + 1px)",
                width: "calc(50% - 7px)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            
            <button
              onClick={() => handleMainTabChange("Order")}
              className={cn(
                "relative flex-1 h-full text-[16px] font-bold z-10 transition-colors",
                activeTab === "Order" ? "text-black" : "text-black/30"
              )}
            >
              Order
            </button>
            <button
              onClick={() => handleMainTabChange("History")}
              className={cn(
                "relative flex-1 h-full text-[16px] font-bold z-10 transition-colors",
                activeTab === "History" ? "text-black" : "text-black/30"
              )}
            >
              History
            </button>
          </div>
        </div>

        {/* Sub-Filters Bar (Refined Shopee Style) */}
        <div className="w-full bg-white/60 backdrop-blur-xl sticky top-[72px] z-30 border-b border-black/5 shadow-xs">
          <div className="flex overflow-x-auto scrollbar-hide px-6">
            <div className="flex gap-8 py-4 min-w-max relative">
              {currentFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSubFilter(filter)}
                  className={cn(
                    "relative text-[14px] font-medium transition-all px-1",
                    subFilter === filter ? "text-primary font-bold" : "text-black/30 hover:text-black/50"
                  )}
                >
                  {filter}
                  {subFilter === filter && (
                    <motion.div
                      layoutId="subFilterUnderline"
                      className="absolute -bottom-4 left-0 right-0 h-[3px] bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content List Section */}
        <div className="px-6 pt-6 flex-1">
          <AnimatePresence mode="wait">
            {filteredOrders.length > 0 ? (
              <motion.div
                key={activeTab + subFilter}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-5"
              >
                {filteredOrders.map((order) => (
                  <OrderItemCard key={order.id} order={order} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 gap-5"
              >
                <div className="relative group">
                  <div className="w-[110px] h-[110px] bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center shadow-soft border border-white/50 group-hover:scale-105 transition-transform">
                    <Icons.File size={52} className="text-black/10" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary/20 backdrop-blur-xl rounded-full animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-[17px] font-bold text-black/80">Belum ada pesanan</p>
                  <p className="text-[13px] text-black/30 mt-1.5 max-w-[200px] leading-relaxed">
                    Pesanan dengan status <span className="text-primary font-bold">{subFilter !== "Semua" ? subFilter : activeTab}</span> belum ditemukan.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
