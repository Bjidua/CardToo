"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OrderDetailClient from "@/app/seller/orders/[id]/OrderDetailClient";

function SellerOrderDetailPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  return <OrderDetailClient id={orderId} />;
}

export default function SellerOrderDetailStaticPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <SellerOrderDetailPageContent />
    </Suspense>
  );
}
