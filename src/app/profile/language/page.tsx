"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const LANGUAGE_STORAGE_KEY = "cardtoo-language";

const LANGUAGES = [
  { id: "id", name: "Indonesia", native: "Bahasa Indonesia" },
  { id: "en", name: "English", native: "English (US)" },
  { id: "jp", name: "Japanese", native: "日本語" },
];

export default function LanguagePage() {
  return (
    <ProtectedRoute>
      <LanguageContent />
    </ProtectedRoute>
  );
}

function LanguageContent() {
  const [selected, setSelected] = useState(() => {
    if (typeof window === "undefined") {
      return "id";
    }

    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored && LANGUAGES.some((language) => language.id === stored)
      ? stored
      : "id";
  });

  const handleSelect = (languageId: string) => {
    setSelected(languageId);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, languageId);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-surface-tint to-accent-soft">
      <StickyHeader
        title="Bahasa"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pb-32 pt-6">
        <div className="overflow-hidden rounded-card border border-surface-muted bg-white shadow-soft">
          {LANGUAGES.map((lang, index) => (
            <button
              key={lang.id}
              onClick={() => handleSelect(lang.id)}
              className={cn(
                "flex w-full items-center justify-between p-6 transition-colors active:bg-text-main/[0.02]",
                index !== LANGUAGES.length - 1 && "border-b border-surface-muted"
              )}
            >
              <div className="flex flex-col items-start">
                <span className="text-[16px] font-bold text-text-main">
                  {lang.name}
                </span>
                <span className="text-[13px] text-text-sub">{lang.native}</span>
              </div>
              {selected === lang.id ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white"
                >
                  <Icons.Check size={14} />
                </motion.div>
              ) : null}
            </button>
          ))}
        </div>

        <p className="mt-6 px-4 text-center text-[13px] leading-relaxed text-text-sub">
          Preferensi bahasa disimpan di perangkat ini agar tampilan tetap konsisten
          saat kamu membuka CardToo kembali.
        </p>
      </main>
    </div>
  );
}
