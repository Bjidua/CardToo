import React from "react";
import ReviewClient from "./ReviewClient";

/**
 * generateStaticParams
 * Fungsi Next.js untuk mem-generate halaman statis rute dinamis pada waktu build.
 * Menyediakan ID order placeholder statis agar build statis (output: 'export') berhasil.
 */
export function generateStaticParams() {
  return [
    { id: "ORD-001" }, 
    { id: "ORD-002" },
    { id: "ORD-003" },
    { id: "ORD-004" }
  ];
}

/**
 * Halaman Review Pesanan Berdasarkan ID Rute (OrderReviewPage)
 * Merender component review client-side dengan parameter ID rute dinamis.
 */
export default function OrderReviewPage({ params }: { params: { id: string } }) {
  return <ReviewClient id={params.id} />;
}
