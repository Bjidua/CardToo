"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { ProductCard } from "@/components/ui/ProductCard";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { normalizeProductCategory, productService } from "@/lib/services/product";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";

interface CategoryProductsClientProps {
  slug: string;
}

export default function CategoryProductsClient({ slug }: CategoryProductsClientProps) {
  const router = useRouter();
  const { isGuest, user } = useAuth();
  const categoryName = decodeURIComponent(slug);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { isFavorite, toggleFavorite } = useFavorites(user?.id);

  React.useEffect(() => {
    const loadProducts = async () => {
      const normalizedCategory = normalizeProductCategory(categoryName);

      try {
        setIsLoading(true);
        const nextProducts = normalizedCategory
          ? await productService.listPublishedProducts({ category: normalizedCategory })
          : [];
        setProducts(nextProducts);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, [categoryName]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => product.category?.toLowerCase() === categoryName.toLowerCase()
    );
  }, [categoryName, products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      <StickyHeader
        title={categoryName}
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredProducts.length > 0 ? (
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
                  href={`/product/${product.id}`}
                  isWishlisted={isFavorite(product.id)}
                  onWishlistToggle={() => {
                    if (isGuest || !user) {
                      router.push("/login");
                      return;
                    }
                    void toggleFavorite(product.id);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[16px] text-text-sub">
              Belum ada produk untuk kategori {`"`}{categoryName}{`"`}.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
