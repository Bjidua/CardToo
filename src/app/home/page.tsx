"use client";

import React from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { ProfilePicture } from "@/components/ui/ProfilePicture";
import { Icons } from "@/components/ui/Icons";
import { CategoryList } from "@/components/ui/CategoryList";
import { ProductCard } from "@/components/ui/ProductCard";
import { SlideCard } from "@/components/ui/SlideCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/types";
import { productService } from "@/lib/services/product";
import { buildProductDetailHref } from "@/lib/routes";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";

/**
 * Komponen Konten Halaman Beranda (HomeContent)
 * Menangani pemuatan produk TCG, kolom pencarian teks, filter kategori kartu, 
 * slider promosi, serta interaksi penambahan item ke daftar favorit (wishlist).
 */
function HomeContent() {
  // Instance Next.js router untuk navigasi halaman
  const router = useRouter();

  // Mengambil query parameters dari URL (misal: ?category=pokemon)
  const searchParams = useSearchParams();

  // Mengakses state login pengguna dari AuthContext
  const { isGuest, user, profile } = useAuth();

  // Mengambil kategori aktif awal dari parameter URL (default: "All")
  const categoryParam = searchParams.get("category") || "All";
  
  // State untuk menyimpan nama kategori yang sedang dipilih/aktif
  const [selectedCategory, setSelectedCategory] = React.useState(categoryParam);

  // State teks pencarian produk
  const [searchQuery, setSearchQuery] = React.useState("");

  // State penampung daftar semua produk aktif dari server Appwrite
  const [products, setProducts] = React.useState<Product[]>([]);

  // State indikator loading data awal
  const [isLoading, setIsLoading] = React.useState(true);

  // Custom hook untuk sinkronisasi item favorit (wishlist) ke database
  const { isFavorite, toggleFavorite } = useFavorites(user?.id);

  /**
   * Effect Hook untuk memuat seluruh daftar produk TCG yang telah dipublikasikan (published).
   * Dijalankan sekali saat komponen pertama kali dipasang (mount).
   */
  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true); // Aktifkan spinner memuat
        // Memanggil service untuk mengambil list produk aktif di database
        const nextProducts = await productService.listPublishedProducts();
        setProducts(nextProducts);
      } finally {
        setIsLoading(false); // Matikan spinner memuat
      }
    };

    void loadProducts();
  }, []);

  /**
   * Memfilter daftar produk secara dinamis berdasarkan kategori yang dipilih
   * serta kata kunci teks pencarian yang diketik pengguna.
   * Dibungkus useMemo untuk optimasi agar tidak memicu pemrosesan ulang saat render tak perlu.
   */
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      // Validasi kategori: Jika pilih "All" loloskan semua, jika tidak harus cocok kategori
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      
      // Validasi pencarian teks: Judul produk harus mengandung kata kunci pencarian
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  // Varian animasi stagger untuk kontainer grid kartu produk
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  } as const;

  // Varian animasi translasi ke atas untuk kartu produk individual
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  } as const;

  // Varian animasi pemudaran transisi masuk (fade-in) untuk elemen promosi & search bar
  const fadeInVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  } as const;

  return (
    <main className="flex-1 flex flex-col bg-background relative pb-40">
      {/* Header Halaman Utama dengan visual logo, avatar, notifikasi, dan keranjang */}
      <StickyHeader 
        title="Home" 
        variant="logo"
        size="lg"
        leftAction={
          <ProfilePicture
            src={profile?.avatar_url || undefined}
            size={64}
            className="border-[3px] border-white shadow-lg ml-1"
          />
        }
        rightAction={
          <div className="flex items-center gap-3 mr-1">
            <Link href="/notifications">
              <button className="relative p-1 hover:opacity-70 transition-opacity active:scale-90">
                <Icons.Notification size={32} className="text-accent" />
              </button>
            </Link>
            <Link href="/cart">
              <button className="p-1 hover:opacity-70 transition-opacity active:scale-90">
                <Icons.Cart size={32} className="text-accent" />
              </button>
            </Link>
          </div>
        }
      />

      {/* Slide banner promosi utama */}
      <motion.section 
        initial="hidden"
        animate="show"
        variants={fadeInVariants}
        className="px-6 flex justify-center pt-4"
      >
        <SlideCard 
          title="Promotion Card" 
          description="Promo spesial minggu ini untuk koleksi TCG!"
        />
      </motion.section>

      {/* Bagian input teks kolom pencarian produk */}
      <motion.section 
        variants={fadeInVariants}
        initial="hidden"
        animate="show"
        className="px-6 pt-6"
      >
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-text-sub/40 group-focus-within:text-primary transition-colors">
            <Icons.Search size={20} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kartu Pokemon, One Piece..."
            className="w-full h-14 bg-white rounded-[24px] pl-14 pr-6 text-[15px] font-bold text-text-main shadow-soft border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all placeholder:text-text-sub/30"
          />
        </div>
      </motion.section>

      {/* Slider menu daftar kategori kartu TCG */}
      <section className="pt-6">
        <CategoryList 
          onSelect={setSelectedCategory} 
          activeCategory={selectedCategory} 
        />
      </section>

      {/* Grid rendering list produk kartu TCG */}
      <section className="px-6 pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <motion.div 
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants} className="w-full flex justify-center">
                <ProductCard
                  title={product.title}
                  price={product.price}
                  condition={product.condition}
                  image={product.image || undefined}
                  href={buildProductDetailHref(product.id)}
                  isWishlisted={isFavorite(product.id)}
                  onWishlistToggle={() => {
                    // Proteksi autentikasi: Jika belum masuk akun, arahkan ke form login
                    if (isGuest || !user) {
                      router.push("/login");
                      return;
                    }
                    // Tambahkan atau hapus dari wishlist database
                    void toggleFavorite(product.id);
                  }}
                />
              </motion.div>
            ))}
            
            {/* Tampilan alternatif jika kategori/pencarian menghasilkan nol produk */}
            {filteredProducts.length === 0 && (
              <div className="col-span-2 py-10 text-center text-text-sub font-medium">
                Tidak ada produk
              </div>
            )}
          </motion.div>
        )}
      </section>
    </main>
  );
}

/**
 * Komponen Halaman Utama Home (HomePage)
 * Menggunakan React.Suspense untuk mengamankan proses SSR & Dynamic SearchParams Next.js
 */
export default function HomePage() {
  return (
    <React.Suspense fallback={<main className="flex-1 flex flex-col bg-background relative pb-40"></main>}>
      <HomeContent />
    </React.Suspense>
  );
}
