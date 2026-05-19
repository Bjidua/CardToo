"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OrderDetailClient from "@/app/seller/orders/[id]/OrderDetailClient";

/**
 * Komponen Konten Detail Pesanan Query (SellerOrderDetailPageContent)
 * Mengambil parameter query URL `orderId` untuk memuat rincian pesanan penjual.
 */
function SellerOrderDetailPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  return <OrderDetailClient id={orderId} />;
}

/**
 * Halaman Detail Pesanan Toko Query (SellerOrderDetailStaticPage)
 * Menggunakan React Suspense untuk membungkus useSearchParams saat build kompilasi static.
 */
export default function SellerOrderDetailStaticPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <SellerOrderDetailPageContent />
    </Suspense>
  );
}
