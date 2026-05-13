"use client";

import React from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const TRACKING_STEPS = [
  { id: 1, title: "Pesanan Dibuat", time: "12 Mei, 10:30", status: "completed", icon: <Icons.Collection size={20} /> },
  { id: 2, title: "Pembayaran Dikonfirmasi", time: "12 Mei, 10:35", status: "completed", icon: <Icons.Wallet size={20} /> },
  { id: 3, title: "Pesanan Sedang Dikemas", time: "12 Mei, 14:20", status: "completed", icon: <Icons.Dikemas size={20} /> },
  { id: 4, title: "Diserahkan ke Kurir (JNE)", time: "13 Mei, 09:00", status: "current", icon: <Icons.Delivery size={20} /> },
  { id: 5, title: "Pesanan Sampai di Tujuan", time: "-", status: "upcoming", icon: <Icons.Home size={20} /> },
];

export default function TrackClient({ id }: { id: string }) {
  return (
    <div className="flex flex-col min-h-screen bg-surface-tint">
      <StickyHeader
        title="Lacak Pesanan"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="px-6 pt-8 pb-32 flex flex-col gap-8">
        {/* Package Summary */}
        <section className="bg-white p-6 rounded-[32px] border border-surface-muted shadow-soft flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Icons.Delivery size={32} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold text-text-sub uppercase tracking-widest">Resi Pengiriman</span>
            <span className="text-[16px] font-black text-text-main">JNE-882910293881</span>
          </div>
        </section>

        {/* Tracking Timeline */}
        <section className="flex flex-col gap-6 pl-4">
          {TRACKING_STEPS.map((step, index) => (
            <div key={step.id} className="relative flex gap-6">
              {/* Line */}
              {index !== TRACKING_STEPS.length - 1 && (
                <div className={cn(
                  "absolute left-[20px] top-[40px] w-0.5 h-[calc(100%+24px)]",
                  step.status === "completed" ? "bg-primary" : "bg-surface-muted"
                )} />
              )}

              {/* Icon / Dot */}
              <div className={cn(
                "relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm",
                step.status === "completed" && "bg-primary text-white",
                step.status === "current" && "bg-accent text-white scale-110 ring-4 ring-accent/20",
                step.status === "upcoming" && "bg-surface-muted text-text-sub/40"
              )}>
                {step.icon}
              </div>

              {/* Text */}
              <div className="flex flex-col gap-1 pb-10">
                <h3 className={cn(
                  "text-[15px] font-black",
                  step.status === "upcoming" ? "text-text-sub/40" : "text-text-main"
                )}>
                  {step.title}
                </h3>
                <span className="text-[12px] text-text-sub font-medium">{step.time}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Support Banner */}
        <section className="mt-4 bg-primary/5 p-6 rounded-[32px] border border-primary/10 flex flex-col items-center text-center gap-3">
          <Icons.Message size={24} className="text-primary" />
          <p className="text-[13px] font-bold text-text-main">Ada kendala dengan pengiriman?</p>
          <button className="text-[12px] font-black text-primary uppercase tracking-widest bg-white px-6 py-2 rounded-full shadow-soft">
            Hubungi Kurir
          </button>
        </section>
      </main>
    </div>
  );
}
