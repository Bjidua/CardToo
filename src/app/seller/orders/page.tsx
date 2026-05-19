"use client";

import React, { useEffect, useMemo, useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useSearchParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  formatSellerOrderStatus,
  orderService,
} from "@/lib/services/order";
import type { SellerOrder } from "@/types";

// Tipe definisi tab filter pesanan di dashboard seller
type SellerOrderTab = "Pending" | "Processing" | "Completed";

// Pemetaan ID tab ke array status order riil di DB/Appwrite
const TAB_STATUS_MAP: Record<SellerOrderTab, SellerOrder["status"][]> = {
  Pending: ["packed"], // Perlu Dikirim
  Processing: ["shipped"], // Sedang Dikirim
  Completed: ["completed"], // Sudah Selesai
};

// Daftar metadata tab navigasi
const tabs: Array<{ id: SellerOrderTab; label: string }> = [
  { id: "Pending", label: "Perlu Dikirim" },
  { id: "Processing", label: "Dikirim" },
  { id: "Completed", label: "Selesai" },
];

/**
 * Halaman Pengelolaan Pesanan Toko Penjual (SellerOrdersPage)
 * Dibungkus dengan ProtectedRoute (requireSeller=true) agar hanya bisa diakses seller terdaftar.
 */
export default function SellerOrdersPage() {
  return (
    <ProtectedRoute requireSeller={true}>
      <SellerOrdersContent />
    </ProtectedRoute>
  );
}

/**
 * Komponen Konten Pengelolaan Pesanan (SellerOrdersContent)
 * Menampilkan dan mengelola pesanan masuk:
 * - Tab navigasi penyaring status (Perlu dikirim, Dikirim, Selesai).
 * - Menampilkan detail pesanan (Kode pesanan, nama pembeli, total produk, total harga).
 * - Tombol aksi kirim barang (untuk order yang baru masuk/packed).
 * - Tombol navigasi menuju halaman detail pesanan.
 */
function SellerOrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Membaca session user login aktif dari auth context
  const { user, isGuest } = useAuth();

  // Membaca tab aktif awal dari query parameter URL (?tab=...)
  const requestedTab = searchParams.get("tab");
  const initialTab = tabs.some((tab) => tab.id === requestedTab)
    ? (requestedTab as SellerOrderTab)
    : "Pending";

  // State tab filter aktif
  const [activeTab, setActiveTab] = useState<SellerOrderTab>(initialTab);

  // State penyimpan seluruh data pesanan masuk ke toko
  const [orders, setOrders] = useState<SellerOrder[]>([]);

  // State loading pemuatan data
  const [isLoading, setIsLoading] = useState(false);

  // State ID pesanan yang sedang diproses kirim untuk loader lokal tombol
  const [isActioning, setIsActioning] = useState<string | null>(null);

  /**
   * Effect Hook untuk memuat daftar pesanan masuk berdasarkan ownerUserId penjual.
   */
  useEffect(() => {
    if (!user || isGuest) return;

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const nextOrders = await orderService.listSellerOrders(user.id);
        setOrders(nextOrders);
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, [isGuest, user]);

  // Memfilter daftar pesanan berdasarkan tab aktif saat ini
  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        TAB_STATUS_MAP[activeTab].includes(order.status)
      ),
    [activeTab, orders]
  );

  /**
   * Mengirim pesanan / mengubah status pesanan dari "packed" ke "shipped".
   * 
   * @param orderId ID unik dokumen transaksi/order
   */
  const handleShipOrder = async (orderId: string) => {
    if (!user) return;

    try {
      setIsActioning(orderId); // Set loading status untuk baris bersangkutan
      
      // Request update status ke database Appwrite
      const updatedOrder = await orderService.markOrderAsShipped(orderId, user.id);
      
      // Update data di state lokal
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      
      // Pindahkan tampilan user ke tab 'Processing' (Sedang dikirim)
      setActiveTab("Processing");
    } finally {
      setIsActioning(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-white pb-32">
      {/* Header Halaman atas */}
      <StickyHeader
        title="Pesanan Masuk"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="secondary" />}
      />

      <main className="flex-1">
        {/* Tab Selector Sticky */}
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
                  layoutId="activeSellerTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-secondary rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* List Data Pesanan */}
        <div className="p-6 flex flex-col gap-4">
          {/* Loading Spinner */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {!isLoading && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[24px] p-5 shadow-soft border border-surface-muted flex flex-col gap-4"
                >
                  {/* Bagian Atas Pesanan */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-text-sub uppercase tracking-widest">
                        {order.orderCode}
                      </span>
                      <h4 className="text-[16px] font-bold text-text-main">
                        {order.customerName}
                      </h4>
                    </div>
                    <span className="text-[12px] text-text-sub font-medium">
                      {new Date(order.date).toLocaleDateString("id-ID")}
                    </span>
                  </div>

                  {/* Summary Ringkasan Jumlah & Total Harga */}
                  <div className="flex items-center gap-3 py-2 border-y border-surface-muted/50 border-dashed">
                    <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center text-text-sub">
                      <Icons.Collection size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-text-main">
                        {order.productCount} Produk
                      </span>
                      <span className="text-[14px] font-bold text-secondary">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(order.totalPrice)}
                      </span>
                    </div>
                    <span className="ml-auto text-[11px] font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                      {formatSellerOrderStatus(order.status)}
                    </span>
                  </div>

                  {/* Tombol Tindakan Aksi */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      fullWidth={false}
                      className="flex-1 h-10 text-[12px] rounded-xl"
                      onClick={() =>
                        router.push(
                          `/seller/orders/detail?orderId=${encodeURIComponent(order.id)}`
                        )
                      }
                    >
                      Detail
                    </Button>
                    {/* Tombol Aksi Kirim Pesanan (Hanya untuk tab Perlu Dikirim/packed) */}
                    {order.status === "packed" && (
                      <Button
                        fullWidth={false}
                        className="flex-1 h-10 text-[12px] rounded-xl shadow-soft"
                        disabled={isActioning === order.id}
                        onClick={() => void handleShipOrder(order.id)}
                        variant="secondary"
                      >
                        {isActioning === order.id ? "Mengirim..." : "Kirim Pesanan"}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : !isLoading ? (
              /* State Pesanan Kosong */
              <div className="flex flex-col items-center justify-center py-20 text-text-sub">
                <div className="w-20 h-20 bg-surface-muted rounded-full flex items-center justify-center mb-4">
                  <Icons.Cart size={32} className="opacity-20" />
                </div>
                <p className="text-[14px] font-bold text-text-main">Belum ada pesanan</p>
                <p className="text-[12px] text-center">
                  Pesanan dengan status{" "}
                  {tabs.find((tab) => tab.id === activeTab)?.label} akan muncul di sini.
                </p>
              </div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
