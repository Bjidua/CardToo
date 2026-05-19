import React from "react";
import EditProductClient from "./EditProductClient";

/**
 * generateStaticParams
 * Fungsi build time Next.js untuk mem-generate halaman edit produk statis.
 * Menyediakan ID produk tiruan awal yang valid saat kompilasi.
 */
export function generateStaticParams() {
  return [
    { id: "1" }, 
    { id: "2" },
    { id: "3" }
  ];
}

/**
 * Halaman Edit Produk Berdasarkan ID Rute (EditProductPage)
 * Menerima params asinkron dari router Next.js dan merender komponen edit produk bersangkutan.
 */
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <EditProductClient id={resolvedParams.id} />;
}
