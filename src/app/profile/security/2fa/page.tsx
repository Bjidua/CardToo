"use client";

import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";

/**
 * Halaman Pengaturan Keamanan 2FA (TwoFactorPage)
 * Dibungkus dengan ProtectedRoute untuk proteksi sesi login user.
 */
export default function TwoFactorPage() {
  return (
    <ProtectedRoute>
      <TwoFactorContent />
    </ProtectedRoute>
  );
}

/**
 * Komponen Konten Keamanan 2FA (TwoFactorContent)
 * Menampilkan status fitur keamanan dua langkah yang akan datang (Coming Soon).
 */
function TwoFactorContent() {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      {/* Header Halaman */}
      <StickyHeader
        title="Verifikasi 2 Langkah"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-10 pb-32">
        {/* Banner Fitur Belum Tersedia */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <Icons.Plus size={40} />
          </div>
          <h2 className="text-[20px] font-bold text-text-main mb-2">
            Keamanan Ekstra Akunmu
          </h2>
          <p className="text-[14px] text-text-sub leading-relaxed px-4">
            Fitur verifikasi dua langkah belum tersedia di versi project saat ini.
            Password dan sesi Appwrite tetap menjadi lapisan keamanan utama akunmu.
          </p>
        </div>

        {/* Informasi Status Fitur */}
        <div className="bg-white rounded-card p-6 shadow-soft border border-surface-muted flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-[16px] font-bold text-text-main">Status 2FA</h3>
            <p className="text-[13px] text-text-sub">Belum tersedia</p>
          </div>
          <span className="rounded-full bg-surface-tint px-4 py-2 text-[12px] font-bold text-text-sub">
            Coming Soon
          </span>
        </div>

        {/* Rencana implementasi masa depan */}
        <div className="mt-10">
          <h3 className="text-[14px] font-bold text-text-sub uppercase tracking-wider mb-4 px-2">
            Rencana Verifikasi
          </h3>
          <div className="flex flex-col gap-4">
            <MethodItem
              icon={<Icons.Message size={20} />}
              label="SMS / OTP"
              sub="Akan dipertimbangkan untuk fase keamanan berikutnya."
            />
            <MethodItem
              icon={<Icons.Search size={20} />}
              label="Aplikasi Autentikator"
              sub="Belum diintegrasikan pada backend Appwrite project ini."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Item Rencana Metode Autentikasi (MethodItem)
 */
function MethodItem({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div className="bg-white rounded-card p-5 shadow-soft border border-surface-muted flex items-center justify-between transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-card bg-surface-hover flex items-center justify-center text-accent">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-bold text-text-main">{label}</span>
          <span className="text-[12px] text-text-sub">{sub}</span>
        </div>
      </div>
      <span className="text-[12px] font-bold text-text-sub">N/A</span>
    </div>
  );
}
