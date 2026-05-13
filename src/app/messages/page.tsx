"use client";

import React, { useState } from "react";
import { MessageCard } from "@/components/ui/MessageCard";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";

export default function MessagesPage() {
  const { isGuest } = useAuth();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");

  const dummyMessages: any[] = [];

  const filteredMessages = dummyMessages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.msg.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "Semua" || (activeFilter === "Belum Dibaca" && m.unread > 0);
    return matchesSearch && matchesFilter;
  });

  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-surface-tint">
        <StickyHeader title="Messages" variant="logo" size="lg" />
        <GuestEmptyState 
          title="Login untuk Mulai Obrolan" 
          description="Masuk atau daftar sekarang untuk bernegosiasi harga dan bertanya langsung ke penjual."
          icon={<Icons.Message size={48} />}
        />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-linear-to-b from-whit relative pb-40">
      <StickyHeader title="Messages" variant="logo" size="lg" />
      
      <div className="sticky top-[140px] z-30 px-6 pt-6 pb-4 bg-linear-to-b from-white to-white/95 backdrop-blur-md">
        <div className="flex flex-col gap-6">
          <Input 
            placeholder="Cari pesan atau toko..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<Icons.Search size={20} />}
            className="bg-white/50 backdrop-blur-sm shadow-soft"
          />

          <div className="flex gap-2">
            {["Semua", "Belum Dibaca", "Arsip"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-5 py-2 rounded-full text-[13px] font-bold transition-all",
                  activeFilter === filter 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-white text-black/40 border border-black/5"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div 
        layout
        className="flex flex-col gap-4 px-6 pt-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredMessages.map((chat) => (
            <motion.div 
              key={chat.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <Link href={`/messages/${chat.id}`}>
                <MessageCard
                  userName={chat.name}
                  message={chat.msg}
                  time={chat.time}
                  unreadCount={chat.unread}
                />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center text-black/10 mb-4">
              <Icons.Message size={40} />
            </div>
            <p className="text-[14px] text-black/30 font-medium">Tidak ada pesan ditemukan</p>
          </div>
        )}
      </motion.div>
    </main>
  );
}
