"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "./Icons";

interface AccordionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ title, isOpen, onToggle, children, className }: AccordionProps) {
  return (
    <div className={`border-b border-surface-muted ${className}`}>
      <button 
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between group"
      >
        <span className="text-[16px] font-bold text-text-main group-hover:text-primary transition-colors">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-text-sub"
        >
          <Icons.ChevronRight size={20} className="rotate-90" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
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
