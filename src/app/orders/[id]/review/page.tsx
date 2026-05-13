import React from "react";
import ReviewClient from "./ReviewClient";

export function generateStaticParams() {
  return [
    { id: "ORD-001" }, 
    { id: "ORD-002" },
    { id: "ORD-003" },
    { id: "ORD-004" }
  ];
}

export default function OrderReviewPage({ params }: { params: { id: string } }) {
  return <ReviewClient id={params.id} />;
}
