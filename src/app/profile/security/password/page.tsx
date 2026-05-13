"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { motion } from "framer-motion";

export default function ChangePasswordPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      <StickyHeader
        title="Ganti Password"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-10 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="mb-4">
            <h2 className="text-[20px] font-bold text-black mb-2">Buat Password Baru</h2>
            <p className="text-[14px] text-black/50 leading-relaxed">
              Pastikan password-mu terdiri dari minimal 8 karakter dan merupakan kombinasi huruf dan angka.
            </p>
          </div>

          <Input 
            label="Password Saat Ini" 
            type={showCurrent ? "text" : "password"}
            placeholder="Masukkan password lama"
            endIcon={
              <button onClick={() => setShowCurrent(!showCurrent)} className="text-primary font-bold text-[12px]">
                {showCurrent ? "HIDE" : "SHOW"}
              </button>
            }
          />

          <div className="h-px w-full bg-black/5 my-2" />

          <Input 
            label="Password Baru" 
            type={showNew ? "text" : "password"}
            placeholder="Masukkan password baru"
            endIcon={
              <button onClick={() => setShowNew(!showNew)} className="text-primary font-bold text-[12px]">
                {showNew ? "HIDE" : "SHOW"}
              </button>
            }
          />

          <Input 
            label="Konfirmasi Password Baru" 
            type={showNew ? "text" : "password"}
            placeholder="Ulangi password baru"
          />

          <div className="pt-8">
            <Button>
              Simpan Password
            </Button>
            <p className="mt-4 text-center text-[13px] text-primary font-bold cursor-pointer hover:underline">
              Lupa Password?
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
