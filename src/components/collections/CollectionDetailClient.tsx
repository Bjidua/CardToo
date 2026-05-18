"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { collectionService } from "@/lib/services/collection";
import type { Collection, CollectionItem } from "@/types";

interface CollectionDetailClientProps {
  id: string;
}

export default function CollectionDetailClient({ id }: CollectionDetailClientProps) {
  return (
    <ProtectedRoute>
      <CollectionDetailContent id={id} />
    </ProtectedRoute>
  );
}

function CollectionDetailContent({ id }: CollectionDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [cards, setCards] = useState<CollectionItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [newCard, setNewCard] = useState({ title: "", price: "" });

  useEffect(() => {
    if (!user) return;

    const loadCollection = async () => {
      try {
        setIsLoading(true);
        const result = await collectionService.getCollectionById(user.id, id);
        setCollection(result?.collection || null);
        setCards(result?.items || []);
      } finally {
        setIsLoading(false);
      }
    };

    void loadCollection();
  }, [id, user]);

  const filters = ["All", "Mint", "Near Mint", "Excellent", "Good", "Played"];

  const filteredCards = useMemo(
    () =>
      cards.filter((card) =>
        activeFilter === "All" ? true : card.condition === activeFilter
      ),
    [activeFilter, cards]
  );

  const handleUpload = async () => {
    if (!user || !collection || !newCard.title || !newCard.price) return;

    try {
      setIsSaving(true);
      const item = await collectionService.addManualItem(user.id, {
        collectionId: collection.id,
        title: newCard.title,
        price: parseInt(newCard.price, 10) || 0,
        condition: "mint",
      });
      setCards((prev) => [item, ...prev]);
      setCollection((prev) =>
        prev
          ? {
              ...prev,
              count: prev.count + 1,
            }
          : prev
      );
      setNewCard({ title: "", price: "" });
      setIsUploading(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!collection) return;

    try {
      setRemovingId(itemId);
      await collectionService.removeItem(itemId);
      setCards((prev) => prev.filter((item) => item.id !== itemId));
      setCollection((prev) =>
        prev
          ? {
              ...prev,
              count: Math.max(0, prev.count - 1),
            }
          : prev
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-tint">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-tint px-6 text-center">
        <div>
          <p className="text-[16px] font-bold text-text-main">Koleksi tidak ditemukan</p>
          <button
            onClick={() => router.push("/collections")}
            className="mt-4 px-6 h-12 rounded-full bg-primary text-white font-bold"
          >
            Kembali ke Koleksi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft pb-40">
      <StickyHeader
        title="Collection Detail"
        variant="minimal"
        size="sm"
        leftAction={<BackButton onClick={() => router.push("/collections")} />}
      />

      <main className="flex-1">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h1 className="text-[20px] font-bold text-text-main uppercase tracking-tight leading-none">
                  {collection.title}
                </h1>
              </div>
              <p className="text-[12px] font-medium text-text-sub ml-3.5">
                Total {collection.count} kartu dalam folder ini
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

        <div className="px-6 pt-4">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
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
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => void handleRemoveItem(card.id)}
                    disabled={removingId === card.id}
                    className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-danger shadow-soft transition-all active:scale-90 disabled:opacity-60"
                    aria-label={`Hapus ${card.title} dari koleksi`}
                  >
                    <Icons.Delete size={14} />
                  </button>
                  <ProductCard
                    title={card.title}
                    price={card.price}
                    condition={card.condition}
                    image={card.image || undefined}
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

      <AnimatePresence>
        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploading(false)}
              className="absolute inset-0 bg-text-main/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-[440px] bg-white rounded-t-[32px] p-8 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-surface-muted rounded-full mx-auto mb-6" />
              <h2 className="text-xl font-bold text-text-main mb-2 uppercase italic tracking-tighter">
                Upload Kartu Baru
              </h2>
              <p className="text-sm text-text-sub mb-8">
                Tambahkan koleksi kartumu ke dalam folder ini.
              </p>

              <div className="flex flex-col gap-6">
                <div className="w-full aspect-video bg-surface-muted rounded-2xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Icons.Plus size={24} />
                  </div>
                  <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                    Foto Menyusul
                  </span>
                </div>

                <Input
                  placeholder="Nama Kartu (misal: Mewtwo GX)"
                  value={newCard.title}
                  onChange={(e) => setNewCard((prev) => ({ ...prev, title: e.target.value }))}
                />

                <Input
                  placeholder="Estimasi Harga (IDR)"
                  type="number"
                  value={newCard.price}
                  onChange={(e) => setNewCard((prev) => ({ ...prev, price: e.target.value }))}
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsUploading(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => void handleUpload()}
                    disabled={!newCard.title || !newCard.price || isSaving}
                  >
                    {isSaving ? "Menyimpan..." : "Simpan Kartu"}
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
