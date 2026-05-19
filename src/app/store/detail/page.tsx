"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StoreProfileClient from "@/app/store/[id]/StoreProfileClient";

function StoreDetailQueryContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");

  if (!storeId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-tint px-6 text-center">
        <p className="text-[14px] font-bold text-text-main">
          Toko tidak ditemukan.
        </p>
      </div>
    );
  }

  return <StoreProfileClient id={storeId} />;
}

export default function StoreDetailQueryPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <StoreDetailQueryContent />
    </Suspense>
  );
}
