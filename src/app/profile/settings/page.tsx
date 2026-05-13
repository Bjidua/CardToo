"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { MenuListItem } from "@/components/ui/MenuListItem";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [pushNotif, setPushNotif] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-white to-white/95">
      <StickyHeader
        title="Settings"
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
          {/* Section: Account & Security */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[14px] font-bold text-black/40 uppercase tracking-wider px-2">Akun & Keamanan</h3>
            <div className="bg-white rounded-card overflow-hidden shadow-soft border border-black/5">
              <MenuListItem icon={<Icons.Profile size={20} />} label="Edit Profil" href="/profile/edit" showBorder />
              <MenuListItem icon={<Icons.MapPin size={20} />} label="Alamat Saya" href="/profile/address" showBorder />
              <MenuListItem icon={<Icons.Wallet size={20} />} label="Rekening Bank / Kartu" href="/profile/payments" showBorder />
              <MenuListItem icon={<Icons.Lock size={20} />} label="Keamanan & Password" href="/profile/security" />
            </div>
          </div>

          {/* Section: Settings */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[14px] font-bold text-black/40 uppercase tracking-wider px-2">Pengaturan</h3>
            <div className="bg-white rounded-card overflow-hidden shadow-soft border border-black/5">
              <div className="flex items-center justify-between p-5 border-b border-black/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-card bg-surface-hover flex items-center justify-center text-accent">
                    <Icons.Notification size={20} />
                  </div>
                  <span className="text-[16px] font-medium text-black">Notifikasi</span>
                </div>
                <button 
                  onClick={() => setPushNotif(!pushNotif)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    pushNotif ? "bg-primary" : "bg-black/10"
                  )}
                >
                  <motion.div 
                    animate={{ x: pushNotif ? 26 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
              <MenuListItem icon={<Icons.Search size={20} />} label="Bahasa" href="/profile/language" subValue="Indonesia" />
            </div>
          </div>

          {/* Section: Support */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[14px] font-bold text-black/40 uppercase tracking-wider px-2">Bantuan & Info</h3>
            <div className="bg-white rounded-card overflow-hidden shadow-soft border border-black/5">
              <MenuListItem icon={<Icons.Help size={20} />} label="Pusat Bantuan" href="/help" showBorder />
              <MenuListItem icon={<Icons.Privacy size={20} />} label="Kebijakan Privasi" href="/privacy" showBorder />
              <MenuListItem icon={<Icons.Info size={20} />} label="Tentang CardToo" href="/about" />
            </div>
          </div>

          {/* Logout Action using Template Button */}
          <div className="pt-4">
            <Button 
              variant="danger" 
              startIcon={<Icons.Logout size={22} />}
              onClick={() => console.log("Logout clicked")}
            >
              Logout
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
