"use client";

import React, { useState, useMemo } from "react";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "@/components/ui/Icons";
import { CategoryList } from "@/components/ui/CategoryList";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";

const INITIAL_COLLECTIONS: any[] = [];

export default function CollectionsPage() {
  const [collections, setCollections] = useState(INITIAL_COLLECTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const filteredCollections = useMemo(() => {
    return collections.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collections, searchTerm]);

  const handleAddCollection = () => {
    if (!newTitle.trim()) return;
    const newCollection = {
      id: Date.now(),
      title: newTitle,
      count: 0
    };
    setCollections(prev => [newCollection, ...prev]);
    setNewTitle("");
    setIsAdding(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    show: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  } as const;

  const { isGuest } = useAuth();

  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-surface-tint">
        <StickyHeader title="Koleksi Anda" variant="logo" size="lg" />
        <GuestEmptyState 
          title="Login untuk Mengelola Koleksi" 
          description="Simpan dan kelompokkan kartu impian Anda ke dalam koleksi pribadi dengan masuk ke akun Anda."
          icon={<Icons.Collection size={48} />}
        />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-background relative pb-40">
      <StickyHeader title="Collection" variant="logo" size="lg" />

      {/* Categories & Search */}
      <div className="relative z-10 pt-6 px-6 flex flex-col gap-6">
        <CategoryList />
        
        <div className="flex items-center gap-3">
          <Input 
            placeholder="Cari koleksi..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={<Icons.Search size={18} />}
            className="h-[52px] bg-white shadow-soft"
          />
        </div>
      </div>

      {/* Collections Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 grid grid-cols-3 gap-x-3 gap-y-6 px-6 pt-8"
      >
        <AnimatePresence mode="popLayout">
          {/* Add New Collection Placeholder */}
          <motion.button
            key="add-button"
            variants={itemVariants}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="w-full aspect-4/5 rounded-card border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-2 hover:border-primary transition-all bg-white/40 backdrop-blur-sm group shadow-sm hover:shadow-soft"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icons.Plus size={20} className="text-primary" />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Tambah</span>
          </motion.button>

          {filteredCollections.map((item) => (
            <motion.div key={item.id} variants={itemVariants} layout>
              <CollectionCard
                title={item.title}
                count={item.count}
                onClick={() => window.location.href = `/collections/${item.id}`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add Dialog Overlay */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-6 sm:items-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-[440px] bg-white rounded-t-[32px] sm:rounded-[32px] p-8 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-surface-muted rounded-full mx-auto mb-6 sm:hidden" />
              <h2 className="text-xl font-black text-text-main mb-2">Buat Koleksi Baru</h2>
              <p className="text-sm text-text-sub mb-8">Beri nama folder untuk mengelompokkan kartu kesayanganmu.</p>
              
              <div className="flex flex-col gap-6">
                <Input 
                  placeholder="Nama Koleksi (misal: Pokemon Rare)" 
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCollection()}
                />
                
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>
                    Batal
                  </Button>
                  <Button className="flex-1" onClick={handleAddCollection} disabled={!newTitle.trim()}>
                    Simpan
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {filteredCollections.length === 0 && searchTerm && (
        <div className="flex flex-col items-center justify-center py-20 text-text-sub">
          <Icons.Search size={40} className="opacity-20 mb-4" />
          <p className="text-sm font-bold">Koleksi "{searchTerm}" tidak ditemukan</p>
        </div>
      )}
    </main>
  );
}

