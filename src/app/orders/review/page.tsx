"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReviewClient from "@/app/orders/[id]/review/ReviewClient";

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  return <ReviewClient id={orderId} />;
}

export default function OrderReviewStaticPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <ReviewPageContent />
    </Suspense>
  );
}
