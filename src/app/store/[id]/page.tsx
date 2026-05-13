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

export default function StoreProfilePage({ params }: { params: { id: string } }) {
  return <StoreProfileClient id={params.id} />;
}
