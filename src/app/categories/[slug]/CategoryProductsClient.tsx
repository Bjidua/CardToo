"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { ProductCard } from "@/components/ui/ProductCard";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { normalizeProductCategory, productService } from "@/lib/services/product";
import { buildProductDetailHref } from "@/lib/routes";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";

interface CategoryProductsClientProps {
  /** Slug nama kategori (dari dinamis route parameter) */
  slug: string;
}

/**
 * Komponen Client Kategori Produk (CategoryProductsClient)
 * Menarik list produk dari database Appwrite berdasarkan kategori tertentu,
 * mengelola visual wishlist (favorite), dan melakukan render grid kartu produk.
 */
export default function CategoryProductsClient({ slug }: CategoryProductsClientProps) {
  // Instance router Next.js untuk perpindahan halaman
  const router = useRouter();

  // Status autentikasi user aktif
  const { isGuest, user } = useAuth();

  // Dekode nama kategori dari URL slug agar ramah karakter spasi/spesial
  const categoryName = decodeURIComponent(slug);

  // State penyimpan daftar produk TCG
  const [products, setProducts] = React.useState<Product[]>([]);

  // State memuat loading awal
  const [isLoading, setIsLoading] = React.useState(true);

  // Custom hook untuk sinkronisasi state list wishlist favorit user
  const { isFavorite, toggleFavorite } = useFavorites(user?.id);

  /**
   * Effect Hook untuk memuat daftar produk berdasarkan nama kategori terpilih.
   * Dijalankan ketika nilai parameter categoryName berubah.
   */
  React.useEffect(() => {
    const loadProducts = async () => {
      // Menormalisasi penulisan nama kategori agar cocok dengan skema database
      const normalizedCategory = normalizeProductCategory(categoryName);

      try {
        setIsLoading(true); // Aktifkan spinner memuat
        // Panggil service penarik produk berdasarkan filter kategori terdaftar
        const nextProducts = normalizedCategory
          ? await productService.listPublishedProducts({ category: normalizedCategory })
          : [];
        setProducts(nextProducts);
      } finally {
        setIsLoading(false); // Matikan spinner memuat
      }
    };

    void loadProducts();
  }, [categoryName]);

  /**
   * Saring produk lebih lanjut (case-insensitive filter) untuk menjamin kesesuaian kategori.
   * Menggunakan useMemo agar proses penyaringan hemat resource.
   */
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => product.category?.toLowerCase() === categoryName.toLowerCase()
    );
  }, [categoryName, products]);

  // Varian transisi kontainer kartu produk (stagger animation)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  // Varian transisi kemunculan kartu produk individual
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      {/* Header Halaman dengan judul kategori aktif */}
      <StickyHeader
        title={categoryName}
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-20">
        {/* Render spinner loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredProducts.length > 0 ? (
          /* Render grid produk jika ada data */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants} className="w-full flex justify-center">
                <ProductCard
                  title={product.title}
                  price={product.price}
                  condition={product.condition}
                  image={product.image || undefined}
                  href={buildProductDetailHref(product.id)}
                  isWishlisted={isFavorite(product.id)}
                  onWishlistToggle={() => {
                    // Proteksi login tamu (guest)
                    if (isGuest || !user) {
                      router.push("/login");
                      return;
                    }
                    // Jalankan switch status favorit
                    void toggleFavorite(product.id);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Tampilan kosong (Empty State) */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[16px] text-text-sub font-medium">
              Belum ada produk untuk kategori {`"`}{categoryName}{`"`}.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
