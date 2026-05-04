"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { id: "id", name: "Indonesia", native: "Bahasa Indonesia" },
  { id: "en", name: "English", native: "English (US)" },
  { id: "jp", name: "Japanese", native: "日本語" },
];

export default function LanguagePage() {
  const [selected, setSelected] = useState("id");

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-[#F6DFFF]">
      <StickyHeader
        title="Bahasa"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-32">
        <div className="bg-white rounded-card overflow-hidden shadow-soft border border-black/5">
          {LANGUAGES.map((lang, index) => (
            <button
              key={lang.id}
              onClick={() => setSelected(lang.id)}
              className={cn(
                "w-full flex items-center justify-between p-6 transition-colors active:bg-black/[0.02]",
                index !== LANGUAGES.length - 1 && "border-b border-black/5"
              )}
            >
              <div className="flex flex-col items-start">
                <span className="text-[16px] font-bold text-black">{lang.name}</span>
                <span className="text-[13px] text-black/40">{lang.native}</span>
              </div>
              {selected === lang.id && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white"
                >
                  <Icons.Plus size={14} className="rotate-45 scale-125" />
                </motion.div>
              )}
            </button>
          ))}
        </div>
        
        <p className="mt-6 px-4 text-[13px] text-black/30 leading-relaxed text-center">
          Bahasa yang kamu pilih akan diterapkan di seluruh aplikasi CardToo.
        </p>
      </main>
    </div>
  );
}
