"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface CategoryListProps {
  categories?: string[];
  activeCategory?: string;
  onSelect?: (category: string) => void;
  className?: string;
}

export const CategoryList = ({
  categories = ["All", "Pokemon", "Boboiboy", "Onepiece", "Digimon", "Yu-Gi-Oh!"],
  activeCategory: externalActiveCategory,
  onSelect,
  className,
}: CategoryListProps) => {
  const router = useRouter();
  const [internalActiveCategory, setInternalActiveCategory] = useState("All");
  
  const activeCategory = externalActiveCategory || internalActiveCategory;

  const handleSelect = (category: string) => {
    setInternalActiveCategory(category);
    if (onSelect) {
      onSelect(category);
    } else if (category !== "All") {
      router.push(`/categories/${category.toLowerCase()}`);
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      {/* Header Section */}
      <div className="flex items-center justify-between px-6">
        <h2 className="text-[20px] font-bold text-black tracking-tight">
          Categories
        </h2>
        <Link href="/categories">
          <button className="text-[14px] font-bold text-primary hover:opacity-70 transition-opacity active:scale-95">
            See All
          </button>
        </Link>
      </div>

      {/* Categories Scrollable Area */}
      <div className="w-full overflow-x-scroll scrollbar-hide pb-2 touch-pan-x relative z-10">
        <div className="flex items-center gap-2 px-6 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleSelect(category)}
              className={cn(
                "whitespace-nowrap flex-shrink-0 relative px-6 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 select-none",
                activeCategory === category
                  ? "bg-white text-black shadow-medium"
                  : "bg-transparent text-black/40 hover:text-black/60"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
