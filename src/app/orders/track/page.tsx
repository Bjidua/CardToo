"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TrackClient from "@/app/orders/[id]/track/TrackClient";

function TrackPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  return <TrackClient id={orderId} />;
}

export default function OrderTrackStaticPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <TrackPageContent />
    </Suspense>
  );
}
