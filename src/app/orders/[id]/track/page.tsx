import React from "react";
import TrackClient from "./TrackClient";

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
    { id: "ORD-004" },
    { id: "ORD-005" }
  ];
}

/**
 * Halaman Pelacakan Transaksi Pesanan Berdasarkan ID Rute (OrderTrackingPage)
 * Merender component pelacakan pengiriman client-side dengan parameter ID rute dinamis.
 */
export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  return <TrackClient id={params.id} />;
}
