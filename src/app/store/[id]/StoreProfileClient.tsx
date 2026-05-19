"use client";

import React, { useEffect, useRef, useState } from "react";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { ProductCard } from "@/components/ui/ProductCard";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { productService } from "@/lib/services/product";
import { reviewService } from "@/lib/services/review";
import { buildProductDetailHref } from "@/lib/routes";
import { storeService } from "@/lib/services/store";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import type { Product, ReviewSummary, Store } from "@/types";

export default function StoreProfileClient({ id }: { id: string }) {
  const router = useRouter();
  const { isGuest, user } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("Produk");
  const [searchInStore, setSearchInStore] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites(user?.id);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadStore = async () => {
      try {
        setIsLoading(true);
        const nextStore = await storeService.getStoreById(id);
        setStore(nextStore);

        if (nextStore) {
          const [nextProducts, nextSummary] = await Promise.all([
            productService.listPublishedProducts({
              storeId: nextStore.id,
            }),
            reviewService.getStoreReviewSummary(nextStore.id),
          ]);
          setProducts(nextProducts);
          setReviewSummary(nextSummary);
        } else {
          setProducts([]);
          setReviewSummary(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadStore();
  }, [id]);

  const handleSearchClick = () => {
    setActiveTab("Produk");
    setTimeout(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleChatClick = () => {
    router.push(
      `/messages/room?sellerId=${encodeURIComponent(
        store?.ownerUserId || ""
      )}&storeId=${encodeURIComponent(store?.id || "")}`
    );
  };

  const tabs = ["Produk", "Ulasan", "Tentang"];

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchInStore.toLowerCase())
  );
  const joinedLabel = store?.createdAt
    ? new Date(store.createdAt).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })
    : "Belum tersedia";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-tint">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-tint px-6 text-center">
        <h2 className="text-[18px] font-bold text-text-main">Toko tidak ditemukan</h2>
        <p className="mt-2 text-[14px] text-text-sub">
          Toko yang kamu buka mungkin sudah tidak aktif.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-tint pb-32">
      <div
        className={cn(
          "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 transition-all duration-300",
          scrolled ? "bg-white/80 backdrop-blur-xl shadow-soft h-[72px]" : "bg-transparent h-[100px]"
        )}
      >
        <div className="flex items-center gap-4 px-6 h-full">
          <BackButton
            variant="secondary"
            className={cn(
              "transition-all",
              scrolled ? "bg-primary" : "bg-white/20 backdrop-blur-md text-white border-white/20"
            )}
          />
          {scrolled && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <h2 className="text-[14px] font-bold text-text-main leading-tight">{store.name}</h2>
              <span className="text-[11px] text-text-sub font-medium">{store.followers} Pengikut</span>
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

      <div
        className={cn(
          "relative h-60 w-full overflow-hidden transition-colors duration-500",
          store.coverImage ? "bg-text-main" : "bg-secondary"
        )}
      >
        {store.coverImage ? (
          <Image src={store.coverImage} alt="Store Cover" fill className="object-cover opacity-80" />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-secondary to-accent opacity-30" />
        )}
        <div className="absolute inset-0 z-10 bg-linear-to-b from-text-main/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-surface-tint via-surface-tint/40 to-transparent z-10" />
      </div>

      <div className="px-6 -mt-24 relative z-10">
        <div className="bg-white rounded-[40px] p-6 shadow-medium border border-surface-muted flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 border-4 border-white shadow-soft relative overflow-hidden flex items-center justify-center text-primary group">
                <Icons.Store size={40} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-[20px] font-bold text-text-main leading-tight">{store.name}</h1>
                  {store.isVerified && (
                    <div className="bg-primary text-white text-[8px] px-1.5 py-0.5 rounded-2xl font-bold">
                      VERIFIED
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-text-sub font-medium mt-1">
                  <Icons.MapPin size={12} />
                  <span>{store.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-tint p-3 rounded-2xl border border-surface-muted flex flex-col items-center">
              <span className="text-[13px] font-bold text-primary">{store.performance.chat}</span>
              <span className="text-[9px] text-text-sub font-bold uppercase tracking-widest mt-1 text-center">Balas Chat</span>
            </div>
            <div className="bg-surface-tint p-3 rounded-2xl border border-surface-muted flex flex-col items-center">
              <span className="text-[13px] font-bold text-success">{store.performance.process}</span>
              <span className="text-[9px] text-text-sub font-bold uppercase tracking-widest mt-1 text-center">Proses</span>
            </div>
            <div className="bg-surface-tint p-3 rounded-2xl border border-surface-muted flex flex-col items-center">
              <span className="text-[13px] font-bold text-accent">{store.performance.onTime}</span>
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
              <div className="relative group">
                <Input
                  ref={searchInputRef}
                  placeholder="Cari produk di toko ini..."
                  value={searchInStore}
                  onChange={(event) => setSearchInStore(event.target.value)}
                  startIcon={
                    <Icons.Search
                      size={18}
                      className="text-text-sub/40 group-focus-within:text-primary transition-colors"
                    />
                  }
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
                      image={product.image || undefined}
                      href={buildProductDetailHref(product.id)}
                      isWishlisted={isFavorite(product.id)}
                      onWishlistToggle={() => {
                        if (isGuest || !user) {
                          router.push("/login");
                          return;
                        }
                        void toggleFavorite(product.id);
                      }}
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
                  <span className="text-[32px] font-bold text-text-main leading-tight">
                    {(reviewSummary?.averageRating || Number(store.rating || "0")).toFixed(1)}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <Icons.Review key={index} size={12} className="text-warning fill-warning" />
                    ))}
                  </div>
                  <span className="text-[12px] text-text-sub font-medium mt-1">
                    {reviewSummary?.totalReviews
                      ? `${reviewSummary.totalReviews} ulasan publik`
                      : "Belum ada ulasan publik"}
                  </span>
                </div>
                <div className="flex flex-col gap-2 flex-1 ml-10">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-text-sub w-2">{star}</span>
                      <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-warning"
                          style={{
                            width: reviewSummary?.totalReviews
                              ? `${((reviewSummary.breakdown[star as 1 | 2 | 3 | 4 | 5] || 0) / reviewSummary.totalReviews) * 100}%`
                              : "0%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {reviewSummary && reviewSummary.totalReviews > 0 ? (
                <div className="flex flex-col gap-4">
                  {reviewSummary.reviews.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-5 rounded-[28px] border border-surface-muted shadow-soft flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[12px] font-bold text-text-main">Pembeli CardToo</span>
                        <span className="text-[11px] text-text-sub">
                          {new Date(item.createdAt).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Icons.Review
                            key={`${item.id}-${index}`}
                            size={12}
                            className={cn(
                              index < item.rating
                                ? "text-warning fill-warning"
                                : "text-surface-muted fill-surface-muted"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-[12px] text-text-sub leading-relaxed">
                        {item.reviewText || "Pembeli memberikan rating tanpa komentar tambahan."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-text-sub text-center">
                  <Icons.Review size={40} className="opacity-10 mb-4" />
                  <p className="text-[14px] font-bold text-text-main">Belum ada ulasan detail</p>
                  <p className="text-[12px]">Rating akan muncul setelah ada transaksi selesai.</p>
                </div>
              )}
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
                <h3 className="text-[15px] font-bold text-text-main mb-4 uppercase tracking-widest">Deskripsi Toko</h3>
                <p className="text-[14px] text-text-sub leading-relaxed font-medium">{store.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[32px] border border-surface-muted flex flex-col gap-1">
                  <span className="text-[10px] text-text-sub font-bold uppercase tracking-widest">Bergabung</span>
                  <span className="text-[14px] font-bold text-text-main">{joinedLabel}</span>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-surface-muted flex flex-col gap-1">
                  <span className="text-[10px] text-text-sub font-bold uppercase tracking-widest">Waktu Balas</span>
                  <span className="text-[14px] font-bold text-text-main">Belum dihitung otomatis</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
