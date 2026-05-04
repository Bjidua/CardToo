"use client";

import React, { useState, useRef, useEffect } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatClientProps {
  id: string;
  name: string;
}

const DUMMY_MESSAGES = [
  { id: 1, text: "Halo Kak! Apakah Pikachu VMAX-nya masih ready?", sender: "me", time: "10:30" },
  { id: 2, text: "Halo! Iya masih ready kak, kondisinya Mint 10/10 ya.", sender: "other", time: "10:32" },
  { id: 3, text: "Bisa kirim foto detail bagian belakangnya kak?", sender: "me", time: "10:33" },
  { id: 4, text: "Tentu, sebentar ya saya ambilkan fotonya.", sender: "other", time: "10:35" },
];

export default function ChatClient({ id, name }: ChatClientProps) {
  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now(),
      text: input,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-surface-tint">
      <StickyHeader
        title={name}
        leftAction={<BackButton variant="primary" />}
        rightAction={
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <Icons.Info size={20} />
          </button>
        }
      />

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-24 flex flex-col gap-4">
        <div className="flex justify-center mb-4">
          <span className="bg-black/5 px-3 py-1 rounded-full text-[10px] font-bold text-black/30 uppercase tracking-widest">Hari Ini</span>
        </div>

        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: msg.sender === "me" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "max-w-[80%] flex flex-col gap-1",
              msg.sender === "me" ? "self-end items-end" : "self-start items-start"
            )}
          >
            <div className={cn(
              "px-5 py-3 rounded-[24px] text-[15px] leading-relaxed shadow-sm",
              msg.sender === "me" 
                ? "bg-primary text-white rounded-tr-none" 
                : "bg-white text-black rounded-tl-none border border-black/5"
            )}>
              {msg.text}
            </div>
            <span className="text-[10px] text-black/30 font-medium px-2">{msg.time}</span>
          </motion.div>
        ))}
        <div ref={scrollRef} />
      </main>

      {/* Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-[440px] mx-auto p-4 bg-white/80 backdrop-blur-xl border-t border-black/5 flex items-center gap-3">
          <button className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black/40 active:scale-90 transition-all">
            <Icons.Plus size={24} />
          </button>
          
          <div className="flex-1 relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ketik pesan..."
              className="w-full h-12 bg-black/5 rounded-full px-6 pr-12 text-[15px] outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button 
              onClick={handleSend}
              className={cn(
                "absolute right-1 top-1 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                input.trim() ? "bg-primary text-white" : "bg-transparent text-black/20"
              )}
            >
              <Icons.ChevronRight size={24} className="rotate-[-90deg] translate-y-[-1px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
