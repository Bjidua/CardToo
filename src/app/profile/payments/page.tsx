"use client";

import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";

// Kalimat visual untuk info metode pembayaran kosong
const EMPTY_COPY = "Belum ada metode pembayaran tersimpan untuk akun ini.";

/**
 * Halaman Metode Pembayaran Akun (PaymentsPage)
 * Dibungkus ProtectedRoute agar hanya bisa diakses oleh pengguna terotentikasi.
 */
export default function PaymentsPage() {
  return (
    <ProtectedRoute>
      <PaymentsContent />
    </ProtectedRoute>
  );
}

/**
 * Komponen Konten Metode Pembayaran (PaymentsContent)
 * Menampilkan placeholder statis informasi metode pembayaran.
 * Menu ini sementara waktu bersifat read-only karena data bank belum disimpan di database Appwrite.
 */
function PaymentsContent() {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      {/* Header Halaman atas */}
      <StickyHeader
        title="Pembayaran"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-32">
        {/* Kontainer Utama */}
        <div className="flex flex-col gap-6">
          <PaymentSection title="Rekening Bank" description={EMPTY_COPY} />
          <PaymentSection title="Kartu Kredit / Debit" description={EMPTY_COPY} />
        </div>

        {/* Teks Penjelas Scope Fitur */}
        <p className="mt-6 px-4 text-center text-[13px] text-text-sub leading-relaxed">
          Halaman ini masih bersifat informasi. Penyimpanan metode pembayaran
          pribadi belum masuk ke scope backend Appwrite v1 project CardToo.
        </p>
      </main>
    </div>
  );
}

/**
 * Komponen Seksi Metode Pembayaran Individual (PaymentSection)
 */
function PaymentSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[14px] font-bold text-text-sub uppercase tracking-wider px-2">
        {title}
      </h3>
      <div className="p-6 bg-white rounded-card shadow-soft border border-surface-muted flex flex-col items-center justify-center text-center gap-3">
        <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center text-text-sub/30">
          <Icons.Wallet size={32} />
        </div>
        <p className="text-[14px] text-text-sub">{description}</p>
        <span className="text-[13px] font-bold text-primary">Read Only</span>
      </div>
    </div>
  );
}
