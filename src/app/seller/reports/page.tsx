"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function SellerReportsPage() {
  return (
    <ProtectedRoute requireSeller={true}>
      <SellerReportsContent />
    </ProtectedRoute>
  );
}

function SellerReportsContent() {
  const [timeRange, setTimeRange] = useState("Bulan ini");
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Dummy Data Engine based on Time Range
  const reportData = {
    "Hari ini": {
      omzet: "Rp 0",
      profit: "Rp 0",
      orders: 0,
      visitors: 0,
      omzetChange: "0%",
      profitChange: "0%",
      ordersChange: "0%",
      visitorsChange: "0%",
      chartHeights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      bestSellers: []
    },
    "Minggu ini": {
      omzet: "Rp 0",
      profit: "Rp 0",
      orders: 0,
      visitors: 0,
      omzetChange: "0%",
      profitChange: "0%",
      ordersChange: "0%",
      visitorsChange: "0%",
      chartHeights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      bestSellers: []
    },
    "Bulan ini": {
      omzet: "Rp 0",
      profit: "Rp 0",
      orders: 0,
      visitors: 0,
      omzetChange: "0%",
      profitChange: "0%",
      ordersChange: "0%",
      visitorsChange: "0%",
      chartHeights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      bestSellers: []
    }
  }[timeRange as keyof any];

  const ranges = ["Hari ini", "Minggu ini", "Bulan ini"];

  const handleExportCSV = () => {
    setIsExporting(true);
    setShowExportMenu(false);
    
    const headers = ["Tanggal", "Produk", "Harga", "Status"];
    const rows = reportData.bestSellers.map(item => [
      new Date().toLocaleDateString("id-ID"),
      item.title,
      item.revenue.replace("Rp ", "").replace(/\./g, ""),
      "Selesai"
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
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
    }, 1500);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setShowExportMenu(false);
    setTimeout(() => {
      setIsExporting(false);
      window.print();
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-white pb-32">
      <StickyHeader 
        title="Laporan Penjualan" 
        variant="minimal" 
        size="sm" 
        leftAction={<BackButton variant="secondary"/>} 
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

      <AnimatePresence>
        {showExportMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExportMenu(false)}
              className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white rounded-t-[40px] p-8 shadow-medium z-50 flex flex-col gap-6 border-t border-surface-muted"
            >
              {/* Bottom Sheet Handle */}
              <div className="w-12 h-1.5 bg-surface-muted rounded-full mx-auto mb-2" />
              
              <h3 className="text-[18px] font-black text-text-main text-center">Export Laporan</h3>
              
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
                    <span className="text-[12px] text-text-sub font-medium">Download for Excel/Sheets</span>
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
                    <span className="text-[12px] text-text-sub font-medium">Download for Document/Print</span>
                  </div>
                </button>
              </div>

              {/* Close Button */}
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
        
        {/* Time Range Selector */}
        <div className="flex gap-2 p-1 bg-surface-muted rounded-full w-fit mx-auto">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-4 py-2 rounded-full text-[12px] font-bold transition-all",
                timeRange === range ? "bg-white text-secondary shadow-soft" : "text-text-sub"
              )}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Main Stats Cards */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              title="Total Omzet" 
              value={reportData.omzet} 
              change={reportData.omzetChange} 
              isPositive 
              icon={<Icons.Wallet size={20} />} 
            />
            <StatCard 
              title="Total Profit" 
              value={reportData.profit} 
              change={reportData.profitChange} 
              isPositive 
              icon={<Icons.CreditCard size={20} />} 
            />
            <StatCard 
              title="Pesanan" 
              value={reportData.orders.toString()} 
              change={reportData.ordersChange} 
              isPositive={!reportData.ordersChange.startsWith("-")} 
              icon={<Icons.Cart size={20} />} 
            />
            <StatCard 
              title="Pengunjung" 
              value={reportData.visitors.toLocaleString()} 
              change={reportData.visitorsChange} 
              isPositive 
              icon={<Icons.Profile size={20} />} 
            />
          </div>
          <Link href="/seller/reports/detail" className="w-full h-14 bg-white rounded-2xl shadow-soft border border-surface-muted flex items-center justify-center gap-2 text-[14px] font-bold text-secondary active:scale-[0.98] transition-all">
            <Icons.Chart size={18} />
            Lihat Detail Transaksi
          </Link>
        </div>

        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-[32px] shadow-soft border border-surface-muted flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[14px] font-bold text-text-main">Grafik Penjualan</h3>
            <span className="text-[12px] text-text-sub font-medium">{timeRange}</span>
          </div>
          
          <div className="h-40 flex items-end justify-between gap-1 px-2">
            <AnimatePresence mode="wait">
              {reportData.chartHeights.map((height, i) => (
                <motion.div 
                  key={`${timeRange}-${i}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  exit={{ height: 0 }}
                  transition={{ delay: i * 0.03, type: "spring", stiffness: 100 }}
                  className={cn(
                    "w-full rounded-t-lg transition-all duration-300",
                    height > 70 ? "bg-secondary shadow-[0_0_15px_rgba(0,202,224,0.3)]" : "bg-secondary/20"
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

        {/* Best Sellers */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[14px] font-bold text-text-sub uppercase tracking-wider px-2">Produk Terlaris</h3>
          <div className="flex flex-col gap-3">
            {reportData.bestSellers.map((item) => (
              <BestSellerItem 
                key={item.title}
                rank={item.rank} 
                title={item.title} 
                sold={item.sold} 
                revenue={item.revenue} 
              />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

function StatCard({ title, value, change, isPositive, icon }: { title: string, value: string, change: string, isPositive: boolean, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-[24px] shadow-soft border border-surface-muted flex flex-col gap-3">
      <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center text-secondary">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[12px] font-bold text-text-sub">{title}</span>
        <h4 className="text-[20px] font-black text-text-main leading-tight">{value}</h4>
      </div>
      <span className={cn(
        "text-[10px] font-bold",
        isPositive ? "text-success" : "text-danger"
      )}>
        {isPositive ? "↑" : "↓"} {change} <span className="text-text-sub/40 font-medium">vs bln lalu</span>
      </span>
    </div>
  );
}

function BestSellerItem({ rank, title, sold, revenue }: { rank: number, title: string, sold: number, revenue: string }) {
  return (
    <div className="bg-white p-4 rounded-card shadow-soft border border-surface-muted flex items-center gap-4">
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-black",
        rank === 1 ? "bg-warning/10 text-warning" : "bg-surface-muted text-text-sub"
      )}>
        {rank}
      </div>
      <div className="flex-1 flex flex-col">
        <span className="text-[14px] font-bold text-text-main line-clamp-1">{title}</span>
        <span className="text-[11px] text-text-sub font-medium">{sold} terjual</span>
      </div>
      <span className="text-[14px] font-black text-secondary">{revenue}</span>
    </div>
  );
}
