"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MessageCard } from "@/components/ui/MessageCard";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";
import { chatService } from "@/lib/services/chat";
import type { ChatContact } from "@/types";

/**
 * Halaman Utama Chat (MessagesPage)
 * Menampilkan seluruh daftar percakapan aktif yang dimiliki pengguna dengan para pembeli/penjual lain.
 * Menyediakan filter kategori pesan (Semua, Belum Dibaca, Diarsipkan) dan search bar.
 */
export default function MessagesPage() {
  // Mengambil state otentikasi global
  const { isGuest, user } = useAuth();

  // Mengambil helper bahasa (i18n)
  const { t } = useLanguage();

  // State pencarian kontak/isi pesan chat
  const [search, setSearch] = useState("");

  // State filter tab aktif (all | unread | archive)
  const [activeFilter, setActiveFilter] = useState("all");

  // State daftar kontak percakapan dari server
  const [messages, setMessages] = useState<ChatContact[]>([]);

  // State loading status pemuatan list chat
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Effect Hook untuk memuat seluruh daftar percakapan pengguna.
   * Dijalankan ketika status user berubah atau berhasil login.
   */
  useEffect(() => {
    if (!user || isGuest) return;

    const loadConversations = async () => {
      try {
        setIsLoading(true); // Aktifkan spinner memuat
        // Panggil endpoint chatService untuk mendapatkan baris-baris percakapan aktif
        const nextMessages = await chatService.listConversations(user.id);
        setMessages(nextMessages);
      } finally {
        setIsLoading(false); // Matikan spinner memuat
      }
    };

    void loadConversations();
  }, [isGuest, user]);

  /**
   * Filter daftar pesan secara dinamis (client-side) berdasarkan kolom pencarian
   * serta tab kategori filter yang dipilih (All / Unread / Archive).
   */
  const filteredMessages = useMemo(
    () =>
      messages.filter((message) => {
        // Cek kecocokan nama kontak atau potongan teks isi pesan terakhir
        const matchesSearch =
          message.name.toLowerCase().includes(search.toLowerCase()) ||
          message.msg.toLowerCase().includes(search.toLowerCase());
        
        // Cek kecocokan filter unread/arsip
        const matchesFilter =
          activeFilter === "all" ||
          (activeFilter === "unread" && message.unread > 0) ||
          (activeFilter === "archive" && false); // Untuk archive sementara dikembalikan false (belum diimplementasikan)
        
        return matchesSearch && matchesFilter;
      }),
    [activeFilter, messages, search]
  );

  // UI STATE 1: Proteksi guest/tamu, tampilkan form kosong login
  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-background">
        <StickyHeader title={t("messages")} variant="logo" size="lg" />
        <GuestEmptyState
          title={t("login_start_chat")}
          description={t("login_start_chat_desc")}
          icon={<Icons.Message size={48} />}
        />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-linear-to-b from-white relative pb-40">
      {/* Header utama atas */}
      <StickyHeader title={t("messages")} variant="logo" size="lg" />

      {/* Bagian input pencarian & tab filter */}
      <div className="sticky top-[140px] z-30 px-6 pt-6 pb-4 bg-linear-to-b from-white to-white/95 backdrop-blur-md">
        <div className="flex flex-col gap-6">
          {/* Kolom pencarian chat */}
          <Input
            placeholder={t("search_messages_or_store")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<Icons.Search size={23} />}
            className="bg-white/50 shadow-soft"
          />

          {/* Deretan Tombol Filter Kategori Chat */}
          <div className="flex gap-2">
            {[
              { key: "all", label: t("all") },
              { key: "unread", label: t("unread") },
              { key: "archive", label: t("archive") },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  "px-5 py-2 rounded-full text-[13px] font-bold transition-all",
                  activeFilter === filter.key
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white text-text-sub border border-surface-muted"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid List rendering percakapan chat */}
      <motion.div layout className="flex flex-col gap-4 px-6 pt-8">
        {/* Spinner memuat */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {/* List kontak chat dengan animasi spring */}
        <AnimatePresence mode="popLayout">
          {!isLoading &&
            filteredMessages.map((chat) => (
              <motion.div
                key={chat.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {/* Link langsung menuju rute chat room beserta ID percakapan */}
                <Link href={`/messages/room?conversationId=${chat.id}`}>
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

        {/* Tampilan kosong (Empty State) jika hasil filter nihil */}
        {!isLoading && filteredMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center text-text-sub/30 mb-4">
              <Icons.Message size={40} />
            </div>
            <p className="text-[14px] text-text-sub font-medium">
              {t("no_messages_found")}
            </p>
          </div>
        )}
      </motion.div>
    </main>
  );
}
