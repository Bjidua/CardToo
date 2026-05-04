import React from "react";
import CategoryProductsClient from "./CategoryProductsClient";

const CATEGORIES = ["Pokemon", "Boboiboy", "Onepiece", "Digimon", "Yu-Gi-Oh!"];

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.toLowerCase(),
  }));
}

export default function CategoryProductsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return <CategoryProductsClient slug={slug} />;
}
