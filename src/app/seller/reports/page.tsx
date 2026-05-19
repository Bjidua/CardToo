"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/lib/services/order";
import { cn } from "@/lib/utils";
import type { SellerOrder } from "@/types";

// Tipe rentang waktu filter laporan penjualan
type TimeRange = "Hari ini" | "Minggu ini" | "Bulan ini";

// Tipe data objek produk terlaris
type BestSellerStat = {
  rank: number;
  title: string;
  sold: number;
  revenue: string;
};

/**
 * Halaman Laporan Penjualan Toko (SellerReportsPage)
 * Membatasi akses agar hanya bisa diakses seller terdaftar (ProtectedRoute requireSeller=true).
 */
export default function SellerReportsPage() {
  return (
    <ProtectedRoute requireSeller={true}>
      <SellerReportsContent />
    </ProtectedRoute>
  );
}

/**
 * Komponen Konten Laporan Penjualan (SellerReportsContent)
 * Menampilkan statistik bisnis detail toko:
 * - Rentang waktu (Hari ini, Minggu ini, Bulan ini)
 * - StatCard (Total Omzet, Profit Bersih, Jumlah Pesanan, Total Pengunjung)
 * - Grafik batang (Simulasi performa nominal penjualan)
 * - List produk terlaris berdasarkan revenue terbesar.
 * - Fitur Export Data (Ekspor CSV untuk Excel/Sheets atau Cetak PDF).
 */
function SellerReportsContent() {
  // Mengambil profile toko dari auth context
  const { store } = useAuth();
  const ownerUserId = store?.ownerUserId ?? null;

  // State rentang waktu filter aktif
  const [timeRange, setTimeRange] = useState<TimeRange>("Bulan ini");

  // State loading proses ekspor data
  const [isExporting, setIsExporting] = useState(false);

  // State pengendali drawer pilihan format ekspor (CSV/PDF)
  const [showExportMenu, setShowExportMenu] = useState(false);

  // State seluruh list pesanan masuk toko
  const [orders, setOrders] = useState<SellerOrder[]>([]);

  // State loading status muat pesanan
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
   * Memfilter daftar pesanan berdasarkan rentang waktu terpilih (Hari ini, Minggu ini, Bulan ini).
   */
  const filteredOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((order) => {
      const orderDate = new Date(order.date);

      if (timeRange === "Hari ini") {
        return orderDate.toDateString() === now.toDateString();
      }

      if (timeRange === "Minggu ini") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 6);
        return orderDate >= weekAgo;
      }

      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    });
  }, [orders, timeRange]);

  // Memfilter pesanan yang sudah berstatus selesai/completed
  const completedOrders = useMemo(
    () => filteredOrders.filter((order) => order.status === "completed"),
    [filteredOrders]
  );

  /**
   * Menghitung seluruh metrics rangkuman laporan (Omzet, Profit bersih, Grafik, Terlaris).
   */
  const reportData = useMemo(() => {
    // 1. Hitung total omzet bruto dari pesanan berstatus selesai
    const omzetNumber = completedOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    // 2. Hitung total profit bersih penjual (setelah dipotong biaya admin aplikasi)
    const profitNumber = completedOrders.reduce(
      (sum, order) => sum + Math.max(0, order.subtotal - order.appFee),
      0
    );

    const ordersCount = filteredOrders.length;
    const visitors = 0; // Metrik pengunjung statis

    // 3. Menghitung data visual tinggi batang chart
    const bucketCount = timeRange === "Hari ini" ? 8 : 10;
    const chartSeed = Array.from({ length: bucketCount }, (_, index) => {
      const matchingOrders = filteredOrders.filter((order) => {
        const date = new Date(order.date);

        if (timeRange === "Hari ini") {
          return date.getHours() <= (index + 1) * 3;
        }

        return date.getDate() % bucketCount === index % bucketCount;
      });

      return matchingOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    });

    const maxValue = Math.max(...chartSeed, 0);
    const chartHeights =
      maxValue > 0
        ? chartSeed.map((value) => Math.max(12, Math.round((value / maxValue) * 100)))
        : Array.from({ length: bucketCount }, () => 0);

    // 4. Agregasi total penjualan produk untuk menyaring list produk terlaris
    const itemMap = new Map<string, { title: string; sold: number; revenue: number }>();

    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        const current = itemMap.get(item.productId) || {
          title: item.title,
          sold: 0,
          revenue: 0,
        };
        current.sold += item.qty;
        current.revenue += item.totalPrice;
        itemMap.set(item.productId, current);
      });
    });

    const bestSellers: BestSellerStat[] = Array.from(itemMap.values())
      .sort((left, right) => right.revenue - left.revenue)
      .slice(0, 5)
      .map((item, index) => ({
        rank: index + 1,
        title: item.title,
        sold: item.sold,
        revenue: `Rp ${item.revenue.toLocaleString("id-ID")}`,
      }));

    return {
      omzetNumber,
      profitNumber,
      ordersCount,
      visitors,
      omzet: `Rp ${omzetNumber.toLocaleString("id-ID")}`,
      profit: `Rp ${profitNumber.toLocaleString("id-ID")}`,
      orders: ordersCount,
      visitorsLabel: visitors.toLocaleString("id-ID"),
      chartHeights,
      bestSellers,
    };
  }, [completedOrders, filteredOrders, timeRange]);

  const ranges: TimeRange[] = ["Hari ini", "Minggu ini", "Bulan ini"];

  /**
   * Ekspor data transaksi ke file format CSV.
   */
  const handleExportCSV = () => {
    setIsExporting(true);
    setShowExportMenu(false);

    const headers = ["Tanggal", "Order", "Pelanggan", "Total", "Status"];
    const rows = filteredOrders.map((order) => [
      new Date(order.date).toLocaleDateString("id-ID"),
      order.orderCode,
      order.customerName,
      String(order.totalPrice),
      order.status,
    ]);

    const csvContent = [headers, ...rows].map((entry) => entry.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    setTimeout(() => {
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Laporan_Penjualan_${timeRange.replace(" ", "_")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 800);
  };

  /**
   * Ekspor laporan ke PDF dengan memicu dialog browser print.
   */
  const handleExportPDF = () => {
    setIsExporting(true);
    setShowExportMenu(false);

    setTimeout(() => {
      setIsExporting(false);
      window.print();
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-white pb-32">
      {/* Header Halaman atas */}
      <StickyHeader
        title="Laporan Penjualan"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="secondary" />}
        rightAction={
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            className="p-2 text-secondary active:scale-90 transition-transform disabled:opacity-50"
          >
            {isExporting ? (
              <Icons.History size={20} className="animate-spin" />
            ) : (
              <Icons.Export size={24} />
            )}
          </button>
        }
      />

      {/* Drawer Pilihan Format Ekspor */}
      <AnimatePresence>
        {showExportMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExportMenu(false)}
              className="fixed inset-0 z-40 bg-text-main/10 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white rounded-t-[40px] p-8 shadow-medium z-50 flex flex-col gap-6 border-t border-surface-muted"
            >
              <div className="w-12 h-1.5 bg-surface-muted rounded-full mx-auto mb-2" />

              <h3 className="text-[18px] font-bold text-text-main text-center">
                Export Laporan
              </h3>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-4 p-5 rounded-[24px] bg-surface-muted active:scale-[0.98] transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center">
                    <Icons.Collection size={24} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[15px] font-bold text-text-main">CSV Format</span>
                    <span className="text-[12px] text-text-sub font-medium">
                      Download for Excel/Sheets
                    </span>
                  </div>
                </button>

                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-4 p-5 rounded-[24px] bg-surface-muted active:scale-[0.98] transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center">
                    <Icons.Profile size={24} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[15px] font-bold text-text-main">PDF Format</span>
                    <span className="text-[12px] text-text-sub font-medium">
                      Download for Document/Print
                    </span>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowExportMenu(false)}
                className="w-full h-[55px] rounded-[26px] bg-surface-light text-text-sub font-bold text-[14px] active:scale-[0.98] transition-all mt-2"
              >
                Batalkan
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 px-6 pt-6 flex flex-col gap-8">
        {/* Filter Rentang Waktu Pill Buttons */}
        <div className="flex gap-2 p-1 bg-surface-muted rounded-full w-fit mx-auto">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-4 py-2 rounded-full text-[12px] font-bold transition-all",
                timeRange === range
                  ? "bg-white text-secondary shadow-soft"
                  : "text-text-sub"
              )}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Render Spinner loading atau metrik laporan */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Grid 4 StatCard Utama */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  title="Total Omzet"
                  value={reportData.omzet}
                  change={`${reportData.orders}`}
                  changeSuffix="order"
                  isPositive
                  icon={<Icons.Wallet size={20} />}
                />
                <StatCard
                  title="Total Profit"
                  value={reportData.profit}
                  change={`${completedOrders.length}`}
                  changeSuffix="selesai"
                  isPositive
                  icon={<Icons.CreditCard size={20} />}
                />
                <StatCard
                  title="Pesanan"
                  value={reportData.orders.toString()}
                  change={`${filteredOrders.filter((order) => order.status === "shipped").length}`}
                  changeSuffix="dikirim"
                  isPositive
                  icon={<Icons.Cart size={20} />}
                />
                <StatCard
                  title="Pengunjung"
                  value={reportData.visitorsLabel}
                  change="0"
                  changeSuffix="data"
                  isPositive
                  icon={<Icons.Profile size={20} />}
                />
              </div>
              {/* Tautan navigasi ke rincian daftar order masuk */}
              <Link
                href="/seller/reports/detail"
                className="w-full h-14 bg-white rounded-2xl shadow-soft border border-surface-muted flex items-center justify-center gap-2 text-[14px] font-bold text-secondary active:scale-[0.98] transition-all"
              >
                <Icons.Chart size={18} />
                Lihat Detail Transaksi
              </Link>
            </div>

            {/* Visual Grafik Batang Penjualan */}
            <div className="bg-white p-6 rounded-[32px] shadow-soft border border-surface-muted flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-[14px] font-bold text-text-main">
                  Grafik Penjualan
                </h3>
                <span className="text-[12px] text-text-sub font-medium">
                  {timeRange}
                </span>
              </div>

              <div className="h-40 flex items-end justify-between gap-1 px-2">
                <AnimatePresence mode="wait">
                  {reportData.chartHeights.map((height, index) => (
                    <motion.div
                      key={`${timeRange}-${index}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      exit={{ height: 0 }}
                      transition={{ delay: index * 0.03, type: "spring", stiffness: 100 }}
                      className={cn(
                        "w-full rounded-t-lg transition-all duration-300",
                        height > 70 ? "bg-secondary shadow-soft" : "bg-secondary/20"
                      )}
                    />
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex justify-between px-2 text-[10px] font-bold text-text-sub uppercase tracking-tighter">
                <span>Awal</span>
                <span>Tengah</span>
                <span>Akhir</span>
              </div>
            </div>

            {/* List 5 Item Produk Terlaris Toko */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[14px] font-bold text-text-sub uppercase tracking-wider px-2">
                Produk Terlaris
              </h3>
              <div className="flex flex-col gap-3">
                {reportData.bestSellers.length > 0 ? (
                  reportData.bestSellers.map((item) => (
                    <BestSellerItem
                      key={item.title}
                      rank={item.rank}
                      title={item.title}
                      sold={item.sold}
                      revenue={item.revenue}
                    />
                  ))
                ) : (
                  <div className="bg-white p-5 rounded-card shadow-soft border border-dashed border-surface-muted text-center text-text-sub text-[12px] font-medium">
                    Belum ada data penjualan selesai pada periode ini.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/**
 * Komponen Kartu Statistik Mini (StatCard)
 */
function StatCard({
  title,
  value,
  change,
  changeSuffix,
  isPositive,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  changeSuffix: string;
  isPositive: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-5 rounded-[24px] shadow-soft border border-surface-muted flex flex-col gap-3">
      <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center text-secondary">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[12px] font-bold text-text-sub">{title}</span>
        <h4 className="text-[20px] font-bold text-text-main leading-tight">{value}</h4>
      </div>
      <span
        className={cn(
          "text-[10px] font-bold",
          isPositive ? "text-success" : "text-danger"
        )}
      >
        {isPositive ? "+" : "-"} {change}{" "}
        <span className="text-text-sub/40 font-medium">{changeSuffix}</span>
      </span>
    </div>
  );
}

/**
 * Item List Produk Terlaris (BestSellerItem)
 */
function BestSellerItem({
  rank,
  title,
  sold,
  revenue,
}: {
  rank: number;
  title: string;
  sold: number;
  revenue: string;
}) {
  return (
    <div className="bg-white p-4 rounded-card shadow-soft border border-surface-muted flex items-center gap-4">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold",
          rank === 1 ? "bg-warning/10 text-warning" : "bg-surface-muted text-text-sub"
        )}
      >
        {rank}
      </div>
      <div className="flex-1 flex flex-col">
        <span className="text-[14px] font-bold text-text-main line-clamp-1">
          {title}
        </span>
        <span className="text-[11px] text-text-sub font-medium">{sold} terjual</span>
      </div>
      <span className="text-[14px] font-bold text-secondary">{revenue}</span>
    </div>
  );
}
