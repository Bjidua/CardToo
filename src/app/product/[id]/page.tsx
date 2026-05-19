import React from "react";
import ProductDetailClient from "./ProductDetailClient";

/**
 * generateStaticParams
 * Fungsi Next.js untuk mem-generate halaman statis rute dinamis pada waktu build.
 * Menyediakan ID produk placeholder statis agar build statis (output: 'export') berhasil.
 */
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }, { id: "6" }, { id: "7" }, { id: "8" }];
}

/**
 * Halaman Detail Produk Berdasarkan ID Rute (ProductDetailPage)
 * Menerima params asinkron dari router Next.js, lalu merender component detail client-side bersangkutan.
 */
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ProductDetailClient id={id} />;
}
