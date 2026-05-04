"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CategoryListProps {
  categories?: string[];
  onSelect?: (category: string) => void;
  className?: string;
}

export const CategoryList = ({
  categories = ["All", "Pokemon", "Boboiboy", "Onepiece", "Digimon", "Yu-Gi-Oh!"],
  onSelect,
  className,
}: CategoryListProps) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const handleSelect = (category: string) => {
    setActiveCategory(category);
    if (onSelect) onSelect(category);
  };

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      {/* Header Section */}
      <div className="flex items-center justify-between px-6">
        <h2 className="text-[20px] font-bold text-black tracking-tight">
          Categories
        </h2>
        <button className="text-[14px] font-bold text-[#4CB6C4] hover:opacity-70 transition-opacity active:scale-95">
          See All
        </button>
      </div>

      {/* Categories Scrollable Area */}
      <div className="w-full overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center gap-3 px-6 min-w-max">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(category)}
              className={cn(
                "relative px-6 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 select-none",
                activeCategory === category
                  ? "bg-white text-black shadow-[0px_4px_8px_rgba(0,0,0,0.12)]"
                  : "bg-transparent text-black/40 hover:text-black/60"
              )}
            >
              {/* Shared Layout Animation for active background could be added here, 
                  but simple shadow toggle matches the clean look */}
              {category}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
