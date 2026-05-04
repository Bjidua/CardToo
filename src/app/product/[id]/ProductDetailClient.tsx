"use client";

import React from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";

interface ProductDetailClientProps {
  id: string;
}

export default function ProductDetailClient({ id }: ProductDetailClientProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-32">
      <StickyHeader
        title="Product Detail"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
        rightAction={
          <div className="flex gap-4">
            <Icons.Favorite size={24} className="text-black/60" />
            <Icons.Cart size={24} className="text-black/60" />
          </div>
        }
      />

      <main className="flex-1">
        {/* Product Image Placeholder */}
        <div className="w-full aspect-square bg-skeleton flex items-center justify-center">
          <span className="text-black/20 font-bold">IMAGE PLACEHOLDER FOR ID {id}</span>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-[24px] font-bold text-black mb-1">Pikachu VMAX</h1>
              <p className="text-[14px] text-black/40 font-medium uppercase tracking-wider">Pokemon • Mint</p>
            </div>
            <span className="text-[24px] font-bold text-primary">Rp 1.500.000</span>
          </div>

          <div className="w-full h-[1px] bg-black/5 my-2" />

          <div>
            <h2 className="text-[18px] font-bold text-black mb-2">Description</h2>
            <p className="text-[14px] text-black/60 leading-relaxed">
              Kartu Pokemon TCG langka dengan kondisi Mint. Sangat cocok untuk koleksi atau investasi jangka panjang. Dijamin original 100%.
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 p-6 flex gap-4 max-w-[440px] mx-auto z-50">
        <button className="flex-1 h-[54px] rounded-card border-2 border-primary text-primary font-bold active:scale-95 transition-transform">
          Add to Cart
        </button>
        <button className="flex-[2] h-[54px] rounded-card bg-primary text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform">
          Buy Now
        </button>
      </div>
    </div>
  );
}
