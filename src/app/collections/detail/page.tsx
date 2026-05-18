"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import CollectionDetailClient from "@/components/collections/CollectionDetailClient";

function CollectionDetailContent() {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collectionId");

  if (!collectionId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-tint px-6 text-center">
        <p className="text-[14px] font-bold text-text-main">
          Koleksi tidak ditemukan.
        </p>
      </div>
    );
  }

  return <CollectionDetailClient id={collectionId} />;
}

export default function CollectionDetailQueryPage() {
  return (
    <React.Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <CollectionDetailContent />
    </React.Suspense>
  );
}
