import React from "react";
import StoreProfileClient from "./StoreProfileClient";

/**
 * generateStaticParams
 * Fungsi build time Next.js untuk mem-generate halaman detail toko statis.
 * Menyediakan daftar ID toko placeholder yang valid saat build kompilasi.
 */
export function generateStaticParams() {
  return [
    { id: "pokemon-store" }, 
    { id: "tcg-master" },
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" }
  ];
}

/**
 * Halaman Detail Toko Berdasarkan ID Rute (StoreProfilePage)
 * Menerima params asinkron dari router Next.js dan merender komponen profil toko client-side bersangkutan.
 */
export default async function StoreProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <StoreProfileClient id={resolvedParams.id} />;
}
