"use client";

import React, { useEffect, useMemo, useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrderItemCard, type OrderItem } from "@/components/ui/OrderItemCard";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";
import { formatBuyerOrderStatus, orderService } from "@/lib/services/order";
import type { BuyerOrder } from "@/types";

function OrdersContent() {
  const searchParams = useSearchParams();
  const { isGuest, user } = useAuth();
  const initialStatus = searchParams.get("status");

  const initialTabAndFilter = useMemo(() => {
    if (initialStatus === "unpaid") return { tab: "Order" as const, filter: "Belum Bayar" };
    if (initialStatus === "processing") return { tab: "Order" as const, filter: "Dikemas" };
    if (initialStatus === "shipped") return { tab: "Order" as const, filter: "Dikirim" };
    if (initialStatus === "review") return { tab: "History" as const, filter: "Selesai" };
    return { tab: "Order" as const, filter: "Semua" };
  }, [initialStatus]);

  const [activeTab, setActiveTab] = useState<"Order" | "History">(initialTabAndFilter.tab);
  const [subFilter, setSubFilter] = useState(initialTabAndFilter.filter);
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const orderFilters = ["Semua", "Belum Bayar", "Dikemas", "Dikirim"];
  const historyFilters = ["Semua", "Selesai", "Dibatalkan"];

  const currentFilters = activeTab === "Order" ? orderFilters : historyFilters;

  useEffect(() => {
    if (!user || isGuest) return;

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const nextOrders = await orderService.listBuyerOrders(user.id);
        setOrders(nextOrders);
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, [isGuest, user]);

  const filteredOrders = useMemo(() => {
    const uiOrders: OrderItem[] = orders.map((order) => ({
      id: order.id,
      shopName: order.storeName || "Toko CardToo",
      productTitle:
        order.items.length > 1
          ? `${order.items[0]?.productTitle || "Pesanan"} +${order.items.length - 1} item`
          : order.items[0]?.productTitle || "Pesanan",
      productImage: order.items[0]?.productImage || undefined,
      condition: order.items[0]?.condition || "-",
      quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: order.total,
      status: formatBuyerOrderStatus(order.status),
      date: order.paidAt || undefined,
    }));

    return uiOrders.filter((order) => {
      const isMainTabMatch = activeTab === "Order" 
        ? ["Belum Bayar", "Dikemas", "Dikirim"].includes(order.status)
        : ["Selesai", "Dibatalkan"].includes(order.status);
      
      if (!isMainTabMatch) return false;
      if (subFilter === "Semua") return true;
      return order.status === subFilter;
    });
  }, [activeTab, orders, subFilter]);

  const handleCompleteOrder = async (orderId: string) => {
    await orderService.markOrderAsCompleted(orderId);
    if (!user) return;
    const nextOrders = await orderService.listBuyerOrders(user.id);
    setOrders(nextOrders);
  };

  const handleMainTabChange = (tab: "Order" | "History") => {
    setActiveTab(tab);
    setSubFilter("Semua");
  };

  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-surface-tint">
        <StickyHeader 
          title="Pesanan Saya" 
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="primary" />} 
        />
        <GuestEmptyState 
          title="Login untuk Lihat Pesanan" 
          description="Lacak status pesanan dan riwayat belanja Anda dengan masuk ke akun CardToo."
          icon={<Icons.History size={48} />}
        />
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-white to-white/95">
      <StickyHeader
        title="My Orders"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 flex flex-col pb-20">
        {/* Main Tabs Wrapper */}
        <div className="px-6 pt-6 bg-white/20">
          <div className="relative w-full h-[52px] bg-black/5 rounded-card p-1.5 flex items-center mb-6">
            <motion.div
              layoutId="activeTabBg"
              className="absolute h-[40px] bg-white rounded-button shadow-soft z-0"
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
                activeTab === "Order" ? "text-text-main" : "text-text-sub/40"
              )}
            >
              Order
            </button>
            <button
              onClick={() => handleMainTabChange("History")}
              className={cn(
                "relative flex-1 h-full text-[16px] font-bold z-10 transition-colors",
                activeTab === "History" ? "text-text-main" : "text-text-sub/40"
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
                    subFilter === filter ? "text-primary font-bold" : "text-text-sub/40 hover:text-text-sub/60"
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
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}
          <AnimatePresence mode="wait">
            {!isLoading && filteredOrders.length > 0 ? (
              <motion.div
                key={activeTab + subFilter}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-5"
              >
                {filteredOrders.map((order) => (
                  <OrderItemCard
                    key={order.id}
                    order={order}
                    onComplete={(orderId) => void handleCompleteOrder(orderId)}
                  />
                ))}
              </motion.div>
            ) : !isLoading ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 gap-5"
              >
                <div className="relative group">
                  <div className="w-[110px] h-[110px] bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center shadow-soft border border-white/50 group-hover:scale-105 transition-transform">
                    <Icons.Collection size={52} className="text-black/10" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary/20 backdrop-blur-xl rounded-full animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-[17px] font-bold text-text-main">Belum ada pesanan</p>
                  <p className="text-[13px] text-text-sub/40 mt-1.5 max-w-[200px] leading-relaxed">
                    Pesanan dengan status <span className="text-primary font-bold">{subFilter !== "Semua" ? subFilter : activeTab}</span> belum ditemukan.
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <React.Suspense fallback={<div className="flex-1 flex min-h-screen bg-surface-tint"></div>}>
      <OrdersContent />
    </React.Suspense>
  );
}
