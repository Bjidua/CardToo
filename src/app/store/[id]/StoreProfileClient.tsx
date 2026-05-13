"use client";

import React, { useState, useEffect, useRef } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { ProductCard } from "@/components/ui/ProductCard";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface StoreProduct {
  id: number;
  title: string;
  price: number;
  condition: "Mint" | "Near Mint" | "Excellent" | "Good" | "Played" | undefined;
}

const DUMMY_STORE = {
  id: "",
  name: "Nama Toko",
  location: "Lokasi tidak diketahui",
  rating: "0.0",
  followers: "0",
  isVerified: false,
  coverImage: null,
  description: "Belum ada deskripsi toko.",
  performance: {
    chat: "0%",
    process: "-",
    onTime: "0%"
  },
  products: [] as StoreProduct[]
};


export default function StoreProfileClient({ id }: { id: string }) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("Produk");
  const [searchInStore, setSearchInStore] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchClick = () => {
    setActiveTab("Produk");
    setTimeout(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleChatClick = () => {
    router.push(`/messages/${DUMMY_STORE.id}`);
  };

  const tabs = ["Produk", "Ulasan", "Tentang"];

  const filteredProducts = DUMMY_STORE.products.filter(p => 
    p.title.toLowerCase().includes(searchInStore.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-surface-tint pb-32">
      {/* Header logic: Transparant to Glassmorphism */}
      <div className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 transition-all duration-300",
        scrolled ? "bg-white/80 backdrop-blur-xl shadow-soft h-[72px]" : "bg-transparent h-[100px]"
      )}>
        <div className="flex items-center gap-4 px-6 h-full">
          <BackButton variant="secondary" className={cn(
            "transition-all",
            scrolled ? "bg-primary" : "bg-white/20 backdrop-blur-md text-white border-white/20"
          )} />
          {scrolled && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <h2 className="text-[14px] font-black text-text-main leading-tight">{DUMMY_STORE.name}</h2>
              <span className="text-[11px] text-text-sub font-medium">{DUMMY_STORE.followers} Pengikut</span>
            </motion.div>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button 
              onClick={handleSearchClick}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90",
                scrolled ? "bg-primary text-white" : "bg-white/20 text-white backdrop-blur-md"
              )}
            >
              <Icons.Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Header with Banner */}
      <div className={cn(
        "relative h-60 w-full overflow-hidden transition-colors duration-500",
        DUMMY_STORE.coverImage ? "bg-black" : "bg-secondary"
      )}>
        {DUMMY_STORE.coverImage ? (
          <Image 
            src={DUMMY_STORE.coverImage} 
            alt="Store Cover" 
            fill 
            className="object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-secondary to-accent opacity-30" />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-surface-tint via-surface-tint/40 to-transparent z-10" />
      </div>

      {/* Store Info Card */}
      <div className="px-6 -mt-24 relative z-10">
        <div className="bg-white rounded-[40px] p-6 shadow-medium border border-surface-muted flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 border-4 border-white shadow-soft relative overflow-hidden flex items-center justify-center text-primary group">
                <Icons.Store size={40} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-[20px] font-black text-text-main leading-tight">{DUMMY_STORE.name}</h1>
                  {DUMMY_STORE.isVerified && (
                    <div className="bg-primary text-white text-[8px] px-1.5 py-0.5 rounded-2xl font-bold">VERIFIED</div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-text-sub font-medium mt-1">
                  <Icons.MapPin size={12} />
                  <span>{DUMMY_STORE.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-tint p-3 rounded-2xl border border-surface-muted flex flex-col items-center">
              <span className="text-[13px] font-black text-primary">{DUMMY_STORE.performance.chat}</span>
              <span className="text-[9px] text-text-sub font-bold uppercase tracking-widest mt-1 text-center">Balas Chat</span>
            </div>
            <div className="bg-surface-tint p-3 rounded-2xl border border-surface-muted flex flex-col items-center">
              <span className="text-[13px] font-black text-success">{DUMMY_STORE.performance.process}</span>
              <span className="text-[9px] text-text-sub font-bold uppercase tracking-widest mt-1 text-center">Proses</span>
            </div>
            <div className="bg-surface-tint p-3 rounded-2xl border border-surface-muted flex flex-col items-center">
              <span className="text-[13px] font-black text-accent">{DUMMY_STORE.performance.onTime}</span>
              <span className="text-[9px] text-text-sub font-bold uppercase tracking-widest mt-1 text-center">Tepat Waktu</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-surface-muted">
            <button 
              onClick={handleChatClick}
              className="flex-1 h-14 rounded-2xl bg-primary text-white text-[15px] font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/30 active:scale-95 transition-all"
            >
              <Icons.Message size={20} className="text-white fill-white/20" />
              Chat Penjual
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-[72px] bg-white/80 backdrop-blur-xl z-30 mt-8 border-b border-surface-muted">
        <div className="flex px-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative py-5 px-5 text-[14px] font-bold transition-all",
                activeTab === tab ? "text-primary" : "text-text-sub"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTabStore"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <main className="px-6 pt-8">
        <AnimatePresence mode="wait">
          {activeTab === "Produk" && (
            <motion.div
              key="produk"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-8"
            >
              {/* Internal Store Search */}
              <div className="relative group">
                <Input 
                  ref={searchInputRef}
                  placeholder="Cari produk di toko ini..."
                  value={searchInStore}
                  onChange={(e) => setSearchInStore(e.target.value)}
                  startIcon={<Icons.Search size={18} className="text-text-sub/40 group-focus-within:text-primary transition-colors" />}
                  className="bg-white border-none shadow-soft rounded-2xl h-12"
                />
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      title={product.title}
                      price={product.price}
                      condition={product.condition}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Icons.Search size={40} className="text-text-sub/10 mb-4" />
                  <p className="text-[14px] font-bold text-text-main">Produk tidak ditemukan</p>
                  <p className="text-[12px] text-text-sub">Coba kata kunci lain.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "Ulasan" && (
            <motion.div
              key="ulasan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-white p-6 rounded-[32px] border border-surface-muted flex items-center justify-between shadow-soft">
                <div className="flex flex-col">
                  <span className="text-[32px] font-black text-text-main leading-tight">{DUMMY_STORE.rating}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Icons.Review key={i} size={12} className="text-warning fill-warning" />)}
                  </div>
                  <span className="text-[12px] text-text-sub font-medium mt-1">99% pembeli puas</span>
                </div>
                <div className="flex flex-col gap-2 flex-1 ml-10">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-text-sub w-2">{star}</span>
                      <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                        <div className="h-full bg-warning" style={{ width: star === 5 ? "90%" : star === 4 ? "8%" : "2%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-10 text-text-sub text-center">
                <Icons.Review size={40} className="opacity-10 mb-4" />
                <p className="text-[14px] font-bold text-text-main">Belum ada ulasan detail</p>
                <p className="text-[12px]">Rating berasal dari transaksi tanpa ulasan teks.</p>
              </div>
            </motion.div>
          )}

          {activeTab === "Tentang" && (
            <motion.div
              key="tentang"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-white p-8 rounded-[40px] shadow-soft border border-surface-muted">
                <h3 className="text-[15px] font-black text-text-main mb-4 uppercase tracking-widest">Deskripsi Toko</h3>
                <p className="text-[14px] text-text-sub leading-relaxed font-medium">{DUMMY_STORE.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[32px] border border-surface-muted flex flex-col gap-1">
                  <span className="text-[10px] text-text-sub font-bold uppercase tracking-widest">Bergabung</span>
                  <span className="text-[14px] font-black text-text-main">Mei 2024</span>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-surface-muted flex flex-col gap-1">
                  <span className="text-[10px] text-text-sub font-bold uppercase tracking-widest">Waktu Balas</span>
                  <span className="text-[14px] font-black text-text-main">± 5 Menit</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
