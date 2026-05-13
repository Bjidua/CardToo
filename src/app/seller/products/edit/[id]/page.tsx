import React from "react";
import EditProductClient from "./EditProductClient";

export function generateStaticParams() {
  return [
    { id: "1" }, 
    { id: "2" },
    { id: "3" }
  ];
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <EditProductClient id={resolvedParams.id} />;
}
