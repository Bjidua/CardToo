"use client";

import React, { useMemo, useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { Accordion } from "@/components/ui/Accordion";
import { DetailBox } from "@/components/ui/DetailBox";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cartService } from "@/lib/services/cart";
import { normalizeProductCondition } from "@/lib/services/product";
import { productService } from "@/lib/services/product";
import { reviewService } from "@/lib/services/review";
import { storeService } from "@/lib/services/store";
import { useFavorites } from "@/hooks/useFavorites";
import { buildStoreDetailHref } from "@/lib/routes";
import type { Product, ReviewSummary, Store } from "@/types";

interface ProductDetailClientProps {
  id: string; // ID unik produk
}

/**
 * Komponen Client Detail Produk (ProductDetailClient)
 * Menampilkan informasi lengkap kartu TCG:
 * - Slider galeri gambar produk
 * - Nama, harga, status stok, serta badge kondisi (Mint, Near Mint, dll)
 * - Rincian profil toko penjual dan lokasi pengiriman
 * - Detail grading & deskripsi dalam bentuk Accordion
 * - Ulasan/ulasan pembeli lain dengan rating bintang rata-rata
 * - Aksi bawah: Chat penjual, Add to Cart (Tambah ke keranjang), dan Buy Now (Beli sekarang)
 */
export default function ProductDetailClient({ id }: ProductDetailClientProps) {
  const router = useRouter();

  // Status login user aktif
  const { isGuest, user } = useAuth();

  // State penyimpan data produk
  const [product, setProduct] = React.useState<Product | null>(null);

  // State penyimpan detail toko pemilik produk
  const [store, setStore] = React.useState<Store | null>(null);

  // State rangkuman review pembeli produk ini
  const [reviewSummary, setReviewSummary] = React.useState<ReviewSummary | null>(null);

  // State loading status pemuatan data awal
  const [isLoading, setIsLoading] = React.useState(true);

  // State loading status penambahan ke keranjang belanja
  const [isSubmittingCart, setIsSubmittingCart] = React.useState(false);

  // State indeks gambar galeri aktif yang tampil di layar
  const [currentImage, setCurrentImage] = useState(0);

  // State toggle berbagi link produk (simulasi)
  const [isShareProduct, shareProduct] = useState(false);

  // State penunjuk panel Accordion yang sedang terbuka (default: deskripsi)
  const [expandedSection, setExpandedSection] = useState<string | null>("description");

  // Custom hook pembantu sinkronisasi wishlist/favorit produk
  const { isFavorite, toggleFavorite } = useFavorites(user?.id);

  /**
   * Effect Hook untuk memuat seluruh info detail produk beserta toko & review-nya.
   * Dijalankan setiap kali ID produk berubah.
   */
  React.useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true); // Aktifkan spinner memuat
        
        // Panggil service mengambil data produk
        const nextProduct = await productService.getProductById(id);
        setProduct(nextProduct);

        // Jika produk valid & memiliki relasi toko, load data toko & review pembeli secara paralel
        if (nextProduct?.storeId) {
          const [nextStore, nextSummary] = await Promise.all([
            storeService.getStoreById(nextProduct.storeId),
            reviewService.getProductReviewSummary(nextProduct.id),
          ]);
          setStore(nextStore);
          setReviewSummary(nextSummary);
        } else {
          setStore(null);
          setReviewSummary(null);
        }
      } finally {
        setIsLoading(false); // Matikan spinner memuat
      }
    };

    void loadProduct();
  }, [id]);

  /**
   * Menggabungkan gambar utama dengan array galeri tambahan produk.
   * Menghilangkan URL duplikat atau nilai null.
   */
  const productImages = useMemo(() => {
    if (!product) return [];

    const merged = [product.image, ...(product.gallery || [])].filter(Boolean) as string[];
    return merged.length > 0 ? Array.from(new Set(merged)) : [];
  }, [product]);

  // Mendeteksi apakah produk yang dilihat adalah milik toko user yang login
  const isOwnProduct = Boolean(
    user && store?.ownerUserId && user.id === store.ownerUserId
  );

  // UI STATE 1: Spinner memuat data awal
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // UI STATE 2: Penanganan jika produk tidak ada di database
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-surface-muted rounded-full flex items-center justify-center mb-6">
          <Icons.Search size={40} className="opacity-20" />
        </div>
        <h2 className="text-[18px] font-bold text-text-main">Produk Tidak Ditemukan</h2>
        <p className="text-[14px] text-text-sub mt-2 mb-8 max-w-[280px]">
          Maaf, produk yang Anda cari mungkin sudah dihapus atau tidak tersedia saat ini.
        </p>
        <button
          onClick={() => router.push("/home")}
          className="px-10 h-14 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  /**
   * Helper pemformat nominal angka menjadi mata uang rupiah (IDR).
   */
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  // Simulasi coret harga diskon (+10% dari harga asli)
  const comparePrice = Math.round(product.price * 1.1);

  /**
   * Mengatur buka-tutup panel accordion detail spesifikasi
   */
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  /**
   * Menjaga alur interaksi yang butuh otentikasi login.
   * Jika tamu, lempar ke halaman masuk (/login).
   */
  const handleAction = (action: () => void) => {
    if (isGuest) {
      router.push("/login");
    } else {
      action();
    }
  };

  // Toggle wishlist favorit produk
  const handleFavoriteToggle = () =>
    handleAction(() => {
      if (!user) return;
      void toggleFavorite(id);
    });

  /**
   * Logic utama menambahkan produk ke keranjang belanja global.
   * Mendukung mode:
   * - "cart": ditambahkan ke keranjang biasa lalu pindah ke halaman keranjang
   * - "checkout": keranjang dibersihkan untuk produk lain, set item terpilih, lalu langsung checkout
   */
  const addCurrentProductToCart = async (mode: "cart" | "checkout") => {
    if (!user || !product || !store) {
      throw new Error("Produk atau data toko belum siap.");
    }

    // Mencegah eksploitasi pembelian produk sendiri
    if (store.ownerUserId === user.id) {
      throw new Error("Anda tidak bisa membeli produk dari toko Anda sendiri.");
    }

    const normalizedCondition = normalizeProductCondition(product.condition || "Mint");
    if (!normalizedCondition) {
      throw new Error("Kondisi produk belum valid.");
    }

    setIsSubmittingCart(true); // Aktifkan loading tombol aksi
    try {
      const payload = {
        productId: product.id,
        sellerUserId: store.ownerUserId || "",
        storeId: store.id,
        productTitle: product.title,
        productImageUrl: product.image || null,
        storeName: store.name,
        condition: normalizedCondition,
        price: product.price,
        quantity: 1,
        isSelected: true,
      };

      if (mode === "checkout") {
        // Hapus pilihan item lain, pilih item ini saja untuk langsung bayar
        await cartService.selectOnlyItem(user.id, payload);
        router.push("/checkout");
      } else {
        // Masukkan item ke keranjang belanja
        await cartService.addItem(user.id, payload);
        router.push("/cart");
      }
    } finally {
      setIsSubmittingCart(false); // Matikan loading tombol
    }
  };

  // Tombol aksi tambah ke keranjang
  const handleAddToCart = () =>
    handleAction(() => {
      void addCurrentProductToCart("cart");
    });

  // Hubungi penjual (mengalihkan ke room chat)
  const handleChat = () =>
    handleAction(() => {
      if (!store?.ownerUserId || !store?.id) {
        return;
      }
      if (user?.id && store.ownerUserId === user.id) {
        return;
      }
      router.push(
        `/messages/room?sellerId=${encodeURIComponent(
          store.ownerUserId
        )}&storeId=${encodeURIComponent(store.id)}`
      );
    });

  // Tombol beli langsung
  const handleBuyNow = () =>
    handleAction(() => {
      void addCurrentProductToCart("checkout");
    });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Halaman Utama */}
      <StickyHeader
        title="Detail Produk"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
        rightAction={
          <div className="flex gap-3">
            {/* Tombol Favorit Wishlist */}
            <button
              onClick={handleFavoriteToggle}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90",
                isFavorite(id)
                  ? "bg-secondary/10 text-secondary"
                  : "bg-white text-text-sub shadow-soft border border-surface-muted"
              )}
            >
              <Icons.Favorite size={20} active={isFavorite(id)} />
            </button>
            
            {/* Tombol Share */}
            <button
              onClick={() => shareProduct(!isShareProduct)}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90",
                isShareProduct
                  ? "bg-secondary/10 text-secondary"
                  : "bg-white text-text-sub shadow-soft border border-surface-muted"
              )}
            >
              <Icons.Share size={20} />
            </button>
          </div>
        }
      />

      <main className="flex-1 pb-40">
        {/* Slider Gambar Produk dengan Framer Motion */}
        <div className="relative w-full aspect-square bg-surface-muted overflow-hidden">
          {productImages.length > 0 ? (
            <>
              <motion.div
                className="flex h-full"
                animate={{ x: `-${currentImage * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {productImages.map((imageUrl, index) => (
                  <div key={imageUrl} className="w-full h-full shrink-0 relative">
                    <Image
                      src={imageUrl}
                      alt={`Product Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </motion.div>
              {/* Indikator Slider Dot Bawah */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {productImages.map((imageUrl, index) => (
                  <button
                    key={imageUrl}
                    onClick={() => setCurrentImage(index)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      currentImage === index ? "w-6 bg-primary" : "w-1.5 bg-surface-hover"
                    )}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-sub/30 font-bold uppercase">
              No Image
            </div>
          )}
        </div>

        {/* Informasi Utama Produk */}
        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[20px] font-bold text-text-main leading-snug">
              {product.title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[24px] font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              <span className="text-[14px] text-text-sub line-through">
                {formatPrice(comparePrice)}
              </span>
              <span className="px-2 py-1 bg-danger/10 text-danger text-[10px] font-bold rounded-lg uppercase">
                Ready
              </span>
            </div>
            <p className="text-[12px] text-text-sub font-medium">
              Tersisa {product.stock || 0} pcs
            </p>
          </div>

          <div className="h-px bg-surface-muted w-full my-2" />

          {/* Profil Toko Penjual */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative overflow-hidden">
                <Icons.Store size={24} />
                <div className="absolute top-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
              </div>
              <div
                className="flex flex-col cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() =>
                  product.storeId && router.push(buildStoreDetailHref(product.storeId))
                }
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-text-main leading-tight">
                    {store?.name || "Toko CardToo"}
                  </span>
                  {store?.isVerified && (
                    <div className="bg-success/10 text-success p-0.5 rounded-full">
                      <Icons.Plus size={10} className="rotate-45" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-text-sub">
                  <Icons.MapPin size={12} />
                  <span>{store?.location || "Indonesia"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-surface-muted px-3 py-1.5 rounded-xl">
              <Icons.Review size={14} className="text-warning fill-warning" />
              <span className="text-[13px] font-bold text-text-main">
                {store?.rating || "0.0"}
              </span>
            </div>
          </div>

          {/* Grading Box */}
          <div className="mt-4 p-5 rounded-3xl bg-surface-tint border border-surface-muted">
            <h3 className="text-[14px] font-bold text-text-main mb-4 uppercase tracking-wider">
              Grading Details
            </h3>
            <div className="flex flex-wrap gap-2">
              <div className="px-4 py-2 bg-white rounded-2xl border border-surface-muted shadow-soft flex items-center gap-2">
                <span className="text-[11px] text-text-sub font-medium">Condition:</span>
                <span className="text-[12px] font-bold text-primary">
                  {product.condition || "Mint"}
                </span>
              </div>
              <div className="px-4 py-2 bg-white rounded-2xl border border-surface-muted shadow-soft flex items-center gap-2">
                <span className="text-[11px] text-text-sub font-medium">Category:</span>
                <span className="text-[12px] font-bold text-text-main">
                  {product.category || "Other"}
                </span>
              </div>
            </div>
          </div>

          {/* Peringatan kepemilikan produk sendiri */}
          {isOwnProduct && (
            <div className="rounded-[28px] border border-warning/20 bg-warning/8 px-4 py-3 text-[12px] font-medium text-warning">
              Produk ini milik toko Anda sendiri. Untuk menjaga flow marketplace tetap wajar,
              pembelian dari toko sendiri dinonaktifkan.
            </div>
          )}

          {/* Detail Metadata Kartu */}
          <div className="mt-2 flex flex-col gap-3">
            <h3 className="text-[14px] font-bold text-text-main uppercase tracking-wider px-2">
              Card Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailBox label="Product ID" value={product.id} />
              <DetailBox label="Slug" value={product.slug || "-"} />
              <DetailBox label="Stock" value={String(product.stock || 0)} />
              <DetailBox label="Status" value={product.status || "published"} />
            </div>
          </div>

          {/* Accordion Detail deskripsi & pengiriman */}
          <div className="mt-4 flex flex-col gap-3">
            <Accordion
              title="Description"
              isOpen={expandedSection === "description"}
              onToggle={() => toggleSection("description")}
            >
              <div className="text-[14px] text-text-sub leading-relaxed flex flex-col gap-3">
                <p>{product.description || "Belum ada deskripsi produk."}</p>
              </div>
            </Accordion>

            <Accordion
              title="Shipping & Returns"
              isOpen={expandedSection === "shipping"}
              onToggle={() => toggleSection("shipping")}
            >
              <div className="text-[14px] text-text-sub leading-relaxed">
                <p>
                  Pengiriman dilakukan setelah pembayaran terkonfirmasi. Seller akan
                  memperbarui stok dan proses pengemasan langsung dari dashboard toko.
                </p>
              </div>
            </Accordion>
          </div>

          {/* Riwayat Ulasan Pembeli */}
          <div className="mt-8 flex flex-col gap-5">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[14px] font-bold text-text-main uppercase tracking-widest">
                Ulasan Pembeli
              </h3>
              <div className="flex items-center gap-1.5 bg-surface-muted px-3 py-1 rounded-full">
                <Icons.Review size={14} className="text-warning fill-warning" />
                <span className="text-[13px] font-bold text-text-main">
                  {(reviewSummary?.averageRating || 0).toFixed(1)}/5.0
                </span>
              </div>
            </div>

            {/* List Review atau state kosong */}
            {reviewSummary && reviewSummary.totalReviews > 0 ? (
              <div className="flex flex-col gap-4">
                {reviewSummary.reviews.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface-tint rounded-[28px] border border-surface-muted p-5 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[12px] font-bold text-text-main">Pembeli CardToo</span>
                      <span className="text-[11px] text-text-sub">
                        {new Date(item.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    {/* Bintang Penilaian review */}
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
              <div className="flex flex-col items-center justify-center py-10 bg-surface-tint rounded-[32px] border border-dashed border-surface-muted text-text-sub">
                <p className="text-[13px] font-bold">Belum ada ulasan</p>
                <p className="text-[11px]">Jadilah yang pertama mengulas produk ini!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bar Menu Navigasi Aksi Bawah */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white/80 backdrop-blur-xl border-t border-surface-muted p-5 flex items-center gap-4 z-50">
        {/* Tombol Chat */}
        <button
          onClick={handleChat}
          className="w-14 h-14 rounded-2xl bg-surface-muted flex items-center justify-center text-text-main active:scale-90 transition-transform"
        >
          <Icons.Message size={24} />
        </button>
        
        {/* Tombol Tambah ke Keranjang */}
        <button
          onClick={handleAddToCart}
          disabled={isSubmittingCart || isOwnProduct}
          className="flex-1 h-14 rounded-2xl border-2 border-primary text-primary font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <Icons.Cart size={20} />
          <span>Add to Cart</span>
        </button>
        
        {/* Tombol Beli Sekarang */}
        <button
          onClick={handleBuyNow}
          disabled={isSubmittingCart || isOwnProduct}
          className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
