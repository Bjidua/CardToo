"use client";

import React, { useState, useEffect } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function EditProductClient({ id }: { id: string }) {
  const router = useRouter();
  const [condition, setCondition] = useState("Mint");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "1",
    description: ""
  });

  const conditions = ["Mint", "Near Mint", "Excellent", "Good"];

  // TODO: Fetch data produk dari Appwrite berdasarkan ID
  useEffect(() => {
    // Data akan di-fetch dari database saat integrasi backend
  }, [id]);

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      // TODO: Ganti dengan Toast UI untuk validasi
      return;
    }

    setIsSaving(true);
    
    // TODO: Integrasi Appwrite — update produk di database
    setTimeout(() => {
      setIsSaving(false);
      router.push('/seller/products');
    }, 1500);
  };

  return (
    <ProtectedRoute requireSeller={true}>
      <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-white pb-32">
        <StickyHeader 
          title="Edit Produk" 
          variant="minimal" 
          size="sm" 
          leftAction={<BackButton variant="secondary"/>} 
        />

        <main className="flex-1 px-6 pt-6 flex flex-col gap-6">
          
          {/* Photo Preview Area */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-text-main px-2">Foto Kartu</label>
            <div className="w-full aspect-4/3 bg-surface-muted rounded-[24px] border-2 border-secondary/20 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden shadow-inner relative group">
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-secondary">
                  <Icons.Plus size={24} />
                </div>
              </div>
              <div className="w-full h-full flex items-center justify-center text-black/10 font-black uppercase tracking-tighter text-4xl italic">
                {formData.name.split(" ")[0] || "TCG"}
              </div>
            </div>
            <p className="text-[10px] text-center text-text-sub font-medium italic mt-1">Klik gambar untuk mengganti foto</p>
          </div>

          {/* Basic Info */}
          <div className="flex flex-col gap-4">
            <Input 
              label="Nama Kartu / Produk" 
              placeholder="Misal: Charizard VMAX" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <Input 
              label="Kategori / Ekspansi" 
              placeholder="Misal: Darkness Ablaze" 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            />
          </div>

          {/* Condition Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-text-main px-2">Kondisi Kartu</label>
            <div className="flex flex-wrap gap-2 px-2">
              {conditions.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setCondition(cond)}
                  className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-300 border ${
                    condition === cond 
                      ? "bg-secondary text-white border-secondary shadow-soft" 
                      : "bg-white text-text-sub border-surface-hover hover:border-secondary/30"
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Harga (Rp)" 
              placeholder="0" 
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
            <Input 
              label="Stok" 
              placeholder="1" 
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[14px] font-bold text-text-main ml-4">
              Deskripsi (Opsional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full min-h-[120px] rounded-[24px] border-none bg-surface-muted p-6 text-base text-text-main placeholder:text-black/30 focus:ring-2 focus:ring-secondary/30 outline-none resize-none shadow-inner"
              placeholder="Jelaskan detail kartu, minus jika ada, dll..."
            />
          </div>

        </main>

        {/* Sticky Bottom Action */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-6 bg-linear-to-t from-white via-white/90 to-transparent pointer-events-none z-40">
          <div className="w-full pointer-events-auto">
            <Button 
              className="w-full h-[60px] rounded-[30px] shadow-medium text-[16px] font-black tracking-wide"
              onClick={handleSave}
              disabled={isSaving}
              variant="secondary"
            >
              {isSaving ? (
                <div className="flex items-center gap-3">
                  <Icons.History size={20} className="animate-spin" />
                  Menyimpan...
                </div>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
