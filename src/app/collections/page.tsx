"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { motion } from "framer-motion";
import Image from "next/image";
import { Icons } from "@/components/ui/Icons";
import { CategoryList } from "@/components/ui/CategoryList";

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
    <main className="flex-1 flex flex-col min-h-screen bg-linear-to-b from-white to-[#E0F7FA] relative pb-40">
      
      {/* Background Decorative Element */}
      <div className="fixed inset-0 bg-linear-to-b from-white to-[#E0F7FA] z-0 pointer-events-none" />

      {/* STICKY HEADER AREA */}
      <div className="sticky top-0 z-40 w-full h-[140px] flex items-end justify-center pb-4 overflow-hidden">
        {/* Background Accent Logo inside Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-[-45%] left-[-12%] w-[110%] h-[150%] pointer-events-none z-0"
        >
          <Image 
            src="/assets/BackgroundLogo.svg" 
            alt="Header Background" 
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Premium Blur Background */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md border-b border-black/5 pointer-events-none z-[-1]" />
        
        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative z-10 text-[24px] font-bold text-black tracking-tight"
        >
          My Collections
        </motion.h1>
      </div>

      {/* Categories - Scrolled with content */}
      <div className="relative z-10 pt-6">
        <CategoryList />
      </div>

      {/* Collections Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-6 px-6 pt-6 justify-items-center"
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
          className="w-[172px] h-[220px] rounded-card border-2 border-dashed border-accent/20 flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors bg-white/20"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icons.Plus size={24} className="text-primary" />
          </div>
          <span className="text-[14px] font-bold text-accent/40">New Folder</span>
        </motion.button>
      </motion.div>

    </main>
  );
}
