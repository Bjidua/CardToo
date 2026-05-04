"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { CategoryList } from "@/components/ui/CategoryList";
import { ProductCard } from "@/components/ui/ProductCard";
import { SlideCard } from "@/components/ui/SlideCard";
import { motion } from "framer-motion";

export default function HomePage() {
  const dummyProducts = [
    { id: 1, title: "Pikachu VMAX", price: 1500000, condition: "Mint" as const, isWishlisted: true, image: "/assets/products/pika.jpg" },
    { id: 2, title: "Charizard GX", price: 2800000, condition: "Near Mint" as const, isWishlisted: false },
    { id: 3, title: "Mewtwo EX", price: 950000, condition: "Excellent" as const, isWishlisted: false },
    { id: 4, title: "Dragonite V", price: 1200000, condition: "Mint" as const, isWishlisted: true },
    { id: 5, title: "Lugia Legend", price: 4500000, condition: "Near Mint" as const, isWishlisted: false },
    { id: 6, title: "Rayquaza Star", price: 8900000, condition: "Mint" as const, isWishlisted: true },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28
      }
    }
  } as const;

  const fadeInVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  } as const;

  return (
    <main className="flex-1 flex flex-col bg-background relative pb-40">
      {/* Header - Fixed internally */}
      <Header />

      {/* Hero / Banner Section */}
      <motion.section 
        initial="hidden"
        animate="show"
        variants={fadeInVariants}
        className="px-6 flex justify-center pt-4"
      >
        <SlideCard 
          title="Promotion Card" 
          description="Promo spesial minggu ini untuk koleksi TCG!"
        />
      </motion.section>

      {/* Category Section */}
      <motion.section 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="pt-8"
      >
        <CategoryList />
      </motion.section>

      {/* Catalog Grid Section */}
      <section className="px-6 pt-8">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={fadeInVariants}
          className="flex justify-between items-end mb-6"
        >
          <h2 className="text-[22px] font-bold text-black tracking-tight leading-none">
            Catalog Product
          </h2>
          <button className="text-primary text-[14px] font-semibold hover:opacity-70 transition-opacity">
            See All
          </button>
        </motion.div>

        {/* Product Cards Grid with Staggered Animation */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center"
        >
          {dummyProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants} className="w-full flex justify-center">
              <ProductCard
                title={product.title}
                price={product.price}
                condition={product.condition}
                isWishlisted={product.isWishlisted}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
