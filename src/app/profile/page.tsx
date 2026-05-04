"use client";

import React from "react";
import { Icons } from "@/components/ui/Icons";
import { ProfilePicture } from "@/components/ui/ProfilePicture";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
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
    <main className="flex-1 flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-[#F6DFFF] px-6 pb-32">
      {/* STICKY HEADER AREA */}
      <div className="sticky top-0 z-40 w-full h-[140px] flex items-end justify-center pb-4 overflow-hidden">
        {/* Background Accent Logo inside Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-[-45%] left-[-12%] w-[110%] h-[150%] pointer-events-none z-0"
        >
          <Image 
            src="/assets/BackgroundLogo.svg" 
            alt="Header Background" 
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Premium Blur Background */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md border-b border-black/5 pointer-events-none z-[-1]" />
        
        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative z-10 text-[24px] font-bold text-black tracking-tight"
        >
          Profile
        </motion.h1>
      </div>

      {/* User Info Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-5 mb-10"
      >
        <div className="relative">
          <ProfilePicture size={88} className="border-[5px] border-white shadow-soft" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[20px] font-bold text-black leading-tight">CanTika</h2>
          <p className="text-[14px] text-black/60 font-medium">cantika33@gmail.com</p>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6"
      >
        {/* My Order Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-card p-5 shadow-soft">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[16px] font-bold text-black">My Order</h3>
            <button className="flex items-center gap-1 text-[16px] font-medium text-black/80 hover:opacity-60 transition-opacity">
              Order history
              <Icons.ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <OrderStatusItem icon={<Icons.Wallet size={24} />} label="Belum bayar" />
            <OrderStatusItem icon={<Icons.Dikemas size={24} />} label="Dikemas" />
            <OrderStatusItem icon={<Icons.Delivery size={24} />} label="Dikirim" />
            <OrderStatusItem icon={<Icons.Review size={24} />} label="Penilaian" />
          </div>
        </motion.div>

        {/* Menu List Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-card overflow-hidden shadow-soft">
          <div className="flex flex-col">
            <MenuListItem 
              icon={<Icons.History size={20} />} 
              label="My Activity" 
              showBorder 
            />
            <MenuListItem 
              icon={<Icons.Store size={20} />} 
              label="Register as Seller" 
              showBorder 
            />
            <MenuListItem 
              icon={<Icons.Settings size={20} />} 
              label="Setting" 
              showBorder 
            />
            <MenuListItem 
              icon={<Icons.Favorite size={20} />} 
              label="My Favorite" 
            />
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}

// Sub-components for cleaner code
function OrderStatusItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center gap-3 hover:scale-105 transition-transform">
      <div className="w-11 h-11 rounded-card bg-surface-hover flex items-center justify-center text-accent">
        {icon}
      </div>
      <span className="text-[13px] font-medium text-black text-center whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

function MenuListItem({ 
  icon, 
  label, 
  showBorder = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  showBorder?: boolean;
}) {
  return (
    <button 
      className={cn(
        "flex items-center justify-between p-5 hover:bg-black/2 transition-colors group",
        showBorder && "border-b border-black/5"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-card bg-surface-hover flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-[16px] font-medium text-black">{label}</span>
      </div>
      <Icons.ChevronRight size={18} className="text-black/40 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
