"use client";

import React from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { MenuListItem } from "@/components/ui/MenuListItem";

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      <StickyHeader
        title="Pusat Bantuan"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-32">
        <div className="relative w-full h-[50px] bg-white rounded-card shadow-soft border border-black/5 flex items-center px-4 mb-8">
          <Icons.Search size={18} className="text-black/20" />
          <input 
            type="text" 
            placeholder="Ada yang bisa kami bantu?" 
            className="flex-1 bg-transparent border-none outline-none px-3 text-[14px]"
          />
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-[18px] font-bold text-black px-2">Topik Populer</h3>
          <div className="bg-white rounded-card overflow-hidden shadow-soft border border-black/5">
            <MenuListItem icon={<Icons.Wallet size={20} />} label="Cara membayar pesanan" href="#" showBorder />
            <MenuListItem icon={<Icons.Delivery size={20} />} label="Melacak posisi kartu" href="#" showBorder />
            <MenuListItem icon={<Icons.Review size={20} />} label="Kebijakan pengembalian dana" href="#" showBorder />
            <MenuListItem icon={<Icons.Store size={20} />} label="Panduan menjadi penjual" href="#" />
          </div>
        </div>

        <div className="mt-10 p-6 bg-primary/5 rounded-card border border-primary/10 flex flex-col items-center gap-4">
          <p className="text-[14px] font-medium text-black/60 text-center">Masih butuh bantuan?</p>
          <button className="h-[44px] px-8 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all">
            Chat Customer Service
          </button>
        </div>
      </main>
    </div>
  );
}
