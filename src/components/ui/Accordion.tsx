"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "./Icons";

/**
 * Properti pendukung untuk komponen lipatan (Accordion).
 */
interface AccordionProps {
  /** Judul teks yang akan selalu terlihat di bagian header */
  title: string;
  /** Status apakah accordion sedang terbuka atau tertutup */
  isOpen: boolean;
  /** Callback saat tombol header ditekan untuk mengubah status `isOpen` */
  onToggle: () => void;
  /** Konten yang berada di dalam badan accordion (akan disembunyikan saat tertutup) */
  children: React.ReactNode;
  /** Ekstra CSS class */
  className?: string;
}

/**
 * Komponen Accordion yang memanfaatkan `framer-motion` untuk memberikan animasi
 * pergerakan tinggi (height) yang mulus saat membuka atau menutup konten di dalamnya.
 */
export function Accordion({ title, isOpen, onToggle, children, className }: AccordionProps) {
  return (
    <div className={`border-b border-surface-muted ${className}`}>
      {/* Tombol pemicu buka-tutup lipatan accordion */}
      <button 
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between group"
      >
        <span className="text-[16px] font-bold text-text-main group-hover:text-primary transition-colors">{title}</span>
        
        {/* Kontainer ikon panah dengan animasi rotasi berputar 180 derajat saat status terbuka */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-text-sub"
        >
          <Icons.ChevronRight size={20} className="rotate-90" />
        </motion.div>
      </button>

      {/* Menangani animasi buka-tutup kontainer badan secara halus saat ditambahkan/dihapus dari DOM */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden" // Mencegah konten meluap selama transisi ukuran tinggi (height) berlangsung
          >
            <div className="pb-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
