"use client";

import React, { useEffect, useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { NotificationCard } from "@/components/ui/NotificationCard";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";
import { notificationService } from "@/lib/services/notification";
import type { NotificationGroup, NotificationItem } from "@/types";

export default function NotificationsPage() {
  const router = useRouter();
  const { isGuest, user } = useAuth();
  const [groups, setGroups] = useState<NotificationGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (!user || isGuest) return;

    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        const nextGroups = await notificationService.listNotificationGroups(user.id);
        setGroups(nextGroups);
      } finally {
        setIsLoading(false);
      }
    };

    void loadNotifications();
  }, [isGuest, user]);

  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-white">
        <StickyHeader
          title="Notifikasi"
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="primary" />}
        />
        <GuestEmptyState
          title="Login untuk Lihat Notifikasi"
          description="Kabar terbaru soal pesanan, chat, dan aktivitas akun akan muncul setelah kamu masuk."
          icon={<Icons.History size={48} className="opacity-20" />}
        />
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-white pb-20">
      <StickyHeader
        title="Notifikasi"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : groups.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8"
          >
            {groups.map((group) => (
              <div key={group.group} className="flex flex-col gap-4">
                <h2 className="text-[14px] font-bold text-text-sub uppercase tracking-widest px-2">
                  {group.group}
                </h2>
                <div className="flex flex-col gap-3">
                  {group.items.map((item: NotificationItem) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <NotificationCard
                        label={item.label}
                        title={item.title}
                        description={item.description}
                        time={item.time}
                        type={item.type}
                        isRead={item.read}
                        onClick={() => {
                          void notificationService.markAsRead(item.id);
                          if (item.actionUrl) {
                            router.push(item.actionUrl);
                          }
                        }}
                      />
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
