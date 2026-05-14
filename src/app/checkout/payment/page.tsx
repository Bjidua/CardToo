"use client";

import React, { useState, useEffect } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 jam dalam detik

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handlePaid = () => {
    router.push("/orders");
  };

  const totalAmount = 0;

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      <StickyHeader
        title="Pembayaran"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-8 pb-48 flex flex-col items-center">
        {/* Timer Section */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <span className="text-[14px] font-medium text-text-sub">Selesaikan pembayaran dalam</span>
          <div className="relative flex items-center justify-center">
            <h2 className="text-[40px] font-bold text-text-main tabular-nums leading-none tracking-tighter">
              {formatTime(timeLeft)}
            </h2>
          </div>
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-surface-muted rounded-full mt-4 overflow-hidden border border-white/20">
            <motion.div 
              className="h-full bg-danger"
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / (24 * 3600)) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
        </div>

        {/* Status Badge */}
        <div className="bg-warning/10 text-warning px-6 py-2.5 rounded-2xl flex items-center gap-2 mb-8 border border-warning/20">
          <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
          <span className="text-[13px] font-bold uppercase tracking-wider">Menunggu Pembayaran</span>
        </div>

        {/* QRIS Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-8 shadow-medium border border-surface-muted flex flex-col items-center gap-6 w-full max-w-[340px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Icons.QR size={24} className="text-primary" />
              <span className="text-[18px] font-bold text-text-main">QRIS</span>
            </div>
            <div className="bg-surface-muted px-3 py-1 rounded-lg text-[10px] font-bold text-text-sub">AUTO VERIFIED</div>
          </div>

          <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-4 border-surface-muted p-2 bg-white">
            <Image 
              src="/qris_code_demo_1778689761338.png" 
              alt="QRIS Code" 
              fill 
              className="object-contain"
            />
          </div>

          <div className="flex flex-col items-center text-center gap-1">
            <p className="text-[12px] text-text-sub font-medium leading-relaxed">
              1. Simpan gambar QR atau Screenshot<br/>
              2. Buka aplikasi M-Banking atau E-Wallet<br/>
              3. Scan/Upload QR untuk membayar
            </p>
          </div>
        </motion.div>

        {/* Amount Info */}
        <div className="mt-8 flex flex-col items-center gap-1">
          <span className="text-[13px] text-text-sub">Total Tagihan</span>
          <h3 className="text-[28px] font-bold text-primary">Rp {totalAmount.toLocaleString("id-ID")}</h3>
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-40 p-6 flex flex-col gap-3 bg-linear-to-t from-white via-white/80 to-transparent">
        <Button 
          variant="secondary" 
          className="w-full h-14 rounded-2xl border-2 border-surface-muted bg-white text-text-main shadow-soft"
        >
          Simpan ke Galeri
        </Button>
        <Button 
          variant="primary" 
          onClick={handlePaid}
          className="w-full h-14 rounded-2xl text-[16px] font-bold shadow-lg shadow-primary/30"
        >
          Saya Sudah Bayar
        </Button>
      </div>
    </div>
  );
}
