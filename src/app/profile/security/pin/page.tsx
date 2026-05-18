"use client";

import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";

export default function PinPage() {
  return (
    <ProtectedRoute>
      <PinContent />
    </ProtectedRoute>
  );
}

function PinContent() {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      <StickyHeader
        title="PIN CardToo"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-10 pb-32">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <Icons.Review size={40} />
          </div>
          <h2 className="text-[20px] font-bold text-text-main mb-2">
            Keamanan Transaksi
          </h2>
          <p className="text-[14px] text-text-sub leading-relaxed px-8">
            PIN khusus transaksi belum tersedia di versi project ini. Semua aksi
            pembelian saat ini masih diamankan lewat login akun dan status order.
          </p>
        </div>

        <div className="flex flex-col items-center gap-10">
          <div className="flex gap-3 opacity-60">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="w-12 h-14 bg-white border border-surface-muted rounded-card text-center text-[24px] font-bold shadow-soft flex items-center justify-center text-text-sub"
              >
                •
              </div>
            ))}
          </div>

          <div className="w-full flex flex-col gap-4 px-4">
            <Button disabled>Belum Tersedia</Button>
            <p className="text-center text-[13px] text-text-sub">
              Jika fitur PIN ditambahkan nanti, halaman ini akan menjadi tempat
              pengelolaannya.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
