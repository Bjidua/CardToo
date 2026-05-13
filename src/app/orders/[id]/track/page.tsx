import React from "react";
import TrackClient from "./TrackClient";

export function generateStaticParams() {
  return [
    { id: "ORD-001" }, 
    { id: "ORD-002" },
    { id: "ORD-003" },
    { id: "ORD-004" },
    { id: "ORD-005" }
  ];
}

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  return <TrackClient id={params.id} />;
}
