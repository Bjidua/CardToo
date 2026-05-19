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

/**
 * Komponen Konten Pembayaran (PaymentContent)
 * Mengelola antarmuka pembayaran pesanan menggunakan metode QRIS,
 * termasuk manajemen hitung mundur (countdown timer) dan pembatalan otomatis jika waktu habis.
 */
function PaymentContent() {
  // Batas waktu pembayaran standar: 15 menit (900 detik)
  const PAYMENT_TIMEOUT_SECONDS = 15 * 60;
  
  // Instance Next.js router untuk navigasi halaman
  const router = useRouter();
  
  // Mengambil query parameters dari URL
  const searchParams = useSearchParams();
  
  // Mengakses status autentikasi pengguna dari AuthContext
  const { isGuest, user } = useAuth();
  
  // State untuk menyimpan sisa waktu pembayaran dalam detik
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT_SECONDS);
  
  // State untuk menyimpan detail data pesanan pembeli
  const [order, setOrder] = useState<BuyerOrder | null>(null);
  
  // State indikator pemuatan data pesanan dari server
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk menandai proses pengiriman konfirmasi pembayaran (loading submit)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mengambil ID pesanan dari query parameter URL (?orderId=...)
  const orderId = searchParams.get("orderId");

  /**
   * Effect Hook untuk mengelola hitung mundur sisa waktu pembayaran.
   * Efek ini diaktifkan ketika objek `order` berhasil diambil dan diset ke dalam state.
   */
  useEffect(() => {
    if (!order) return;

    // Menghitung sisa detik pembayaran secara dinamis dari waktu pembuatan pesanan
    const calculateRemaining = () => {
      const createdAtMs = new Date(order.createdAt).getTime();
      const expiresAtMs = createdAtMs + PAYMENT_TIMEOUT_SECONDS * 1000;
      const diff = Math.floor((expiresAtMs - Date.now()) / 1000);
      return Math.max(0, diff); // Pastikan nilai tidak negatif
    };

    // Set sisa waktu awal saat pesanan dimuat
    setTimeLeft(calculateRemaining());
    
    // Timer interval yang mengurangi sisa waktu setiap 1 detik
    const timer = setInterval(() => {
      setTimeLeft(calculateRemaining());
    }, 1000);

    // Membersihkan interval timer saat komponen di-unmount atau pesanan berubah
    return () => clearInterval(timer);
  }, [order]);

  /**
   * Effect Hook untuk memuat detail pesanan dari backend Appwrite.
   * Menghindari pemuatan data jika pengguna belum login (Guest) atau ID pesanan tidak ada.
   */
  useEffect(() => {
    if (!user || !orderId || isGuest) return;

    const loadOrder = async () => {
      try {
        setIsLoading(true); // Mulai animasi loading
        // Panggil service untuk fetch data pesanan berdasarkan ID Pesanan dan ID User
        const nextOrder = await orderService.getBuyerOrderById(user.id, orderId);
        setOrder(nextOrder);
      } finally {
        setIsLoading(false); // Matikan animasi loading
      }
    };

    void loadOrder();
  }, [isGuest, orderId, user]);

  /**
   * Mengubah sisa waktu detik menjadi format waktu HH:MM:SS
   * @param seconds Sisa waktu dalam detik
   */
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  /**
   * Callback untuk menangani aksi klik "Saya Sudah Bayar".
   * Mengubah status pesanan menjadi lunas (paid) di database backend.
   */
  const handlePaid = async () => {
    if (!order || timeLeft <= 0 || order.status === "cancelled") return;
    try {
      setIsSubmitting(true); // Set state memproses kiriman
      // Update status pesanan di database menjadi Paid
      await orderService.markOrderAsPaid(order.id);
      // Arahkan ke halaman riwayat pesanan dengan filter status sedang dikemas (processing)
      router.push("/orders?status=processing");
    } finally {
      setIsSubmitting(false); // Matikan status memproses
    }
  };

  /**
   * Effect Hook untuk menangani pembatalan pesanan secara otomatis ketika waktu pembayaran habis.
   */
  useEffect(() => {
    if (!order || isSubmitting) return;
    if (timeLeft > 0) return; // Belum habis waktu
    if (order.status !== "unpaid") return; // Hanya batalkan jika status saat ini masih belum bayar (unpaid)

    const cancelWhenExpired = async () => {
      try {
        // Panggil service untuk menandai pesanan dibatalkan (cancelled) di Appwrite
        const updated = await orderService.markOrderAsCancelled(order.id);
        setOrder(updated); // Perbarui state data pesanan di UI
      } catch {
        // Abaikan error agar tidak merusak UX jika data sudah terlanjur diupdate oleh server/cron job lain
      }
    };

    void cancelWhenExpired();
  }, [order, timeLeft, isSubmitting]);

  // UI STATE 1: Jika user berstatus tamu (Guest), minta login terlebih dahulu
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

  // UI STATE 2: Menampilkan spinner jika data pesanan sedang diambil
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-surface-tint to-accent-soft">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // UI STATE 3: Menampilkan layar "Tidak Ditemukan" jika ID pesanan tidak ada atau gagal diload
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

  // UI UTAMA: Menampilkan instruksi pembayaran QRIS beserta timer sisa waktu
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      {/* Header navigasi atas */}
      <StickyHeader
        title="Pembayaran"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-8 pb-48 flex flex-col items-center">
        {/* Section Timer Hitung Mundur */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <span className="text-[14px] font-medium text-text-sub">
            Selesaikan pembayaran dalam
          </span>
          <div className="relative flex items-center justify-center">
              <h2 className="text-[40px] font-bold text-text-main tabular-nums leading-none tracking-tighter">
                {formatTime(timeLeft)}
              </h2>
          </div>
          {/* Progress bar visual penunjuk sisa waktu */}
          <div className="w-64 h-2 bg-surface-muted rounded-full mt-4 overflow-hidden border border-white/20">
            <motion.div
              className="h-full bg-danger"
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / PAYMENT_TIMEOUT_SECONDS) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
        </div>

        {/* Badge Status Pembayaran Aktif */}
        <div className="bg-warning/10 text-warning px-6 py-2.5 rounded-2xl flex items-center gap-2 mb-8 border border-warning/20">
          <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
          <span className="text-[13px] font-bold uppercase tracking-wider">
            {order.status === "cancelled" || timeLeft <= 0
              ? "Pesanan Dibatalkan"
              : "Menunggu Pembayaran"}
          </span>
        </div>

        {/* Box Kartu Kode QRIS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-8 shadow-medium border border-surface-muted flex flex-col items-center gap-6 w-full max-w-[340px]"
        >
          {/* Header Kartu QRIS */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Icons.QR size={24} className="text-primary" />
              <span className="text-[18px] font-bold text-text-main">QRIS</span>
            </div>
            <div className="bg-surface-muted px-3 py-1 rounded-lg text-[10px] font-bold text-text-sub">
              {order.orderCode}
            </div>
          </div>

          {/* QR Code Container */}
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-4 border-surface-muted p-2 bg-white">
            <Image
              src="/qris_code_demo_1778689761338.png"
              alt="QRIS Code"
              fill
              className="object-contain"
            />
          </div>

          {/* Panduan Pembayaran Singkat */}
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

        {/* Informasi Total Tagihan */}
        <div className="mt-8 flex flex-col items-center gap-1">
          <span className="text-[13px] text-text-sub">Total Tagihan</span>
          <h3 className="text-[28px] font-bold text-primary">
            Rp {order.total.toLocaleString("id-ID")}
          </h3>
        </div>
      </main>

      {/* Tombol Aksi di Bagian Bawah Layar */}
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

/**
 * Halaman Utama PaymentPage
 * Dibungkus dengan Suspense untuk mendukung Dynamic Routing Next.js dengan useSearchParams
 */
export default function PaymentPage() {
  return (
    <React.Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <PaymentContent />
    </React.Suspense>
  );
}
