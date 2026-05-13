import React from "react";
import OrderDetailClient from "./OrderDetailClient";

export function generateStaticParams() {
  return [
    { id: "1" }, 
    { id: "2" },
    { id: "3" }
  ];
}

export default async function SellerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <OrderDetailClient id={resolvedParams.id} />;
}
