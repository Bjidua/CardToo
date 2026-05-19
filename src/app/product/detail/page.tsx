"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductDetailClient from "@/app/product/[id]/ProductDetailClient";

function ProductDetailQueryContent() {
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

  return <ProductDetailClient id={productId} />;
}

export default function ProductDetailQueryPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <ProductDetailQueryContent />
    </Suspense>
  );
}
