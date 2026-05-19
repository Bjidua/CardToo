"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/lib/services/order";
import type { SellerOrder, TransactionDetail } from "@/types";

/**
 * Halaman Rincian Detail Penjualan Toko (SalesDetailPage)
 * Dibungkus ProtectedRoute (requireSeller=true) agar hanya bisa diakses oleh seller terdaftar.
 */
export default function SalesDetailPage() {
  return (
    <ProtectedRoute requireSeller={true}>
      <SalesDetailContent />
    </ProtectedRoute>
  );
}

/**
 * Komponen Konten Rincian Detail Penjualan (SalesDetailContent)
 * Menampilkan histori transaksi penjualan secara granular (per item produk):
 * - Kolom pencarian berdasarkan ID pesanan atau nama produk.
 * - Card transaksi detail (ID pesanan, nama produk, status transaksi).
 * - Breakdown nominal (harga bruto, potongan biaya layanan aplikasi, dan penghasilan bersih seller).
 */
function SalesDetailContent() {
  // Mengambil profile toko dari auth context
  const { store } = useAuth();
  const ownerUserId = store?.ownerUserId ?? null;

  // State pencarian transaksi
  const [searchTerm, setSearchTerm] = useState("");

  // State daftar order mentah dari DB
  const [orders, setOrders] = useState<SellerOrder[]>([]);

  // State loading status muat
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Effect Hook untuk memuat seluruh pesanan masuk toko.
   */
  useEffect(() => {
    if (!ownerUserId) return;

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const nextOrders = await orderService.listSellerOrders(ownerUserId);
        setOrders(nextOrders);
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, [ownerUserId]);

  /**
   * Mengonversi struktur pesanan (SellerOrder) menjadi list rincian transaksi granular per item produk (TransactionDetail[]).
   */
  const details = useMemo(() => {
    return orders.flatMap((order) =>
      order.items.map(
        (item): TransactionDetail => ({
          id: `${order.id}-${item.id}`,
          orderId: order.orderCode,
          date: new Date(order.date).toLocaleDateString("id-ID"),
          productName: item.title,
          grossAmount: item.totalPrice,
          // Proporsi biaya layanan per item produk berdasarkan kontribusinya terhadap subtotal order
          serviceFee: Math.round(
            order.appFee * (item.totalPrice / Math.max(order.subtotal, 1))
          ),
          // Nominal bersih yang didapatkan penjual (Bruto - Biaya layanan)
          netAmount:
            item.totalPrice -
            Math.round(order.appFee * (item.totalPrice / Math.max(order.subtotal, 1))),
          status: order.status === "completed" ? "Completed" : "Processing",
        })
      )
    );
  }, [orders]);

  // Menyaring list transaksi granular berdasarkan ID pesanan atau nama produk
  const filteredDetails = useMemo(
    () =>
      details.filter(
        (detail) =>
          detail.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          detail.productName.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [details, searchTerm]
  );

  /**
   * Helper format angka rupiah (IDR).
   */
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-white pb-32">
      {/* Header Halaman atas */}
      <StickyHeader
        title="Detail Penjualan"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="secondary" />}
        rightAction={
          <button className="w-10 h-10 bg-white rounded-xl shadow-soft flex items-center justify-center text-secondary border border-surface-muted active:scale-90 transition-transform">
            <Icons.Export size={20} />
          </button>
        }
      />

      <main className="flex-1">
        {/* Kolom Pencarian */}
        <div className="px-6 pt-6 pb-2">
          <Input
            placeholder="Cari ID Pesanan atau Nama Produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={<Icons.Search size={18} />}
            className="h-[52px] bg-white shadow-soft"
          />
        </div>

        {/* List Transaksi Rinci */}
        <div className="p-6 flex flex-col gap-4">
          {/* Spinner Pemuatan */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {!isLoading &&
              filteredDetails.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[24px] p-5 shadow-soft border border-surface-muted flex flex-col gap-4"
                >
                  {/* Judul & Status Pesanan */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-text-sub uppercase tracking-widest">
                        {item.orderId}
                      </span>
                      <h4 className="text-[14px] font-bold text-text-main line-clamp-1">
                        {item.productName}
                      </h4>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        item.status === "Completed"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      )}
                    >
                      {item.status === "Completed" ? "Selesai" : "Diproses"}
                    </span>
                  </div>

                  {/* Rincian Potongan Keuangan */}
                  <div className="flex flex-col gap-2 py-3 border-y border-surface-muted/50 border-dashed">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-text-sub">Harga Produk</span>
                      <span className="font-bold text-text-main">
                        {formatPrice(item.grossAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-text-sub">Biaya Layanan</span>
                      <span className="font-bold text-danger">
                        -{formatPrice(item.serviceFee)}
                      </span>
                    </div>
                  </div>

                  {/* Tanggal & Total Akhir Bersih */}
                  <div className="flex justify-between items-center pt-1">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-text-sub font-medium">
                        {item.date}
                      </span>
                      <span className="text-[12px] font-bold text-text-main">
                        Penghasilan Bersih
                      </span>
                    </div>
                    <span className="text-[18px] font-bold text-secondary">
                      {formatPrice(item.netAmount)}
                    </span>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>

          {/* State Pencarian Kosong */}
          {!isLoading && filteredDetails.length === 0 && (
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
