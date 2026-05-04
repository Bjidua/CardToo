"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TwoFactorPage() {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-[#F6DFFF]">
      <StickyHeader
        title="Verifikasi 2 Langkah"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-10 pb-32">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <Icons.Plus size={40} />
          </div>
          <h2 className="text-[20px] font-bold text-black mb-2">Keamanan Ekstra Akunmu</h2>
          <p className="text-[14px] text-black/50 leading-relaxed px-4">
            Tambahkan lapisan keamanan ekstra agar akunmu tidak bisa diakses orang lain meskipun mereka tahu password-mu.
          </p>
        </div>

        <div className="bg-white rounded-card p-6 shadow-soft border border-black/5 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-[16px] font-bold text-black">Status 2FA</h3>
            <p className="text-[13px] text-black/40">{isEnabled ? "Sedang Aktif" : "Nonaktif"}</p>
          </div>
          <button 
            onClick={() => setIsEnabled(!isEnabled)}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              isEnabled ? "bg-primary" : "bg-black/10"
            )}
          >
            <motion.div 
              animate={{ x: isEnabled ? 26 : 4 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>

        <div className="mt-10">
          <h3 className="text-[14px] font-bold text-black/40 uppercase tracking-wider mb-4 px-2">Metode Verifikasi</h3>
          <div className="flex flex-col gap-4">
            <MethodItem 
              icon={<Icons.Message size={20} />} 
              label="SMS (OTP)" 
              sub="0812****789" 
              active 
            />
            <MethodItem 
              icon={<Icons.Search size={20} />} 
              label="Aplikasi Autentikator" 
              sub="Google Authenticator, Microsoft, dll" 
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function MethodItem({ icon, label, sub, active = false }: { icon: React.ReactNode; label: string; sub: string; active?: boolean }) {
  return (
    <div className="bg-white rounded-card p-5 shadow-soft border border-black/5 flex items-center justify-between group active:scale-[0.98] transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-card bg-surface-hover flex items-center justify-center text-accent">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-bold text-black">{label}</span>
          <span className="text-[12px] text-black/40">{sub}</span>
        </div>
      </div>
      {active ? (
        <span className="text-[12px] font-bold text-primary">AKTIF</span>
      ) : (
        <Icons.ChevronRight size={18} className="text-black/20" />
      )}
    </div>
  );
}
