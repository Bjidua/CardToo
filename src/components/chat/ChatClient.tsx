"use client";

import React, { useEffect, useRef, useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";
import { chatService } from "@/lib/services/chat";
import type { ChatMessage } from "@/types";

interface ChatClientProps {
  conversationId?: string;
  sellerId?: string;
  storeId?: string;
}

export default function ChatClient({
  conversationId,
  sellerId,
  storeId,
}: ChatClientProps) {
  const { user, isGuest } = useAuth();
  const [roomId, setRoomId] = useState(conversationId || "");
  const [roomName, setRoomName] = useState("Chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || isGuest) return;

    const initializeRoom = async () => {
      try {
        setIsLoading(true);

        let nextConversationId = conversationId || "";

        if (!nextConversationId && sellerId && storeId) {
          const conversation = await chatService.getOrCreateConversation({
            buyerUserId: user.id,
            sellerUserId: sellerId,
            storeId,
          });
          nextConversationId = conversation.$id;
        }

        if (!nextConversationId) {
          setMessages([]);
          setRoomName("Chat");
          return;
        }

        const room = await chatService.getConversationRoom(user.id, nextConversationId);
        if (!room) {
          setMessages([]);
          setRoomName("Chat");
          return;
        }

        setRoomId(room.id);
        setRoomName(room.name);
        setMessages(room.messages);
        await chatService.markConversationAsRead(user.id, room.id);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeRoom();
  }, [conversationId, isGuest, sellerId, storeId, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!user || !roomId || !input.trim()) return;

    try {
      setIsSending(true);
      const nextMessage = await chatService.sendMessage(user.id, roomId, input);
      setMessages((current) => [...current, nextMessage]);
      setInput("");
    } finally {
      setIsSending(false);
    }
  };

  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-surface-tint">
        <StickyHeader
          title="Chat"
          leftAction={<BackButton variant="primary" />}
        />
        <GuestEmptyState
          title="Login untuk Mulai Chat"
          description="Masuk dulu agar kamu bisa ngobrol langsung dengan penjual."
          icon={<Icons.Message size={48} />}
        />
      </main>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-surface-tint">
      <StickyHeader
        title={roomName}
        leftAction={<BackButton variant="primary" />}
        rightAction={
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <Icons.Info size={20} />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-24 flex flex-col gap-4">
        <div className="flex justify-center mb-4">
          <span className="bg-surface-hover px-3 py-1 rounded-full text-[10px] font-bold text-text-sub uppercase tracking-widest">
            Hari Ini
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === "me" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "max-w-[80%] flex flex-col gap-1",
                msg.sender === "me"
                  ? "self-end items-end"
                  : "self-start items-start"
              )}
            >
              <div
                className={cn(
                  "px-5 py-3 rounded-[24px] text-[15px] leading-relaxed shadow-sm",
                  msg.sender === "me"
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-white text-text-main rounded-tl-none border border-surface-muted"
                )}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-text-sub font-medium px-2">
                {msg.time}
              </span>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center text-text-sub/30 mb-4">
              <Icons.Message size={36} />
            </div>
            <p className="text-[14px] font-bold text-text-main">Belum ada pesan</p>
            <p className="text-[12px] text-text-sub">
              Mulai percakapan pertama dengan penjual.
            </p>
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-[440px] mx-auto p-4 bg-white/80 backdrop-blur-xl border-t border-surface-muted flex items-center gap-3">
          <button className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center text-text-sub active:scale-90 transition-all">
            <Icons.Plus size={24} />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void handleSend()}
              placeholder="Ketik pesan..."
              className="w-full h-12 bg-surface-hover rounded-full px-6 pr-12 text-[15px] text-text-main outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              onClick={() => void handleSend()}
              disabled={!input.trim() || isSending || !roomId}
              className={cn(
                "absolute right-1 top-1 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                input.trim() && roomId
                  ? "bg-primary text-white"
                  : "bg-transparent text-text-sub/60"
              )}
            >
              <Icons.ChevronRight size={24} className="-rotate-90 -translate-y-px" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
