"use client";

import React, { useEffect, useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";
import { orderService } from "@/lib/services/order";
import type { BuyerOrder } from "@/types";

function PaymentContent() {
  const PAYMENT_TIMEOUT_SECONDS = 15 * 60;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isGuest, user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT_SECONDS);
  const [order, setOrder] = useState<BuyerOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!order) return;

    const calculateRemaining = () => {
      const createdAtMs = new Date(order.createdAt).getTime();
      const expiresAtMs = createdAtMs + PAYMENT_TIMEOUT_SECONDS * 1000;
      const diff = Math.floor((expiresAtMs - Date.now()) / 1000);
      return Math.max(0, diff);
    };

    setTimeLeft(calculateRemaining());
    const timer = setInterval(() => {
      setTimeLeft(calculateRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [order]);

  useEffect(() => {
    if (!user || !orderId || isGuest) return;

    const loadOrder = async () => {
      try {
        setIsLoading(true);
        const nextOrder = await orderService.getBuyerOrderById(user.id, orderId);
        setOrder(nextOrder);
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrder();
  }, [isGuest, orderId, user]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePaid = async () => {
    if (!order || timeLeft <= 0 || order.status === "cancelled") return;
    try {
      setIsSubmitting(true);
      await orderService.markOrderAsPaid(order.id);
      router.push("/orders?status=processing");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!order || isSubmitting) return;
    if (timeLeft > 0) return;
    if (order.status !== "unpaid") return;

    const cancelWhenExpired = async () => {
      try {
        const updated = await orderService.markOrderAsCancelled(order.id);
        setOrder(updated);
      } catch {
        // Ignore to avoid breaking UX if already cancelled elsewhere.
      }
    };

    void cancelWhenExpired();
  }, [order, timeLeft, isSubmitting]);

  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-surface-tint">
        <StickyHeader
          title="Pembayaran"
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="primary" />}
        />
        <GuestEmptyState
          title="Login untuk Bayar Pesanan"
          description="Masuk dulu ke akunmu untuk melihat instruksi pembayaran."
          icon={<Icons.QR size={48} />}
        />
      </main>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-surface-tint to-accent-soft">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
        <StickyHeader
          title="Pembayaran"
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="primary" />}
        />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-soft">
            <Icons.QR size={40} className="text-primary opacity-20" />
          </div>
          <h2 className="text-[18px] font-bold text-text-main">Pesanan Tidak Ditemukan</h2>
          <p className="text-[14px] text-text-sub mt-2 mb-8">
            Kami tidak menemukan data pembayaran untuk pesanan ini.
          </p>
          <Button onClick={() => router.push("/orders")} className="px-10 h-14 rounded-full">
            Lihat Pesanan Saya
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      <StickyHeader
        title="Pembayaran"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-8 pb-48 flex flex-col items-center">
        <div className="flex flex-col items-center gap-2 mb-10">
          <span className="text-[14px] font-medium text-text-sub">
            Selesaikan pembayaran dalam
          </span>
          <div className="relative flex items-center justify-center">
              <h2 className="text-[40px] font-bold text-text-main tabular-nums leading-none tracking-tighter">
                {formatTime(timeLeft)}
              </h2>
          </div>
          <div className="w-64 h-2 bg-surface-muted rounded-full mt-4 overflow-hidden border border-white/20">
            <motion.div
              className="h-full bg-danger"
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / PAYMENT_TIMEOUT_SECONDS) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
        </div>

        <div className="bg-warning/10 text-warning px-6 py-2.5 rounded-2xl flex items-center gap-2 mb-8 border border-warning/20">
          <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
          <span className="text-[13px] font-bold uppercase tracking-wider">
            {order.status === "cancelled" || timeLeft <= 0
              ? "Pesanan Dibatalkan"
              : "Menunggu Pembayaran"}
          </span>
        </div>

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
            <div className="bg-surface-muted px-3 py-1 rounded-lg text-[10px] font-bold text-text-sub">
              {order.orderCode}
            </div>
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
              1. Simpan gambar QR atau screenshot
              <br />
              2. Buka aplikasi M-Banking atau E-Wallet
              <br />
              3. Scan atau upload QR untuk membayar
            </p>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col items-center gap-1">
          <span className="text-[13px] text-text-sub">Total Tagihan</span>
          <h3 className="text-[28px] font-bold text-primary">
            Rp {order.total.toLocaleString("id-ID")}
          </h3>
        </div>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-40 p-6 flex flex-col gap-3 bg-linear-to-t from-white via-white/80 to-transparent">
        <Button
          variant="secondary"
          className="w-full h-14 rounded-2xl border-2 border-surface-muted bg-white text-text-main shadow-soft"
        >
          Simpan ke Galeri
        </Button>
          <Button
            variant="primary"
            onClick={() => void handlePaid()}
            disabled={isSubmitting || timeLeft <= 0 || order.status === "cancelled"}
            className="w-full h-14 rounded-2xl text-[16px] font-bold shadow-lg shadow-primary/30"
          >
            {isSubmitting
              ? "Memproses..."
              : timeLeft <= 0 || order.status === "cancelled"
                ? "Waktu Pembayaran Habis"
                : "Saya Sudah Bayar"}
          </Button>
        </div>
      </div>
  );
}

export default function PaymentPage() {
  return (
    <React.Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <PaymentContent />
    </React.Suspense>
  );
}
