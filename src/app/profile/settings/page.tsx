"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { MenuListItem } from "@/components/ui/MenuListItem";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Halaman Pengaturan Utama (SettingsPage)
 * Dibungkus dengan ProtectedRoute agar hanya bisa diakses user terotentikasi.
 */
export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

/**
 * Komponen Konten Pengaturan (SettingsContent)
 * Menampilkan menu berjenjang i18n dinamis:
 * - Seksi Akun & Keamanan (Edit profile, alamat, pembayaran, password)
 * - Seksi Pengaturan Aplikasi (Toggle notifikasi, pilihan bahasa)
 * - Seksi Bantuan & Informasi (Pusat bantuan FAQ, kebijakan privasi, tentang CardToo)
 * - Aksi Logout (Keluar sesi)
 */
function SettingsContent() {
  // Service logout dari auth context global
  const { logout } = useAuth();

  // Membaca status bahasa aktif & helper translate i18n
  const { language, t } = useLanguage();

  // State toggle notifikasi push dinamis (client-side simulation)
  const [pushNotif, setPushNotif] = useState(true);

  // Varian stagger animasi masuk menu setting
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-white to-white/95">
      {/* Header Halaman */}
      <StickyHeader
        title={t("settings")}
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-8"
        >
          {/* Seksi: Akun & Keamanan */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[14px] font-bold text-text-sub uppercase tracking-wider px-2">{t("account_security")}</h3>
            <div className="bg-white rounded-card overflow-hidden shadow-soft border border-surface-muted">
              <MenuListItem icon={<Icons.Profile size={20} />} label={t("edit_profile")} href="/profile/edit" showBorder />
              <MenuListItem icon={<Icons.MapPin size={20} />} label={t("my_address")} href="/profile/address" showBorder />
              <MenuListItem icon={<Icons.Wallet size={20} />} label={t("bank_card")} href="/profile/payments" showBorder />
              <MenuListItem icon={<Icons.Lock size={20} />} label={t("security_password")} href="/profile/security" />
            </div>
          </div>

          {/* Seksi: Pengaturan Aplikasi */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[14px] font-bold text-text-sub uppercase tracking-wider px-2">{t("app_settings")}</h3>
            <div className="bg-white rounded-card overflow-hidden shadow-soft border border-surface-muted">
              {/* Toggle Notifikasi Push */}
              <div className="flex items-center justify-between p-5 border-b border-surface-muted">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-card bg-surface-hover flex items-center justify-center text-accent">
                    <Icons.Notification size={20} />
                  </div>
                  <span className="text-[16px] font-medium text-text-main">{t("notification")}</span>
                </div>
                <button 
                  onClick={() => setPushNotif(!pushNotif)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    pushNotif ? "bg-primary" : "bg-surface-hover"
                  )}
                >
                  {/* Handle toggle switch bergeser dengan framer motion */}
                  <motion.div 
                    animate={{ x: pushNotif ? 26 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
              {/* Navigasi Pilihan Bahasa */}
              <MenuListItem
                icon={<Icons.Search size={20} />}
                label={t("language")}
                href="/profile/language"
                subValue={language === "id" ? t("indonesia") : t("english")}
              />
            </div>
          </div>

          {/* Seksi: Bantuan & Informasi */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[14px] font-bold text-text-sub uppercase tracking-wider px-2">{t("help_info")}</h3>
            <div className="bg-white rounded-card overflow-hidden shadow-soft border border-surface-muted">
              <MenuListItem icon={<Icons.Help size={20} />} label={t("help_center")} href="/help" showBorder />
              <MenuListItem icon={<Icons.Privacy size={20} />} label={t("privacy_policy")} href="/privacy" showBorder />
              <MenuListItem icon={<Icons.Info size={20} />} label={t("about_cardtoo")} href="/about" />
            </div>
          </div>

          {/* Tombol Logout Sesi Akun */}
          <div className="pt-4">
            <Button 
              variant="danger" 
              startIcon={<Icons.Logout size={22} />}
              onClick={() => void logout()}
            >
              {t("logout")}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
