"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TrackClient from "@/app/orders/[id]/track/TrackClient";

/**
 * Komponen Konten Pelacakan Pesanan Halaman (TrackPageContent)
 * Mengambil parameter query URL `orderId` untuk merender component TrackClient.
 */
function TrackPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  return <TrackClient id={orderId} />;
}

/**
 * Halaman Pelacakan Pesanan Statis Rute (OrderTrackStaticPage)
 * Menggunakan React Suspense untuk membungkus useSearchParams saat eksekusi build Next.js.
 */
export default function OrderTrackStaticPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <TrackPageContent />
    </Suspense>
  );
}
