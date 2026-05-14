"use client";

import React from "react";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface GuestEmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const GuestEmptyState = ({ title, description, icon }: GuestEmptyStateProps) => {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-32 text-center px-6"
    >
      <div className="w-24 h-24 bg-surface-muted rounded-full flex items-center justify-center text-text-sub/40 mb-6 shadow-soft">
        {icon || <Icons.Lock size={48} />}
      </div>
      
      <h2 className="text-[20px] font-bold text-text-main mb-2">{title}</h2>
      <p className="text-[14px] text-text-sub font-medium max-w-[280px] leading-relaxed mb-8">
        {description}
      </p>

      <div className="flex flex-col w-full max-w-[280px] gap-3">
        <Button 
          variant="primary" 
          className="w-full h-14 rounded-full font-bold shadow-lg shadow-primary/20"
          onClick={() => router.push("/login")}
        >
          Login Sekarang
        </Button>
        <Button 
          variant="secondary" 
          className="w-full h-14 rounded-full font-bold border-2 border-surface-muted"
          onClick={() => router.push("/register")}
        >
          Daftar Akun Baru
        </Button>
      </div>
    </motion.div>
  );
};
