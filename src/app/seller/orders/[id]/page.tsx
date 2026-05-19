import React from "react";
import OrderDetailClient from "./OrderDetailClient";

/**
 * generateStaticParams
 * Fungsi build time Next.js untuk mem-generate halaman rincian pesanan statis.
 * Menyediakan ID order tiruan awal yang valid saat kompilasi.
 */
export function generateStaticParams() {
  return [
    { id: "1" }, 
    { id: "2" },
    { id: "3" }
  ];
}

/**
 * Halaman Detail Pesanan Toko Berdasarkan ID Rute (SellerOrderDetailPage)
 * Menerima params asinkron dari router Next.js dan merender komponen detail pesanan bersangkutan.
 */
export default async function SellerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <OrderDetailClient id={resolvedParams.id} />;
}
