"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { ProductCard } from "@/components/ui/ProductCard";
import { Icons } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { productService } from "@/lib/services/product";
import { buildSellerEditProductHref } from "@/lib/routes";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

/**
 * Halaman Kelola Produk Toko Penjual (SellerProductsPage)
 * Membatasi akses agar hanya bisa dikunjungi penjual yang sah (ProtectedRoute requireSeller=true).
 */
export default function SellerProductsPage() {
  return (
    <ProtectedRoute requireSeller={true}>
      <SellerProductsContent />
    </ProtectedRoute>
  );
}

/**
 * Komponen Konten Kelola Produk (SellerProductsContent)
 * Menyediakan dashboard etalase produk seller:
 * - Kolom pencarian teks internal untuk mempermudah navigasi produk yang banyak.
 * - Grid visual list produk aktif beserta tombol hapus langsung (Delete) dan info stok.
 * - Tombol FAB (Floating Action Button) untuk menambah produk baru.
 */
function SellerProductsContent() {
  const router = useRouter();

  // Membaca info toko penjual aktif dari auth context
  const { store } = useAuth();

  // State teks filter pencarian produk
  const [searchTerm, setSearchTerm] = useState("");

  // State daftar produk terdaftar di toko
  const [products, setProducts] = useState<Product[]>([]);

  // State loading status pemuatan list
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Effect Hook untuk menarik list produk berdasarkan ID toko.
   */
  React.useEffect(() => {
    const loadProducts = async () => {
      if (!store?.id) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const nextProducts = await productService.listSellerProducts(store.id);
        setProducts(nextProducts);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, [store?.id]);

  /**
   * Menghapus dokumen produk dari database etalase toko.
   * 
   * @param id ID dokumen produk
   */
  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini dari toko?")) {
      // Panggil API penghapusan produk dari database
      await productService.deleteProduct(id);
      
      // Update state lokal produk agar langsung hilang dari layar
      setProducts((prev) => prev.filter((product) => product.id !== id));
    }
  };

  // Memfilter produk di UI berdasarkan ketikan di kolom cari
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-white pb-32">
      {/* Header Halaman atas */}
      <StickyHeader 
        title="Kelola Produk" 
        variant="minimal" 
        size="sm" 
        leftAction={<BackButton variant="secondary"/>} 
      />

      <main className="flex-1 px-6 pt-6">
        {/* Kolom Input Cari Produk */}
        <div className="flex items-center gap-3 mb-6">
          <Input 
            placeholder="Cari produkmu..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={<Icons.Search size={18} />}
            className="h-[52px] bg-white shadow-soft"
          />
        </div>

        {/* Total Informasi Jumlah Produk Aktif */}
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-[16px] font-bold text-text-main">Produk Aktif ({filteredProducts.length})</h2>
        </div>

        {/* Grid Produk Aktif atau Spinner loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
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
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  {/* Kartu produk */}
                  <ProductCard 
                    title={product.title}
                    price={product.price}
                    condition={product.condition}
                    href={buildSellerEditProductHref(product.id)}
                    theme="secondary"
                    className="w-[calc(50vw-28px)] max-w-[172px]"
                  />
                  
                  {/* Tombol Hapus Produk di pojok kanan atas kartu */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleDelete(product.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-danger/90 backdrop-blur-md rounded-full shadow-md flex items-center justify-center text-white z-20 active:scale-90 transition-all border border-white/20"
                  >
                    <Icons.Delete size={14} />
                  </button>

                  {/* Badge Jumlah Stok */}
                  <div className="absolute top-[118px] right-2 px-2 py-0.5 bg-white/95 backdrop-blur-sm rounded-md shadow-sm border border-surface-muted z-10 flex items-center gap-1">
                    <span className="text-[9px] font-bold text-text-main uppercase tracking-tighter">
                      Stok: {product.stock}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* State Pencarian Kosong */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-text-sub">
            <Icons.Search size={40} className="opacity-20 mb-4" />
            <p className="text-[14px] font-bold text-text-main">Produk tidak ditemukan</p>
            <p className="text-[12px]">Coba cari dengan kata kunci lain.</p>
          </div>
        )}
      </main>

      {/* FAB Add Product - Tombol bulat melayang tambah produk baru di bawah tengah */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push('/seller/products/add')}
          className="w-16 h-16 bg-secondary rounded-full shadow-xl flex items-center justify-center text-white border-[6px] border-white active:bg-secondary-dark transition-colors"
        >
          <Icons.Plus size={32} />
        </motion.button>
      </div>
    </div>
  );
}
