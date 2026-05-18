"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { ProductCard } from "@/components/ui/ProductCard";
import { Input } from "@/components/ui/Input";
import { Icons } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types";
import { productService } from "@/lib/services/product";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";

export default function SearchPage() {
  const router = useRouter();
  const { isGuest, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Terkait");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites(user?.id);

  const tabs = ["Terkait", "Terbaru", "Terlaris", "Harga"];
  const conditions = ["Mint", "Near Mint", "Excellent", "Good", "Played"];

  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const nextProducts = await productService.listPublishedProducts();
        setProducts(nextProducts);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const toggleCondition = (cond: string) => {
    setSelectedConditions(prev =>
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    let visibleProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedConditions.length > 0) {
      visibleProducts = visibleProducts.filter(
        (product) => product.condition && selectedConditions.includes(product.condition)
      );
    }

    if (priceRange.min) {
      visibleProducts = visibleProducts.filter(
        (product) => product.price >= Number(priceRange.min)
      );
    }

    if (priceRange.max) {
      visibleProducts = visibleProducts.filter(
        (product) => product.price <= Number(priceRange.max)
      );
    }

    if (activeTab === "Terbaru") return [...visibleProducts].reverse();
    if (activeTab === "Harga") return [...visibleProducts].sort((a, b) => a.price - b.price);

    return visibleProducts;
  }, [activeTab, priceRange, products, searchQuery, selectedConditions]);

  return (
    <div className="flex flex-col min-h-screen bg-surface-tint">
      <StickyHeader
        title="Search"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 flex flex-col">
        {/* Search Input Section */}
        <div className="px-6 pt-4 pb-2 bg-white/80 backdrop-blur-xl sticky top-[72px] z-30 border-b border-surface-muted shadow-soft">
          <div className="relative group">
            <Input
              placeholder="Cari kartu favoritmu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<Icons.Search size={20} className="text-text-sub group-focus-within:text-primary transition-colors" />}
              className="shadow-soft bg-surface-light! border-none h-[48px] rounded-2xl group-focus-within:ring-2 group-focus-within:ring-primary/10 transition-all"
              autoFocus
            />
          </div>

          {/* Sort Tabs */}
          {searchQuery.trim() !== "" && (
            <div className="flex items-center justify-between mt-4 -mx-6 px-6">
              <div className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "relative py-3 text-[15px] font-medium transition-all whitespace-nowrap",
                      activeTab === tab ? "text-primary font-bold scale-105" : "text-text-sub hover:text-text-main"
                    )}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="w-px h-6 bg-surface-muted ml-2" />
              <button
                onClick={() => setShowFilter(true)}
                className={cn(
                  "flex items-center gap-2 py-3 text-[14px] ml-4 transition-all active:scale-95 whitespace-nowrap px-3 rounded-xl",
                  selectedConditions.length > 0 || priceRange.min || priceRange.max
                    ? "text-white bg-primary font-bold shadow-md shadow-primary/20"
                    : "text-text-sub bg-surface-hover hover:bg-surface-muted"
                )}
              >
                <Icons.Filter size={16} />
                <span className="font-bold">Filter</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 px-6 pt-4 pb-20">
          {searchQuery.trim() !== "" ? (
            <div className="flex flex-col gap-6">
              {/* Toko Berkaitan — akan di-render dari hasil query Appwrite */}

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5 text-text-sub text-[14px] font-medium">
                  <div className="w-8 h-8 bg-surface-hover rounded-full flex items-center justify-center">
                    <Icons.Search size={14} className="text-text-sub" />
                  </div>
                  <span>Hasil pencarian untuk <span className="text-primary font-bold">{`"`}{searchQuery}{`"`}</span></span>
                </div>
                <span className="text-[12px] font-bold text-text-sub/60">{filteredProducts.length} Kartu ditemukan</span>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-24">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      >
                        <ProductCard
                          title={product.title}
                          price={product.price}
                          condition={product.condition}
                          image={product.image || undefined}
                          href={`/product/${product.id}`}
                          isWishlisted={isFavorite(product.id)}
                          onWishlistToggle={() => {
                            if (isGuest || !user) {
                              router.push("/login");
                              return;
                            }
                            void toggleFavorite(product.id);
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center bg-white/50 backdrop-blur-sm rounded-[32px] border border-surface-muted shadow-soft"
                >
                  <div className="w-24 h-24 bg-surface-hover rounded-full flex items-center justify-center mb-6 relative">
                    <Icons.Search size={44} className="text-text-sub/30" />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Icons.X size={16} className="text-danger/40" />
                    </div>
                  </div>
                  <h3 className="text-[18px] font-bold text-text-main mb-2">Tidak Ada Hasil</h3>
                  <p className="text-text-sub text-[14px] max-w-[220px] leading-relaxed">
                    Maaf, kartu <span className="text-text-main font-bold">{`"`}{searchQuery}{`"`}</span> tidak ditemukan. Coba kata kunci lain atau hapus filter.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedConditions([]);
                      setPriceRange({ min: "", max: "" });
                    }}
                    className="mt-6 px-6 py-2.5 bg-primary/10 text-primary text-[13px] font-bold rounded-full hover:bg-primary/20 transition-all active:scale-95"
                  >
                    Hapus Filter
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-[140px] h-[140px] bg-white rounded-[40px] shadow-soft flex items-center justify-center mb-8 relative rotate-3 hover:rotate-0 transition-transform duration-500">
                <Icons.Search size={56} className="text-primary/10" />
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 backdrop-blur-xl rounded-full animate-pulse" />
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-accent/20 backdrop-blur-xl rounded-full" />
              </div>
              <h3 className="text-[20px] font-bold text-text-main mb-3 tracking-tight">Cari Kartu Impianmu</h3>
              <p className="text-text-sub text-[15px] max-w-[240px] leading-relaxed">
                Temukan koleksi kartu TCG terlengkap dari ribuan toko di Indonesia.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      {/* FILTER DRAWER */}
      <AnimatePresence>
        {showFilter && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilter(false)}
              className="fixed inset-0 z-50 bg-text-main/20 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white rounded-t-[40px] z-50 p-8 pb-12 shadow-medium overflow-hidden"
            >
              {/* Drag Handle */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-surface-muted rounded-full" />

              <div className="flex justify-between items-center mb-10 mt-2">
                <div className="flex flex-col">
                  <h2 className="text-[20px] font-bold text-text-main tracking-tight">Filter</h2>
                  <p className="text-[12px] text-text-sub font-medium">Saring pencarian sesuai kebutuhanmu</p>
                </div>
                <button
                  onClick={() => setShowFilter(false)}
                  className="w-10 h-10 flex items-center justify-center bg-surface-hover rounded-full text-text-sub hover:text-text-main hover:bg-surface-muted transition-all active:scale-90"
                >
                  <Icons.X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-10">
                {/* Condition Filter */}
                <div>
                  <div className="flex justify-between items-end mb-5">
                    <h4 className="text-[15px] font-bold text-text-main uppercase tracking-wider">Kondisi Kartu</h4>
                    {selectedConditions.length > 0 && (
                      <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                        {selectedConditions.length} Terpilih
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {conditions.map(cond => (
                      <button
                        key={cond}
                        onClick={() => toggleCondition(cond)}
                        className={cn(
                          "px-5 py-2.5 rounded-2xl text-[14px] font-bold transition-all duration-300",
                          selectedConditions.includes(cond)
                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                            : "bg-surface-muted text-text-sub hover:bg-surface-hover"
                        )}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h4 className="text-[15px] font-bold text-text-main mb-5 uppercase tracking-wider">Rentang Harga (IDR)</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-text-sub/60">Rp</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full h-[52px] bg-surface-muted rounded-2xl pl-10 pr-4 text-[15px] font-bold text-text-main outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="w-4 h-[2px] bg-surface-muted rounded-full" />
                    <div className="flex-1 relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-text-sub/60">Rp</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full h-[52px] bg-surface-muted rounded-2xl pl-10 pr-4 text-[15px] font-bold text-text-main outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <button
                  onClick={() => {
                    setSelectedConditions([]);
                    setPriceRange({ min: "", max: "" });
                  }}
                  className="flex-1 h-[58px] bg-white border-2 border-surface-muted rounded-[22px] text-[16px] font-bold text-text-sub hover:bg-surface-hover hover:border-surface-hover active:scale-95 transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilter(false)}
                  className="flex-[2.5] h-[58px] bg-linear-to-r from-primary to-accent text-white rounded-[22px] text-[16px] font-bold shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Tampilkan {filteredProducts.length} Produk
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
