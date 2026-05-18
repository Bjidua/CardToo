"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "@/components/ui/Icons";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";
import { collectionService } from "@/lib/services/collection";
import type { Collection } from "@/types";

export default function CollectionsPage() {
  const router = useRouter();
  const { isGuest, user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadCollections = async () => {
      try {
        setIsLoading(true);
        const nextCollections = await collectionService.listCollections(user.id);
        setCollections(nextCollections);
      } finally {
        setIsLoading(false);
      }
    };

    void loadCollections();
  }, [user]);

  const filteredCollections = useMemo(() => {
    return collections.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collections, searchTerm]);

  const handleAddCollection = async () => {
    if (!user || !newTitle.trim()) return;

    try {
      setIsCreating(true);
      const created = await collectionService.createCollection(user.id, newTitle);
      setCollections((prev) => [created, ...prev]);
      setNewTitle("");
      setIsAdding(false);
    } finally {
      setIsCreating(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
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
        damping: 30,
      },
    },
  } as const;

  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-background">
        <StickyHeader title="Collections" variant="logo" size="lg" />
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

      <div className="relative z-10 pt-6 px-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Cari koleksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={<Icons.Search size={23} />}
            className="bg-white/50 shadow-soft"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 grid grid-cols-3 gap-x-3 gap-y-6 px-6 pt-8"
        >
          <AnimatePresence mode="popLayout">
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
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                Tambah
              </span>
            </motion.button>

            {filteredCollections.map((item) => (
              <motion.div key={item.id} variants={itemVariants} layout>
                <CollectionCard
                  title={item.title}
                  count={item.count}
                  onClick={() =>
                    router.push(
                      `/collections/detail?collectionId=${encodeURIComponent(item.id)}`
                    )
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-text-main/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-[440px] bg-white rounded-[32px] p-8 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-text-main mb-2">Buat Koleksi Baru</h2>
              <p className="text-sm text-text-sub mb-8">
                Beri nama folder untuk mengelompokkan kartu kesayanganmu.
              </p>

              <div className="flex flex-col gap-6">
                <Input
                  placeholder="Nama Koleksi (misal: Pokemon Rare)"
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void handleAddCollection()}
                />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsAdding(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => void handleAddCollection()}
                    disabled={!newTitle.trim() || isCreating}
                  >
                    {isCreating ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!isLoading && filteredCollections.length === 0 && searchTerm && (
        <div className="flex flex-col items-center justify-center py-20 text-text-sub">
          <Icons.Search size={40} className="opacity-20 mb-4" />
          <p className="text-sm font-bold">
            Koleksi {`"`}{searchTerm}{`"`} tidak ditemukan
          </p>
        </div>
      )}
    </main>
  );
}
