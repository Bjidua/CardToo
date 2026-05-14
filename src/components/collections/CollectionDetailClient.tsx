"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { ProductCard } from "@/components/ui/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface CardItem {
  id: string;
  title: string;
  price: number;
  condition: "Mint" | "Near Mint" | "Excellent" | "Good";
  image?: string;
}

interface CollectionDetailClientProps {
  id: string;
  initialTitle: string;
}

export default function CollectionDetailClient({ id, initialTitle }: CollectionDetailClientProps) {
  const [cards, setCards] = useState<CardItem[]>([
    { id: "c1", title: "Charizard VMAX - Darkness Ablaze", price: 1500000, condition: "Mint" },
    { id: "c2", title: "Pikachu VMAX - Vivid Voltage", price: 3200000, condition: "Near Mint" },
    { id: "c3", title: "Lugia V - Silver Tempest", price: 850000, condition: "Excellent" },
    { id: "c4", title: "Mewtwo VSTAR - Crown Zenith", price: 2100000, condition: "Mint" },
  ]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isUploading, setIsUploading] = useState(false);
  const [newCard, setNewCard] = useState({ title: "", price: "" });

  const filters = ["All", "Mint", "Near Mint", "Excellent", "Good"];

  const filteredCards = cards.filter(card => 
    activeFilter === "All" ? true : card.condition === activeFilter
  );

  const handleUpload = () => {
    if (!newCard.title || !newCard.price) return;
    const card: CardItem = {
      id: Date.now().toString(),
      title: newCard.title,
      price: parseInt(newCard.price) || 0,
      condition: "Mint",
    };
    setCards(prev => [card, ...prev]);
    setNewCard({ title: "", price: "" });
    setIsUploading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft pb-40">
      <StickyHeader
        title="Collection Detail"
        variant="minimal"
        size="sm"
        leftAction={<BackButton onClick={() => window.location.href = '/collections'} />}
      />

      <main className="flex-1">
        {/* Collection Header Section */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h1 className="text-[20px] font-bold text-text-main uppercase tracking-tight leading-none">
                  {initialTitle}
                </h1>
              </div>
              <p className="text-[12px] font-medium text-text-sub ml-3.5">
                Total {cards.length} kartu dalam folder ini
              </p>
            </div>
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center border border-surface-muted"
            >
               <Icons.Collection size={28} className="text-primary" />
            </motion.div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 px-6 py-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-5 py-2.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all duration-300 border",
                activeFilter === filter 
                  ? "bg-primary text-white border-primary shadow-soft scale-105" 
                  : "bg-white text-text-sub border-surface-hover hover:border-primary/30"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="px-6 pt-4">
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-2 gap-4 justify-items-center"
          >
            <AnimatePresence mode="popLayout">
              {filteredCards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <ProductCard 
                    title={card.title}
                    price={card.price}
                    condition={card.condition}
                    className="w-[calc(50vw-28px)] max-w-[172px]"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredCards.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-text-sub"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-soft">
                <Icons.Search size={32} className="opacity-20" />
              </div>
              <p className="text-[14px] font-bold text-text-main">Tidak ada kartu</p>
              <p className="text-[12px]">Coba ganti filter kondisinya ya.</p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Floating Upload Button - Centered for Mobile UI Standard */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-center pointer-events-none z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsUploading(true)}
          className="w-16 h-16 bg-primary rounded-full shadow-medium flex items-center justify-center text-white border-4 border-white pointer-events-auto"
        >
          <Icons.Plus size={32} />
        </motion.button>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploading(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-[440px] bg-white rounded-t-[32px] p-8 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-surface-muted rounded-full mx-auto mb-6" />
              <h2 className="text-xl font-bold text-text-main mb-2 uppercase italic tracking-tighter">Upload Kartu Baru</h2>
              <p className="text-sm text-text-sub mb-8">Tambahkan koleksi kartumu ke dalam folder ini.</p>
              
              <div className="flex flex-col gap-6">
                <div className="w-full aspect-video bg-surface-muted rounded-2xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-primary/5 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Icons.Plus size={24} />
                  </div>
                  <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Pilih Foto Kartu</span>
                </div>

                <Input 
                  placeholder="Nama Kartu (misal: Mewtwo GX)" 
                  value={newCard.title}
                  onChange={(e) => setNewCard(prev => ({ ...prev, title: e.target.value }))}
                />
                
                <Input 
                  placeholder="Estimasi Harga (IDR)" 
                  type="number"
                  value={newCard.price}
                  onChange={(e) => setNewCard(prev => ({ ...prev, price: e.target.value }))}
                />
                
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setIsUploading(false)}>
                    Batal
                  </Button>
                  <Button className="flex-1" onClick={handleUpload} disabled={!newCard.title || !newCard.price}>
                    Simpan Kartu
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
