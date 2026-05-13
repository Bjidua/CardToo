"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function SellerSettingsPage() {
  return (
    <ProtectedRoute requireSeller={true}>
      <SellerSettingsContent />
    </ProtectedRoute>
  );
}

function SellerSettingsContent() {
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Pengaturan toko berhasil disimpan!");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-tint pb-32">
      <StickyHeader
        title="Pengaturan Toko"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="secondary" />}
      />

      <main className="px-6 pt-6 flex flex-col gap-8">
        {/* Cover Image Settings */}
        <section className="flex flex-col gap-4">
          <label className="text-[14px] font-black text-text-main uppercase tracking-widest px-2">Banner Toko</label>
          <div className="relative h-48 w-full rounded-[40px] overflow-hidden border-2 border-dashed border-secondary/20 bg-white shadow-soft group">
            {coverImage ? (
              <Image src={coverImage} alt="Cover" fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-secondary/10 flex flex-col items-center justify-center gap-3 text-secondary">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                  <Icons.Plus size={24} />
                </div>
                <span className="text-[12px] font-bold">Unggah Foto Sampul</span>
              </div>
            )}
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer z-20" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setCoverImage(URL.createObjectURL(file));
              }}
            />
          </div>
          <p className="text-[11px] text-text-sub px-4 italic font-medium opacity-60">*Rekomendasi ukuran: 1200 x 400 pixel</p>
        </section>

        {/* Store Detail Form */}
        <section className="bg-white rounded-[40px] p-8 shadow-medium border border-surface-muted flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-text-sub uppercase tracking-wider ml-4">Nama Toko</label>
            <Input 
              value={storeName} 
              onChange={(e) => setStoreName(e.target.value)}
              className="bg-surface-tint border-none rounded-[24px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-text-sub uppercase tracking-wider ml-4">Lokasi</label>
            <div className="relative group">
              <Input 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                startIcon={<Icons.MapPin size={18} className="text-secondary" />}
                className="bg-surface-tint border-none rounded-[24px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-text-sub uppercase tracking-wider ml-4">Deskripsi</label>
            <textarea
              className="w-full h-32 bg-surface-tint rounded-[24px] p-6 text-[14px] text-text-main outline-none focus:ring-2 focus:ring-secondary/30 transition-all resize-none placeholder:text-text-sub/40 font-medium"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan tentang toko Tuan..."
            />
          </div>
        </section>

        {/* Store Stats (Read Only) */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[32px] border border-surface-muted flex flex-col gap-1 shadow-soft">
            <span className="text-[10px] text-text-sub font-bold uppercase tracking-widest">Waktu Balas</span>
            <span className="text-[15px] font-black text-text-main">± 5 Menit</span>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-surface-muted flex flex-col gap-1 shadow-soft">
            <span className="text-[10px] text-text-sub font-bold uppercase tracking-widest">Rating Toko</span>
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-black text-text-main">4.9</span>
              <Icons.Review size={12} className="text-warning fill-warning" />
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-6 bg-linear-to-t from-surface-tint via-surface-tint/80 to-transparent z-40">
        <Button 
          variant="secondary" 
          className="w-full h-14 rounded-2xl text-[16px] font-bold shadow-lg shadow-secondary/30 uppercase tracking-widest"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
}
