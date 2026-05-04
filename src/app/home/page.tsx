"use client";

import React from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { ProfilePicture } from "@/components/ui/ProfilePicture";
import { Icons } from "@/components/ui/Icons";
import { CategoryList } from "@/components/ui/CategoryList";
import { ProductCard } from "@/components/ui/ProductCard";
import { SlideCard } from "@/components/ui/SlideCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  
  const [selectedCategory, setSelectedCategory] = React.useState(categoryParam);
  const [wishlistedIds, setWishlistedIds] = React.useState<number[]>([1, 4]);

  // Update selectedCategory if param changes
  React.useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const dummyProducts = [
    { id: 1, title: "Pikachu VMAX", price: 1500000, condition: "Mint" as const, category: "Pokemon" },
    { id: 2, title: "Charizard GX", price: 2800000, condition: "Near Mint" as const, category: "Pokemon" },
    { id: 3, title: "Mewtwo EX", price: 950000, condition: "Excellent" as const, category: "Pokemon" },
    { id: 4, title: "Dragonite V", price: 1200000, condition: "Mint" as const, category: "Pokemon" },
    { id: 5, title: "Luffy Gear 5", price: 2100000, condition: "Mint" as const, category: "Onepiece" },
    { id: 6, title: "Boboiboy Supra", price: 850000, condition: "Excellent" as const, category: "Boboiboy" },
  ];

  const filteredProducts = React.useMemo(() => {
    if (selectedCategory === "All") return dummyProducts;
    return dummyProducts.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const toggleWishlist = (id: number) => {
    setWishlistedIds(prev => 
      prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  } as const;

  // Animation Variants

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
      {/* Header - Consistent with other pages */}
      <StickyHeader 
        title="Home" 
        variant="logo"
        size="lg"
        leftAction={<ProfilePicture size={64} className="border-[3px] border-white shadow-lg ml-1" />}
        rightAction={
          <div className="flex items-center gap-3 mr-1">
            <Link href="/notifications">
              <button className="relative p-1 hover:opacity-70 transition-opacity active:scale-90">
                <Icons.Notification size={32} className="text-accent" />
              </button>
            </Link>
            <Link href="/cart">
              <button className="p-1 hover:opacity-70 transition-opacity active:scale-90">
                <Icons.Cart size={32} className="text-accent" />
              </button>
            </Link>
          </div>
        }
      />

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
      <section className="pt-8">
        <CategoryList 
          onSelect={setSelectedCategory} 
          activeCategory={selectedCategory} 
        />
      </section>

      <section className="px-6 pt-6">
        <motion.div 
          key={selectedCategory}
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
                isWishlisted={wishlistedIds.includes(product.id)}
                onWishlistToggle={() => toggleWishlist(product.id)}
              />
            </motion.div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-2 py-10 text-center text-black/40">
              Belum ada produk di kategori ini.
            </div>
          )}
        </motion.div>
      </section>
    </main>
  );
}

export default function HomePage() {
  return (
    <React.Suspense fallback={<main className="flex-1 flex flex-col bg-background relative pb-40"></main>}>
      <HomeContent />
    </React.Suspense>
  );
}
