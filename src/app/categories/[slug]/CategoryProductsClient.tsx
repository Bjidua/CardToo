"use client";

import React, { useMemo } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { ProductCard } from "@/components/ui/ProductCard";
import { motion } from "framer-motion";

const DUMMY_PRODUCTS = [
  { id: 1, title: "Pikachu VMAX", price: 1500000, condition: "Mint" as const, category: "Pokemon" },
  { id: 2, title: "Charizard GX", price: 2800000, condition: "Near Mint" as const, category: "Pokemon" },
  { id: 3, title: "Mewtwo EX", price: 950000, condition: "Excellent" as const, category: "Pokemon" },
  { id: 4, title: "Dragonite V", price: 1200000, condition: "Mint" as const, category: "Pokemon" },
  { id: 5, title: "Luffy Gear 5", price: 2100000, condition: "Mint" as const, category: "Onepiece" },
  { id: 6, title: "Boboiboy Supra", price: 850000, condition: "Excellent" as const, category: "Boboiboy" },
  { id: 7, title: "Digimon Wargreymon", price: 1750000, condition: "Mint" as const, category: "Digimon" },
  { id: 8, title: "Yu-Gi-Oh! Blue Eyes", price: 5000000, condition: "Near Mint" as const, category: "Yu-Gi-Oh!" },
];

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
    <div className="flex flex-col min-h-screen bg-linear-to-b from-[#F7F9FA] to-[#F6DFFF]">
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
