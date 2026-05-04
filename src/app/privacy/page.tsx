"use client";

import React from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-[#F6DFFF]">
      <StickyHeader
        title="Kebijakan Privasi"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-32">
        <div className="bg-white rounded-card p-8 shadow-soft border border-black/5">
          <div className="prose prose-sm max-w-none text-black/70 leading-relaxed">
            <h2 className="text-[18px] font-bold text-black mb-4">1. Informasi yang Kami Kumpulkan</h2>
            <p className="mb-6">
              Kami mengumpulkan informasi yang Anda berikan langsung kepada kami saat mendaftar akun CardToo, termasuk nama, alamat email, dan informasi pembayaran.
            </p>

            <h2 className="text-[18px] font-bold text-black mb-4">2. Penggunaan Informasi</h2>
            <p className="mb-6">
              Informasi yang kami kumpulkan digunakan untuk memproses transaksi, mengelola akun Anda, dan memberikan dukungan pelanggan yang lebih baik.
            </p>

            <h2 className="text-[18px] font-bold text-black mb-4">3. Keamanan Data</h2>
            <p className="mb-6">
              CardToo menggunakan enkripsi standar industri untuk melindungi data sensitif Anda. Kami tidak akan pernah membagikan data Anda kepada pihak ketiga tanpa izin eksplisit.
            </p>

            <h2 className="text-[18px] font-bold text-black mb-4">4. Cookie</h2>
            <p className="mb-6">
              Kami menggunakan cookie untuk meningkatkan pengalaman navigasi Anda dan mengingat preferensi pengaturan aplikasi Anda.
            </p>

            <div className="mt-10 pt-6 border-t border-black/5 text-[12px] text-black/30">
              Terakhir diperbarui: 5 Mei 2026
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
