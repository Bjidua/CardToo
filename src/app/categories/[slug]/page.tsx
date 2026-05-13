import React from "react";
import CategoryProductsClient from "./CategoryProductsClient";

const CATEGORIES = ["Pokemon", "Boboiboy", "Onepiece", "Digimon", "Yu-Gi-Oh!"];

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.toLowerCase(),
  }));
}

export default async function CategoryProductsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <CategoryProductsClient slug={slug} />;
}
