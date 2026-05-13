import React from "react";
import StoreProfileClient from "./StoreProfileClient";

export function generateStaticParams() {
  return [
    { id: "pokemon-store" }, 
    { id: "tcg-master" },
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" }
  ];
}

export default async function StoreProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <StoreProfileClient id={resolvedParams.id} />;
}
