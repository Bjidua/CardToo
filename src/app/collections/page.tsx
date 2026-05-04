"use client";

import React from "react";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { motion } from "framer-motion";
import Image from "next/image";
import { Icons } from "@/components/ui/Icons";
import { CategoryList } from "@/components/ui/CategoryList";
import { StickyHeader } from "@/components/layout/StickyHeader";

export default function CollectionsPage() {
  const dummyCollections = [
    { id: 1, title: "Pokemon VMAX", count: 124 },
    { id: 2, title: "Yu-Gi-Oh! Rare", count: 45 },
    { id: 3, title: "Magic: The Gathering", count: 89 },
    { id: 4, title: "Digimon Classic", count: 32 },
    { id: 5, title: "One Piece Card", count: 15 },
    { id: 6, title: "Basketball Cards", count: 210 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  } as const;

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-linear-to-b from-white to-[#F6DFFF] relative pb-40">

      {/* STICKY HEADER AREA */}
      <StickyHeader title="Collection" variant="logo" size="lg" />

      {/* Categories - Scrolled with content */}
      <div className="relative z-10 pt-6">
        <CategoryList />
      </div>

      {/* Collections Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 grid grid-cols-3 gap-x-3 gap-y-6 px-6 pt-6"
      >
        {dummyCollections.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <CollectionCard
              title={item.title}
              count={item.count}
            />
          </motion.div>
        ))}

        {/* Add New Collection Placeholder */}
        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.95 }}
          className="w-full aspect-4/5 rounded-card border-2 border-dashed border-accent/20 flex flex-col items-center justify-center gap-1.5 hover:border-primary/40 transition-colors bg-white/20"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icons.Plus size={20} className="text-primary" />
          </div>
          <span className="text-[11px] font-bold text-accent/40">New Folder</span>
        </motion.button>
      </motion.div>

    </main>
  );
}
