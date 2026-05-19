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
import { useLanguage } from "@/context/LanguageContext";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";
import { collectionService } from "@/lib/services/collection";
import type { Collection } from "@/types";

/**
 * Halaman Koleksi Kartu Pribadi (Collections Page)
 * Memungkinkan pembeli melihat, mencari, dan membuat folder koleksi kartu kesayangan mereka.
 * Memerlukan otentikasi (dilindungi oleh status guest/tamu).
 */
export default function CollectionsPage() {
  // Router Next.js untuk kebutuhan perpindahan halaman detail koleksi
  const router = useRouter();

  // Status login user dari context autentikasi global
  const { isGuest, user } = useAuth();

  // Fungsi helper terjemahan bahasa aktif
  const { t } = useLanguage();

  // State untuk menyimpan daftar folder koleksi dari server Appwrite
  const [collections, setCollections] = useState<Collection[]>([]);

  // State pencarian teks berdasarkan judul koleksi
  const [searchTerm, setSearchTerm] = useState("");

  // State pengendali kemunculan modal "Tambah Koleksi Baru"
  const [isAdding, setIsAdding] = useState(false);

  // State menyimpan judul folder koleksi baru yang sedang diketik
  const [newTitle, setNewTitle] = useState("");

  // State indikator memuat data awal dari server
  const [isLoading, setIsLoading] = useState(true);

  // State status submit pengiriman data koleksi baru
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Effect Hook untuk memuat seluruh data folder koleksi milik pengguna
   * saat komponen dimuat atau user ID berubah.
   */
  useEffect(() => {
    if (!user) return;

    const loadCollections = async () => {
      try {
        setIsLoading(true); // Aktifkan spinner memuat
        // Tarik data koleksi dari Appwrite Database
        const nextCollections = await collectionService.listCollections(user.id);
        setCollections(nextCollections); // Simpan hasil ke state
      } finally {
        setIsLoading(false); // Matikan spinner
      }
    };

    void loadCollections();
  }, [user]);

  /**
   * Filter daftar koleksi secara dinamis (client-side) berdasarkan teks kolom pencarian.
   * Menggunakan useMemo agar proses kalkulasi tidak berjalan di setiap render ulang biasa.
   */
  const filteredCollections = useMemo(() => {
    return collections.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collections, searchTerm]);

  /**
   * Mengirim permintaan pembuatan folder koleksi baru ke backend Appwrite.
   */
  const handleAddCollection = async () => {
    if (!user || !newTitle.trim()) return;

    try {
      setIsCreating(true); // Set state sedang mengirim
      // Panggil endpoint service pembuatan dokumen koleksi
      const created = await collectionService.createCollection(user.id, newTitle);
      // Sisipkan item baru di awal array state agar langsung dirender teratas
      setCollections((prev) => [created, ...prev]);
      setNewTitle(""); // Bersihkan isi input teks
      setIsAdding(false); // Tutup modal pop-up
    } finally {
      setIsCreating(false); // Matikan state sedang mengirim
    }
  };

  // Varian animasi transisi kontainer grid koleksi (stagger effect)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Jeda waktu muncul antar item anak berturut-turut
      },
    },
  } as const;

  // Varian animasi transisi item kartu koleksi individual (spring physics)
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

  // UI STATE 1: Tampilkan halaman kosong/panduan login jika statusnya adalah Guest/Tamu
  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-background">
        <StickyHeader title="Collections" variant="logo" size="lg" />
        <GuestEmptyState
          title={t("login_manage_collections")}
          description={t("login_manage_collections_desc")}
          icon={<Icons.Collection size={48} />}
        />
      </main>
    );
  }

  // UI UTAMA: Menampilkan menu pencarian, list grid koleksi, tombol tambah, serta dialog modal
  return (
    <main className="flex-1 flex flex-col bg-background relative pb-40">
      {/* Header utama atas */}
      <StickyHeader title={t("collections")} variant="logo" size="lg" />

      {/* Bagian Kolom Input Pencarian */}
      <div className="relative z-10 pt-6 px-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Input
            placeholder={t("search_collections")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={<Icons.Search size={23} />}
            className="bg-white/50 shadow-soft"
          />
        </div>
      </div>

      {/* Konten Grid Koleksi atau Spinner Loading */}
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
            {/* Tombol Grid Utama: Membuat Folder Baru */}
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
                {t("add")}
              </span>
            </motion.button>

            {/* List Item Folder Koleksi yang Terfilter */}
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

      {/* Modal Dialog Overlay: Pembuatan Koleksi Baru */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            {/* Backdrop Blur latar belakang */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-text-main/20 backdrop-blur-sm"
            />
            {/* Box Konten Form Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-[440px] bg-white rounded-[32px] p-8 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-text-main mb-2">{t("create_new_collection")}</h2>
              <p className="text-sm text-text-sub mb-8">
                {t("collection_name_helper")}
              </p>

              <div className="flex flex-col gap-6">
                <Input
                  placeholder={t("collection_name_placeholder")}
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void handleAddCollection()}
                />

                {/* Tombol Batal & Simpan */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsAdding(false)}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => void handleAddCollection()}
                    disabled={!newTitle.trim() || isCreating}
                  >
                    {isCreating ? t("saving") : t("save")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tampilan kosong (Empty State) jika koleksi hasil pencarian tidak ditemukan */}
      {!isLoading && filteredCollections.length === 0 && searchTerm && (
        <div className="flex flex-col items-center justify-center py-20 text-text-sub">
          <Icons.Search size={40} className="opacity-20 mb-4" />
          <p className="text-sm font-bold">
            {t("collection_not_found").replace("{query}", searchTerm)}
          </p>
        </div>
      )}
    </main>
  );
}
