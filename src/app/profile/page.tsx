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
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { isGuest, isSeller, profile } = useAuth();

  React.useEffect(() => {
    if (isGuest) {
      router.push("/login");
    }
  }, [isGuest, router]);

  if (isGuest) return null; // Avoid rendering flash before redirect

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  } as const;

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
      {/* STICKY HEADER AREA */}
      <StickyHeader 
        title="Profile" 
        variant="logo" 
        size="lg"
      />

      {/* User Info Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-5 mb-10 px-6"
      >
        <div className="relative pt-6">
          <ProfilePicture size={88} className="border-[5px] border-white shadow-soft" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-text-main leading-tight">
              {profile?.full_name || profile?.username || "User CardToo"}
            </h2>
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

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 px-6"
      >
        {/* My Order Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-card p-5 shadow-soft border border-surface-muted">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[16px] font-bold text-text-main">My Order</h3>
            <Link href="/orders" className="flex items-center gap-1 text-[13px] font-bold text-primary hover:opacity-60 transition-opacity uppercase tracking-wider">
              Order history
              <Icons.ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <OrderStatusItem icon={<Icons.Wallet size={24} />} label="Belum bayar" href="/orders?status=unpaid" />
            <OrderStatusItem icon={<Icons.Dikemas size={24} />} label="Dikemas" href="/orders?status=processing" />
            <OrderStatusItem icon={<Icons.Delivery size={24} />} label="Dikirim" href="/orders?status=shipped" />
            <OrderStatusItem icon={<Icons.Review size={24} />} label="Penilaian" href="/orders?status=review" />
          </div>
        </motion.div>

        {/* Menu List Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-card overflow-hidden shadow-soft border border-surface-muted">
          <div className="flex flex-col">
            <MenuListItem 
              icon={<Icons.Favorite size={20} />} 
              label="My Favorite" 
              href="/profile/favorites"
              showBorder 
            />
            
            {isSeller ? (
              <MenuListItem 
                icon={<Icons.Store size={20} />} 
                label="Dashboard Seller" 
                href="/seller/dashboard"
                showBorder 
              />
            ) : (
              <MenuListItem 
                icon={<Icons.Store size={20} />} 
                label="Register as Seller" 
                href="/onboarding/seller"
                showBorder 
              />
            )}

            <MenuListItem 
              icon={<Icons.Settings size={20} />} 
              label="Setting" 
              href="/profile/settings"
            />
          </div>
        </motion.div>
        
      </motion.div>
    </main>
  );
}


function OrderStatusItem({ icon, label, href = "#" }: { icon: React.ReactNode; label: string; href?: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-3 hover:scale-105 transition-transform group">
      <div className="w-11 h-11 rounded-card bg-surface-hover flex items-center justify-center text-accent group-active:scale-95 transition-all">
        {icon}
      </div>
      <span className="text-[13px] font-medium text-black text-center whitespace-nowrap">
        {label}
      </span>
    </Link>
  );
}
