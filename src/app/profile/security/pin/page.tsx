"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { motion } from "framer-motion";

export default function PinPage() {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);

  const handleInput = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const newPin = [...pin];
    newPin[index] = val.slice(-1);
    setPin(newPin);
    
    // Auto focus next
    if (val && index < 5) {
      const next = document.getElementById(`pin-${index + 1}`);
      next?.focus();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-[#F6DFFF]">
      <StickyHeader
        title="PIN CardToo"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-10 pb-32">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <Icons.Review size={40} />
          </div>
          <h2 className="text-[20px] font-bold text-black mb-2">Keamanan Transaksi</h2>
          <p className="text-[14px] text-black/50 leading-relaxed px-8">
            PIN digunakan untuk memverifikasi pembayaran dan penarikan saldo kamu.
          </p>
        </div>

        <div className="flex flex-col items-center gap-10">
          <div className="flex gap-3">
            {pin.map((digit, i) => (
              <input
                key={i}
                id={`pin-${i}`}
                type="password"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleInput(e.target.value, i)}
                className="w-12 h-14 bg-white border border-black/5 rounded-card text-center text-[24px] font-bold shadow-soft focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                maxLength={1}
              />
            ))}
          </div>

          <div className="w-full flex flex-col gap-4 px-4">
            <Button>Simpan PIN</Button>
            <p className="text-center text-[13px] text-primary font-bold cursor-pointer hover:underline">
              Lupa PIN CardToo?
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
