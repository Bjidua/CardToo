import React from "react";
import CategoryProductsClient from "./CategoryProductsClient";

// Kategori statis yang didukung aplikasi untuk kebutuhan static site generation (SSG)
const CATEGORIES = ["Pokemon", "Boboiboy", "Onepiece", "Digimon", "Yu-Gi-Oh!"];

/**
 * generateStaticParams
 * Fungsi wajib Next.js (App Router) untuk mem-generate halaman statis pada waktu build (output: 'export').
 * Membuat daftar parameter slug dalam bentuk huruf kecil.
 */
export function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.toLowerCase(),
  }));
}

/**
 * Halaman Kategori Produk TCG (CategoryProductsPage)
 * Menerima params slug secara asinkron dari Next.js router, lalu merender component client-side bersangkutan.
 */
export default async function CategoryProductsPage({ params }: { params: Promise<{ slug: string }> }) {
  // Menunggu parameter params diselesaikan (Next.js 15 requirement)
  const { slug } = await params;

  // Merender component client wrapper untuk interaktivitas dinamis
  return <CategoryProductsClient slug={slug} />;
}
