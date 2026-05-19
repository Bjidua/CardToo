"use client";

import React, { useEffect, useMemo, useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";
import { orderService } from "@/lib/services/order";
import { reviewService } from "@/lib/services/review";
import type { BuyerOrder } from "@/types";

/**
 * Komponen Client Penilaian Pesanan (ReviewClient)
 * Menangani pemberian ulasan (rating bintang dan feedback teks) dari pembeli untuk pesanan yang telah selesai.
 * Fitur:
 * - Load detail pesanan & mendeteksi apakah ulasan sudah pernah dikirim sebelumnya (hasExistingReview).
 * - Interactive rating bintang 1-5 dengan hover effect.
 * - Textarea feedback tertulis.
 */
export default function ReviewClient({ id }: { id: string }) {
  const router = useRouter();

  // Membaca status login user aktif
  const { user, isGuest } = useAuth();

  // State nilai rating bintang aktif (1 - 5)
  const [rating, setRating] = useState(0);

  // State melacak bintang yang sedang di-hover mouse
  const [hoverRating, setHoverRating] = useState(0);

  // State isi teks ulasan produk
  const [review, setReview] = useState("");

  // State detail transaksi pesanan pembeli
  const [order, setOrder] = useState<BuyerOrder | null>(null);

  // State loading saat memuat data awal
  const [isLoading, setIsLoading] = useState(false);

  // State penunjuk apakah pesanan ini telah diulas sebelumnya
  const [hasExistingReview, setHasExistingReview] = useState(false);

  // State loading saat mengirim ulasan ke database
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Effect Hook untuk memuat data transaksi pesanan serta status review saat ini.
   * Dijalankan ketika ID transaksi pesanan atau data user berubah.
   */
  useEffect(() => {
    if (!user || isGuest || !id) return;

    const loadOrder = async () => {
      try {
        setIsLoading(true); // Aktifkan spinner memuat
        // Menjalankan query paralel mengambil data pesanan & deteksi review eksis
        const [nextOrder, existingReview] = await Promise.all([
          orderService.getBuyerOrderById(user.id, id),
          reviewService.getReviewByOrderId(id),
        ]);
        setOrder(nextOrder);
        setHasExistingReview(Boolean(existingReview));
      } finally {
        setIsLoading(false); // Matikan spinner memuat
      }
    };

    void loadOrder();
  }, [id, isGuest, user]);

  // Mengambil item produk pertama dalam transaksi sebagai representasi utama visual
  const headlineItem = useMemo(() => order?.items[0] || null, [order]);

  /**
   * Mengirim data penilaian (rating bintang & ulasan) ke backend Appwrite.
   * Setelah sukses, user akan dialihkan kembali ke daftar riwayat pesanan.
   */
  const handleSubmit = async () => {
    if (!user || !order || rating === 0) return;

    try {
      setIsSubmitting(true); // Kunci tombol submit
      // Simpan review baru ke koleksi database
      await reviewService.createReview(user.id, order.id, rating, review);
      // Alihkan halaman ke riwayat transaksi dengan query parameter review
      router.push("/orders?status=review");
    } finally {
      setIsSubmitting(false); // Kembalikan tombol ke keadaan normal
    }
  };

  // UI STATE 1: Proteksi guest/tamu, tampilkan form kosong login
  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
        <StickyHeader
          title="Beri Penilaian"
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="primary" />}
        />
        <GuestEmptyState
          title="Login untuk Beri Penilaian"
          description="Penilaian pembelian hanya tersedia untuk pengguna yang sudah masuk."
          icon={<Icons.Review size={48} />}
        />
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      {/* Header Halaman */}
      <StickyHeader
        title="Beri Penilaian"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-32">
        {/* Render spinner loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : !order || !headlineItem ? (
          /* Render info jika order tidak ditemukan */
          <div className="bg-white rounded-[32px] p-8 shadow-soft border border-surface-muted text-center">
            <p className="text-[16px] font-bold text-text-main">Pesanan Tidak Ditemukan</p>
            <p className="text-[13px] text-text-sub mt-2">
              Data produk untuk diberi penilaian belum tersedia.
            </p>
          </div>
        ) : hasExistingReview ? (
          /* Render info jika transaksi ini sudah pernah diulas */
          <div className="bg-white rounded-[32px] p-8 shadow-soft border border-surface-muted text-center">
            <p className="text-[16px] font-bold text-text-main">Ulasan Sudah Terkirim</p>
            <p className="text-[13px] text-text-sub mt-2">
              Pesanan ini sudah pernah kamu beri penilaian.
            </p>
          </div>
        ) : (
          /* Render Form Penilaian Utama */
          <>
            {/* Informasi Singkat Produk yang Dibeli */}
            <div className="bg-white rounded-[32px] p-5 shadow-soft border border-surface-muted mb-8 flex items-center gap-4">
              <div className="w-16 h-16 bg-surface-muted rounded-2xl flex items-center justify-center text-text-sub/20">
                <Icons.Collection size={24} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[14px] font-bold text-text-main leading-tight">
                  {order.items.length > 1
                    ? `${headlineItem.productTitle} +${order.items.length - 1} item`
                    : headlineItem.productTitle}
                </h3>
                <span className="text-[12px] text-text-sub">{headlineItem.condition}</span>
              </div>
            </div>

            {/* Input Pemilihan Bintang */}
            <div className="bg-white rounded-[40px] p-8 shadow-medium border border-surface-muted flex flex-col items-center gap-6">
              <h2 className="text-[18px] font-bold text-text-main text-center">
                Bagaimana kualitas produk ini?
              </h2>

              {/* Baris Bintang Interaktif */}
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="relative active:scale-90 transition-transform"
                  >
                    <Icons.Review
                      size={44}
                      className={cn(
                        "transition-all duration-300",
                        (hoverRating || rating) >= star
                          ? "text-warning fill-warning scale-110"
                          : "text-surface-muted fill-surface-muted"
                      )}
                    />
                  </button>
                ))}
              </div>

              {/* Teks Penjelas Status Rating */}
              <p className="text-[14px] font-bold text-primary">
                {rating === 5 && "Luar Biasa!"}
                {rating === 4 && "Sangat Bagus"}
                {rating === 3 && "Lumayan"}
                {rating === 2 && "Kurang Puas"}
                {rating === 1 && "Buruk"}
                {rating === 0 && "Pilih Rating"}
              </p>
            </div>

            {/* Form Input Komentar Ulasan */}
            <div className="mt-8 flex flex-col gap-4">
              <label className="text-[14px] font-bold text-text-main px-2">
                Tulis ulasanmu
              </label>
              <div className="bg-white rounded-[32px] p-6 shadow-soft border border-surface-muted">
                <textarea
                  className="w-full h-32 bg-transparent text-[14px] text-text-main outline-none resize-none placeholder:text-text-sub/40 font-medium"
                  placeholder="Berikan detail mengenai kualitas kartu, kemasan, atau kecepatan pengiriman..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>
            </div>

            {/* Unggah Foto/Gambar Kartu (Opsional - Simulasi UI) */}
            <div className="mt-8 flex flex-col gap-4">
              <label className="text-[14px] font-bold text-text-main px-2">
                Tambah Foto (Opsional)
              </label>
              <button className="w-24 h-24 rounded-[28px] border-2 border-dashed border-surface-muted flex flex-col items-center justify-center gap-2 text-text-sub hover:bg-surface-muted transition-colors active:scale-95">
                <Icons.Plus size={24} />
                <span className="text-[10px] font-bold">TAMBAH</span>
              </button>
            </div>
          </>
        )}
      </main>

      {/* Footer CTA Kirim Penilaian */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-6 bg-linear-to-t from-white via-white/80 to-transparent">
        <Button
          variant="primary"
          className="w-full h-14 rounded-2xl text-[16px] font-bold shadow-lg shadow-primary/30 uppercase tracking-widest"
          onClick={() => void handleSubmit()}
          disabled={rating === 0 || !order || hasExistingReview || isSubmitting}
        >
          {isSubmitting ? "Mengirim..." : "Kirim Penilaian"}
        </Button>
      </div>
    </div>
  );
}
