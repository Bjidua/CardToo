"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EditProductClient from "@/app/seller/products/edit/[id]/EditProductClient";

function SellerEditProductQueryContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  if (!productId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-tint px-6 text-center">
        <p className="text-[14px] font-bold text-text-main">
          Produk tidak ditemukan.
        </p>
      </div>
    );
  }

  return <EditProductClient id={productId} />;
}

export default function SellerEditProductQueryPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <SellerEditProductQueryContent />
    </Suspense>
  );
}
