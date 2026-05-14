"use client";

import React from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { NotificationCard } from "@/components/ui/NotificationCard";
import { motion } from "framer-motion";
import type { NotificationGroup, NotificationItem } from "@/types";

const NOTIFICATIONS_DATA: NotificationGroup[] = [];

export default function NotificationsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-white pb-20">
      <StickyHeader
        title="Notifikasi"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6">
        {NOTIFICATIONS_DATA.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8"
          >
            {NOTIFICATIONS_DATA.map((group) => (
              <div key={group.group} className="flex flex-col gap-4">
                <h2 className="text-[14px] font-bold text-text-sub uppercase tracking-widest px-2">
                  {group.group}
                </h2>
                <div className="flex flex-col gap-3">
                  {group.items.map((item: NotificationItem) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <NotificationCard {...item} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-text-sub">
            <div className="w-20 h-20 bg-surface-muted rounded-full flex items-center justify-center mb-4">
              <Icons.History size={40} className="opacity-20" />
            </div>
            <p className="text-[14px] font-bold text-text-main">Belum ada notifikasi</p>
            <p className="text-[12px]">Semua kabar terbaru akan muncul di sini.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Dummy Icons for empty state
const Icons = {
  History: ({ size, className }: { size: number; className?: string }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  ),
};
