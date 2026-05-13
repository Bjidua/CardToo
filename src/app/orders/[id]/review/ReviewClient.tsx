"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ReviewClient({ id }: { id: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    // TODO: Integrasi Appwrite — kirim ulasan ke database
    // Setelah integrasi, ganti dengan komponen Toast UI
    router.push("/orders");
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      <StickyHeader
        title="Beri Penilaian"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-32">
        {/* Product Brief */}
        <div className="bg-white rounded-[32px] p-5 shadow-soft border border-surface-muted mb-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-surface-muted rounded-2xl flex items-center justify-center text-text-sub/20">
            <Icons.Collection size={24} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[14px] font-black text-text-main leading-tight">Pikachu VMAX Rainbow Rare</h3>
            <span className="text-[12px] text-text-sub">Mint condition</span>
          </div>
        </div>

        {/* Rating Section */}
        <div className="bg-white rounded-[40px] p-8 shadow-medium border border-surface-muted flex flex-col items-center gap-6">
          <h2 className="text-[18px] font-black text-text-main text-center">Bagaimana kualitas produk ini?</h2>
          
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
                    (hoverRating || rating) >= star ? "text-warning fill-warning scale-110" : "text-surface-muted fill-surface-muted"
                  )}
                />
              </button>
            ))}
          </div>

          <p className="text-[14px] font-bold text-primary">
            {rating === 5 && "Luar Biasa!"}
            {rating === 4 && "Sangat Bagus"}
            {rating === 3 && "Lumayan"}
            {rating === 2 && "Kurang Puas"}
            {rating === 1 && "Buruk"}
            {rating === 0 && "Pilih Rating"}
          </p>
        </div>

        {/* Review Text Area */}
        <div className="mt-8 flex flex-col gap-4">
          <label className="text-[14px] font-bold text-text-main px-2">Tulis ulasanmu</label>
          <div className="bg-white rounded-[32px] p-6 shadow-soft border border-surface-muted">
            <textarea
              className="w-full h-32 bg-transparent text-[14px] text-text-main outline-none resize-none placeholder:text-text-sub/40 font-medium"
              placeholder="Berikan detail mengenai kualitas kartu, kemasan, atau kecepatan pengiriman..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
        </div>

        {/* Photo Upload Simulation */}
        <div className="mt-8 flex flex-col gap-4">
          <label className="text-[14px] font-bold text-text-main px-2">Tambah Foto (Opsional)</label>
          <button className="w-24 h-24 rounded-[28px] border-2 border-dashed border-surface-muted flex flex-col items-center justify-center gap-2 text-text-sub hover:bg-surface-muted transition-colors active:scale-95">
            <Icons.Plus size={24} />
            <span className="text-[10px] font-bold">TAMBAH</span>
          </button>
        </div>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-6 bg-linear-to-t from-white via-white/80 to-transparent">
        <Button 
          variant="primary" 
          className="w-full h-14 rounded-2xl text-[16px] font-bold shadow-lg shadow-primary/30 uppercase tracking-widest"
          onClick={handleSubmit}
          disabled={rating === 0}
        >
          Kirim Penilaian
        </Button>
      </div>
    </div>
  );
}
