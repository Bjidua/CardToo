"use client";

import React from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { motion } from "framer-motion";

export default function PaymentsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-[#F6DFFF]">
      <StickyHeader
        title="Pembayaran"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-32">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-[14px] font-bold text-black/40 uppercase tracking-wider px-2">Rekening Bank</h3>
            <div className="p-6 bg-white rounded-card shadow-soft border border-black/5 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center text-black/10">
                <Icons.Wallet size={32} />
              </div>
              <p className="text-[14px] text-black/40">Belum ada rekening bank terdaftar.</p>
              <button className="text-primary font-bold text-[14px]">+ Tambah Rekening</button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[14px] font-bold text-black/40 uppercase tracking-wider px-2">Kartu Kredit / Debit</h3>
            <div className="p-6 bg-white rounded-card shadow-soft border border-black/5 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center text-black/10">
                <Icons.CreditCard size={32} />
              </div>
              <p className="text-[14px] text-black/40">Belum ada kartu terdaftar.</p>
              <button className="text-primary font-bold text-[14px]">+ Tambah Kartu</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
