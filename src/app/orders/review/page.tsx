"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReviewClient from "@/app/orders/[id]/review/ReviewClient";

/**
 * Komponen Konten Review Halaman (ReviewPageContent)
 * Mengambil parameter query URL `orderId` untuk merender component ReviewClient.
 */
function ReviewPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  return <ReviewClient id={orderId} />;
}

/**
 * Halaman Review Pesanan Statis Rute (OrderReviewStaticPage)
 * Menggunakan React Suspense untuk membungkus useSearchParams saat eksekusi build Next.js.
 */
export default function OrderReviewStaticPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <ReviewPageContent />
    </Suspense>
  );
}
