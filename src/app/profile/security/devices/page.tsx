"use client";

import React from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { motion } from "framer-motion";

const DEVICES = [
  {
    id: "1",
    name: "Samsung Galaxy S24 Ultra",
    location: "Jakarta, Indonesia",
    time: "Sedang Aktif",
    isCurrent: true,
  },
  {
    id: "2",
    name: "MacBook Pro 14\"",
    location: "Bandung, Indonesia",
    time: "Aktif 2 jam yang lalu",
    isCurrent: false,
  },
];

export default function DevicesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      <StickyHeader
        title="Perangkat Terhubung"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-32">
        <div className="bg-primary/5 p-4 rounded-card border border-primary/10 mb-8">
          <p className="text-[13px] text-black/60 leading-relaxed">
            Ini adalah daftar perangkat yang saat ini masuk ke akun CardToo kamu. Segera keluar dari perangkat yang tidak kamu kenali.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {DEVICES.map((dev) => (
            <div key={dev.id} className="bg-white p-5 rounded-card shadow-soft border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-hover rounded-card flex items-center justify-center text-accent">
                  <Icons.Store size={24} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-black">{dev.name}</span>
                    {dev.isCurrent && (
                      <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded uppercase">Ini</span>
                    )}
                  </div>
                  <span className="text-[12px] text-black/40">{dev.location} • {dev.time}</span>
                </div>
              </div>
              {!dev.isCurrent && (
                <button className="text-[14px] font-bold text-danger">Logout</button>
              )}
            </div>
          ))}
        </div>

        <button className="w-full mt-10 py-4 text-danger font-bold border-2 border-danger/10 rounded-card active:scale-[0.98] transition-all">
          Logout dari Semua Perangkat
        </button>
      </main>
    </div>
  );
}
