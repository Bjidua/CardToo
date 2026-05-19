"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StoreProfileClient from "@/app/store/[id]/StoreProfileClient";

/**
 * Komponen Konten Detail Toko Query (StoreDetailQueryContent)
 * Membaca parameter query URL `storeId` untuk menampilkan halaman StoreProfileClient.
 * Jika `storeId` tidak disertakan di URL, menampilkan pesan toko tidak ditemukan.
 */
function StoreDetailQueryContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");

  if (!storeId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-tint px-6 text-center">
        <p className="text-[14px] font-bold text-text-main">
          Toko tidak ditemukan.
        </p>
      </div>
    );
  }

  return <StoreProfileClient id={storeId} />;
}

/**
 * Halaman Detail Toko Query (StoreDetailQueryPage)
 * Menggunakan React Suspense untuk membungkus useSearchParams saat build static export.
 */
export default function StoreDetailQueryPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <StoreDetailQueryContent />
    </Suspense>
  );
}
