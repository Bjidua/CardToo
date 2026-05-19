"use client";

import React from "react";
import { Icons } from "@/components/ui/Icons";
import { ProfilePicture } from "@/components/ui/ProfilePicture";
import { motion } from "framer-motion";
import Image from "next/image";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { cn } from "@/lib/utils";
import { MenuListItem } from "@/components/ui/MenuListItem";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

/**
 * Halaman Profil Pengguna (ProfilePage)
 * Menampilkan detail ringkas pengguna (avatar, nama, email, role/badge seller).
 * Memiliki sub-menu pintasan pelacakan pesanan (Belum Bayar, Dikemas, Dikirim, Beri Ulasan).
 * Menyediakan list navigasi ke menu Wishlist Favorit, Dashboard Toko (jika seller), Form Buka Toko (jika pembeli biasa), serta Pengaturan.
 */
export default function ProfilePage() {
  const router = useRouter();

  // Status autentikasi global dan detail data profile database
  const { isGuest, isSeller, profile } = useAuth();

  // Helper pelokalan bahasa
  const { t } = useLanguage();

  /**
   * Effect Hook untuk mengamankan halaman profil.
   * Mengalihkan pengunjung yang belum login (guest) ke halaman login.
   */
  React.useEffect(() => {
    if (isGuest) {
      router.push("/login");
    }
  }, [isGuest, router]);

  // Hindari rendering kilasan halaman (flash screen) jika guest sebelum redirect selesai
  if (isGuest) return null;

  // Konfigurasi varian stagger animasi masuk untuk wrapper menu
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  } as const;

  // Konfigurasi transisi spring untuk setiap item menu profile
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  } as const;

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-linear-to-b from-white to-white/95 pb-32">
      {/* Header Halaman Utama */}
      <StickyHeader 
        title={t("profile")} 
        variant="logo" 
        size="lg"
      />

      {/* Bagian Banner Informasi User */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-5 mb-10 px-6"
      >
        <div className="relative pt-6">
          {/* Foto Profil Pengguna */}
          <ProfilePicture
            src={profile?.avatar_url || undefined}
            size={88}
            className="border-[5px] border-white shadow-soft"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-text-main leading-tight">
              {profile?.full_name || profile?.username || "User CardToo"}
            </h2>
            {/* Tampilkan badge khusus jika peran akun adalah penjual */}
            {isSeller && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                Seller
              </span>
            )}
          </div>
          <p className="text-[14px] font-medium text-text-sub">
            {profile?.email || "user@cardtoo.com"}
          </p>
        </div>
      </motion.div>

      {/* Kontainer Utama Daftar Menu */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 px-6"
      >
        {/* Card Ringkasan Status Transaksi Pesanan */}
        <motion.div variants={itemVariants} className="bg-white rounded-card p-5 shadow-soft border border-surface-muted">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[16px] font-bold text-text-main">{t("my_order")}</h3>
            <Link href="/orders" className="flex items-center gap-1 text-[13px] font-bold text-primary hover:opacity-60 transition-opacity uppercase tracking-wider">
              {t("order_history")}
              <Icons.ChevronRight size={14} />
            </Link>
          </div>

          {/* Grid Ikon Rute Status Belanja */}
          <div className="grid grid-cols-4 gap-2">
            <OrderStatusItem icon={<Icons.Wallet size={24} />} label={t("unpaid")} href="/orders?status=unpaid" />
            <OrderStatusItem icon={<Icons.Dikemas size={24} />} label={t("packed")} href="/orders?status=processing" />
            <OrderStatusItem icon={<Icons.Delivery size={24} />} label={t("shipped")} href="/orders?status=shipped" />
            <OrderStatusItem icon={<Icons.Review size={24} />} label={t("review")} href="/orders?status=review" />
          </div>
        </motion.div>

        {/* Card Daftar Navigasi Menu Fitur */}
        <motion.div variants={itemVariants} className="bg-white rounded-card overflow-hidden shadow-soft border border-surface-muted">
          <div className="flex flex-col">
            {/* Link ke Favorit */}
            <MenuListItem 
              icon={<Icons.Favorite size={20} />} 
              label={t("my_favorite")} 
              href="/profile/favorites"
              showBorder 
            />
            
            {/* Link Toko: Tampilkan Dashboard Toko jika sudah Seller, sebaliknya form registrasi jika masih Pembeli biasa */}
            {isSeller ? (
              <MenuListItem 
                icon={<Icons.Store size={20} />} 
                label={t("seller_dashboard")} 
                href="/seller/dashboard"
                showBorder 
              />
            ) : (
              <MenuListItem 
                icon={<Icons.Store size={20} />} 
                label={t("register_as_seller")} 
                href="/onboarding/seller"
                showBorder 
              />
            )}

            {/* Link ke Pengaturan Aplikasi */}
            <MenuListItem 
              icon={<Icons.Settings size={20} />} 
              label={t("setting")} 
              href="/profile/settings"
            />
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}

/**
 * Item Status Pesanan Individual (OrderStatusItem)
 * Shortcut visual untuk langsung menyaring daftar pesanan sesuai status tertentu di tab pesanan.
 */
function OrderStatusItem({ icon, label, href = "#" }: { icon: React.ReactNode; label: string; href?: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-3 hover:scale-105 transition-transform group">
      <div className="w-11 h-11 rounded-card bg-surface-hover flex items-center justify-center text-accent group-active:scale-95 transition-all">
        {icon}
      </div>
      <span className="text-center whitespace-nowrap text-[13px] font-medium text-text-main">
        {label}
      </span>
    </Link>
  );
}
