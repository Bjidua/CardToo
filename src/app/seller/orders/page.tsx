"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled";

interface SellerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalPrice: number;
  status: OrderStatus;
  items: number;
  date: string;
}

const DUMMY_ORDERS: SellerOrder[] = [];

import { useSearchParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function SellerOrdersPage() {
  return (
    <ProtectedRoute requireSeller={true}>
      <SellerOrdersContent />
    </ProtectedRoute>
  );
}

function SellerOrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "Pending";
  
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [orders, setOrders] = useState<SellerOrder[]>(DUMMY_ORDERS);
  const [isActioning, setIsActioning] = useState<string | null>(null);

  const tabs = [
    { id: "Pending", label: "Perlu Dikirim" },
    { id: "Processing", label: "Diproses" },
    { id: "Completed", label: "Selesai" },
  ];

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setIsActioning(orderId);
    
    // Simulasi loading/proses
    setTimeout(() => {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      setIsActioning(null);
      
      // Feedback sukses
      if (newStatus === "Processing") alert("Pesanan berhasil diterima! Segera siapkan produk.");
      if (newStatus === "Shipped") alert("Resi berhasil diinput! Pesanan beralih ke pengiriman.");
    }, 1000);
  };

  const filteredOrders = orders.filter(order => order.status === activeTab);

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-white pb-32">
      <StickyHeader 
        title="Pesanan Masuk" 
        variant="minimal" 
        size="sm" 
        leftAction={<BackButton variant="secondary"/>} 
      />

      <main className="flex-1">
        {/* Tabs Bar */}
        <div className="flex border-b border-surface-muted bg-white sticky top-[60px] z-20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-4 text-[13px] font-bold transition-all relative",
                activeTab === tab.id ? "text-secondary" : "text-text-sub"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-secondary rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[24px] p-5 shadow-soft border border-surface-muted flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-text-sub uppercase tracking-widest">{order.orderNumber}</span>
                      <h4 className="text-[16px] font-black text-text-main">{order.customerName}</h4>
                    </div>
                    <span className="text-[12px] text-text-sub font-medium">{order.date}</span>
                  </div>

                  <div className="flex items-center gap-3 py-2 border-y border-surface-muted/50 border-dashed">
                    <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center text-text-sub">
                      <Icons.Collection size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-text-main">{order.items} Produk</span>
                      <span className="text-[14px] font-black text-secondary">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      fullWidth={false} 
                      className="flex-1 h-10 text-[12px] rounded-xl"
                      onClick={() => router.push(`/seller/orders/${order.id}`)}
                    >
                      Detail
                    </Button>
                    {activeTab === "Pending" && (
                      <Button 
                        fullWidth={false} 
                        className="flex-1 h-10 text-[12px] rounded-xl shadow-soft"
                        disabled={isActioning === order.id}
                        onClick={() => handleStatusChange(order.id, "Processing")}
                        variant="secondary"
                      >
                        {isActioning === order.id ? "Memproses..." : "Terima Pesanan"}
                      </Button>
                    )}
                    {activeTab === "Processing" && (
                      <Button 
                        fullWidth={false} 
                        className="flex-1 h-10 text-[12px] rounded-xl shadow-soft"
                        disabled={isActioning === order.id}
                        onClick={() => handleStatusChange(order.id, "Completed")}
                        variant="secondary"
                      >
                        {isActioning === order.id ? "Mengirim..." : "Input Resi"}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-text-sub">
                <div className="w-20 h-20 bg-surface-muted rounded-full flex items-center justify-center mb-4">
                  <Icons.Cart size={32} className="opacity-20" />
                </div>
                <p className="text-[14px] font-bold text-text-main">Belum ada pesanan</p>
                <p className="text-[12px]">Pesanan dengan status {tabs.find(t => t.id === activeTab)?.label} akan muncul di sini.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
