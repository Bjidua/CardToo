"use client";

import React, { useMemo } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { ProductCard } from "@/components/ui/ProductCard";
import { motion } from "framer-motion";

interface CategoryProduct {
  id: number;
  title: string;
  price: number;
  condition: "Mint" | "Near Mint" | "Excellent" | "Good" | "Played" | undefined;
  category: string;
}

const DUMMY_PRODUCTS: CategoryProduct[] = [];

interface CategoryProductsClientProps {
  slug: string;
}

export default function CategoryProductsClient({ slug }: CategoryProductsClientProps) {
  const categoryName = decodeURIComponent(slug);

  const filteredProducts = useMemo(() => {
    return DUMMY_PRODUCTS.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
  }, [categoryName]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      <StickyHeader
        title={categoryName}
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-20">
        {filteredProducts.length > 0 ? (
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
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-black/40 text-[16px]">
              Belum ada produk untuk kategori "{categoryName}".
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
