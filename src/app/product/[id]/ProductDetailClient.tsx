"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Accordion } from "@/components/ui/Accordion";
import { DetailBox } from "@/components/ui/DetailBox";
import { useRouter } from "next/navigation";

interface ProductDetailClientProps {
  id: string;
}

interface ProductDetail {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: string;
  stock: number;
  category: string;
  condition: string;
  images: string[];
  seller: {
    id: string;
    name: string;
    location: string;
    rating: string;
    isVerified: boolean;
  };
  grading: {
    grade: string;
    company: string;
  };
  cardDetails: {
    cardNumber: string;
    type: string;
    hp: string;
    series: string;
  };
  description: string[];
  shippingInfo: string;
}

const DUMMY_PRODUCTS: Record<string, ProductDetail> = {};

import { useAuth } from "@/context/AuthContext";

export default function ProductDetailClient({ id }: ProductDetailClientProps) {
  const router = useRouter();
  const { isGuest } = useAuth();
  const product = DUMMY_PRODUCTS[id];
  
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShareProduct, shareProduct] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("description");

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-surface-muted rounded-full flex items-center justify-center mb-6">
          <Icons.Search size={40} className="opacity-20" />
        </div>
        <h2 className="text-[18px] font-bold text-text-main">Produk Tidak Ditemukan</h2>
        <p className="text-[14px] text-text-sub mt-2 mb-8 max-w-[280px]">Maaf, produk yang Anda cari mungkin sudah dihapus atau tidak tersedia saat ini.</p>
        <button 
          onClick={() => router.push("/home")}
          className="px-10 h-14 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleAction = (action: () => void) => {
    if (isGuest) {
      router.push("/login");
    } else {
      action();
    }
  };

  const handleAddToCart = () => handleAction(() => router.push("/cart"));
  const handleChat = () => handleAction(() => router.push(`/messages/${product.seller.id}`));
  const handleBuyNow = () => handleAction(() => router.push("/checkout"));

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <StickyHeader
        title="Detail Produk"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
        rightAction={
          <div className="flex gap-3">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90",
                isFavorite ? "bg-secondary/10 text-secondary" : "bg-white text-black/60 shadow-soft border border-surface-muted"
              )}
            >
              <Icons.Favorite size={20} active={isFavorite} />
            </button>
            <button 
              onClick={() => shareProduct(!isShareProduct)}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90",
                isShareProduct ? "bg-secondary/10 text-secondary" : "bg-white text-black/60 shadow-soft border border-surface-muted"
              )}
            >
              <Icons.Share size={20} />
            </button>
          </div>
        }
      />

      <main className="flex-1 pb-40">
        {/* Product Image Carousel */}
        <div className="relative w-full aspect-square bg-surface-muted overflow-hidden">
          <motion.div 
            className="flex h-full"
            animate={{ x: `-${currentImage * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {product.images.map((img, index) => (
              <div key={index} className="w-full h-full shrink-0 relative">
                <Image 
                  src={img} 
                  alt={`Product Image ${index + 1}`} 
                  fill 
                  className="object-cover"
                />
              </div>
            ))}
          </motion.div>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  currentImage === index ? "w-6 bg-primary" : "w-1.5 bg-black/20"
                )}
              />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[20px] font-bold text-text-main leading-snug">
              {product.title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[24px] font-black text-primary">
                {formatPrice(product.price)}
              </span>
              <span className="text-[14px] text-text-sub line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="px-2 py-1 bg-danger/10 text-danger text-[10px] font-bold rounded-lg uppercase">
                {product.discount}
              </span>
            </div>
            <p className="text-[12px] text-text-sub font-medium">Tersisa {product.stock} pcs</p>
          </div>

          <div className="h-px bg-surface-muted w-full my-2" />

          {/* Seller Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative overflow-hidden">
                <Icons.Store size={24} />
                <div className="absolute top-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
              </div>
              <div 
                className="flex flex-col cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => router.push(`/store/${product.seller.id}`)}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-text-main leading-tight">{product.seller.name}</span>
                  {product.seller.isVerified && (
                    <div className="bg-success/10 text-success p-0.5 rounded-full">
                      <Icons.Plus size={10} className="rotate-45" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-text-sub">
                  <Icons.MapPin size={12} />
                  <span>{product.seller.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-surface-muted px-3 py-1.5 rounded-xl">
              <Icons.Review size={14} className="text-warning fill-warning" />
              <span className="text-[13px] font-bold text-text-main">{product.seller.rating}</span>
            </div>
          </div>

          {/* Grading Details Section */}
          <div className="mt-4 p-5 rounded-3xl bg-surface-tint border border-surface-muted">
            <h3 className="text-[14px] font-bold text-text-main mb-4 uppercase tracking-wider">Grading Details</h3>
            <div className="flex flex-wrap gap-2">
              <div className="px-4 py-2 bg-white rounded-2xl border border-surface-muted shadow-soft flex items-center gap-2">
                <span className="text-[11px] text-text-sub font-medium">Grade:</span>
                <span className="text-[12px] font-black text-primary">{product.grading.grade}</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-2xl border border-surface-muted shadow-soft flex items-center gap-2">
                <span className="text-[11px] text-text-sub font-medium">Company:</span>
                <span className="text-[12px] font-black text-text-main">{product.grading.company}</span>
              </div>
            </div>
          </div>

          {/* Card Details Grid */}
          <div className="mt-2 flex flex-col gap-3">
            <h3 className="text-[14px] font-bold text-text-main uppercase tracking-wider px-2">Card Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailBox label="Card Number" value={product.cardDetails.cardNumber} />
              <DetailBox label="Type" value={product.cardDetails.type} />
              <DetailBox label="HP" value={product.cardDetails.hp} />
              <DetailBox label="Series" value={product.cardDetails.series} />
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="mt-4 flex flex-col gap-3">
            <Accordion 
              title="Description" 
              isOpen={expandedSection === "description"} 
              onToggle={() => toggleSection("description")}
            >
              <div className="text-[14px] text-text-sub leading-relaxed flex flex-col gap-3">
                {product.description.map((desc, i) => (
                  <p key={i}>{desc}</p>
                ))}
              </div>
            </Accordion>

            <Accordion 
              title="Shipping & Returns" 
              isOpen={expandedSection === "shipping"} 
              onToggle={() => toggleSection("shipping")}
            >
              <div className="text-[14px] text-text-sub leading-relaxed">
                <p>{product.shippingInfo}</p>
              </div>
            </Accordion>
          </div>

          {/* Customer Reviews Section */}
          <div className="mt-8 flex flex-col gap-5">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[14px] font-black text-text-main uppercase tracking-widest">Ulasan Pembeli</h3>
              <div className="flex items-center gap-1.5 bg-surface-muted px-3 py-1 rounded-full">
                <Icons.Review size={14} className="text-warning fill-warning" />
                <span className="text-[13px] font-bold text-text-main">0.0/5.0</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-10 bg-surface-tint rounded-[32px] border border-dashed border-surface-muted text-text-sub">
              <p className="text-[13px] font-bold">Belum ada ulasan</p>
              <p className="text-[11px]">Jadilah yang pertama mengulas produk ini!</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white/80 backdrop-blur-xl border-t border-surface-muted p-5 flex items-center gap-4 z-50">
        <button 
          onClick={handleChat}
          className="w-14 h-14 rounded-2xl bg-surface-muted flex items-center justify-center text-text-main active:scale-90 transition-transform"
        >
          <Icons.Message size={24} />
        </button>
        <button 
          onClick={handleAddToCart}
          className="flex-1 h-14 rounded-2xl border-2 border-primary text-primary font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <Icons.Cart size={20} />
          <span>Add to Cart</span>
        </button>
        <button 
          onClick={handleBuyNow}
          className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
