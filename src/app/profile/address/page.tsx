"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  details: string;
  isPrimary: boolean;
}

const INITIAL_ADDRESSES: Address[] = [];

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedId, setSelectedId] = useState("1");

  // Form State
  const [newLabel, setNewLabel] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newDetails, setNewDetails] = useState("");

  const handleSetPrimary = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isPrimary: addr.id === id
    })));
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleAddAddress = () => {
    if (!newName || !newDetails) return;
    const newAddr: Address = {
      id: Math.random().toString(),
      label: newLabel || "Lainnya",
      name: newName,
      phone: newPhone,
      details: newDetails,
      isPrimary: addresses.length === 0,
    };
    setAddresses([newAddr, ...addresses]);
    setIsAdding(false);
    // Reset form
    setNewLabel(""); setNewName(""); setNewPhone(""); setNewDetails("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-tint pb-32">
      <StickyHeader
        title="Daftar Alamat"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
        rightAction={
          <button 
            onClick={() => setIsAdding(true)}
            className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center active:scale-90 transition-all"
          >
            <Icons.Plus size={20} />
          </button>
        }
      />

      <main className="px-6 pt-6 flex flex-col gap-5">
        <AnimatePresence mode="popLayout">
          {addresses.map((addr) => (
            <motion.div
              key={addr.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setSelectedId(addr.id)}
              className={cn(
                "bg-white p-6 rounded-[32px] border-2 transition-all flex flex-col gap-4 relative overflow-hidden cursor-pointer",
                selectedId === addr.id ? "border-primary ring-2 ring-primary/10" : "border-surface-muted shadow-soft"
              )}
            >
              {addr.isPrimary && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                  Utama
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  selectedId === addr.id ? "bg-primary text-white" : "bg-surface-muted text-text-sub"
                )}>
                  <Icons.MapPin size={16} />
                </div>
                <span className="text-[15px] font-black text-text-main">{addr.label}</span>
              </div>

              <div className="flex flex-col">
                <h3 className="text-[14px] font-black text-text-main">{addr.name}</h3>
                <p className="text-[12px] text-text-sub font-medium">{addr.phone}</p>
                <p className="text-[13px] text-text-sub leading-relaxed mt-2">{addr.details}</p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-surface-muted">
                <button 
                  onClick={(e) => { e.stopPropagation(); /* Logic edit */ }}
                  className="flex-1 flex items-center justify-center gap-2 text-[12px] font-bold text-text-main py-2.5 bg-surface-tint rounded-2xl active:scale-95 transition-all"
                >
                  <Icons.Export size={14} className="rotate-180" />
                  Ubah Alamat
                </button>
                {!addr.isPrimary && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleSetPrimary(addr.id); }}
                    className="text-[12px] font-bold text-primary px-2"
                  >
                    Set Utama
                  </button>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }}
                  className="w-10 h-10 flex items-center justify-center text-danger bg-danger/5 rounded-2xl active:scale-95 transition-all ml-auto"
                >
                  <Icons.Delete size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {addresses.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-4">
              <Icons.MapPin size={32} className="text-primary/20" />
            </div>
            <h3 className="text-[16px] font-bold text-text-main">Belum ada alamat</h3>
            <p className="text-[13px] text-text-sub mt-1 max-w-[200px]">Tambah alamat pengiriman untuk mulai berbelanja.</p>
            <Button 
              variant="primary" 
              className="mt-6 rounded-full px-8"
              onClick={() => setIsAdding(true)}
            >
              Tambah Alamat
            </Button>
          </div>
        )}
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-6 bg-linear-to-t from-surface-tint via-surface-tint/80 to-transparent z-40">
        <Button 
          variant="primary" 
          className="w-full h-15 rounded-2xl text-[16px] font-black shadow-lg shadow-primary/30 uppercase tracking-widest"
          onClick={() => window.history.back()}
        >
          Konfirmasi Alamat
        </Button>
      </div>

      {/* Add Address Sheet Simulation */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white rounded-t-[48px] z-50 shadow-2xl p-8 pb-12 flex flex-col gap-6"
            >
              <div className="w-12 h-1.5 bg-surface-muted rounded-full mx-auto" />
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] font-black text-text-main">Tambah Alamat Baru</h2>
                <p className="text-[13px] text-text-sub">Pastikan detail alamat sudah benar.</p>
              </div>

              <div className="flex flex-col gap-5 overflow-y-auto max-h-[60vh] px-1 no-scrollbar">
                <Input label="Label Alamat (Rumah/Kantor)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Contoh: Rumah" />
                <Input label="Nama Penerima" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nama Lengkap" />
                <Input label="Nomor Telepon" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="0812..." />
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-main ml-4">Alamat Lengkap</label>
                  <textarea 
                    className="w-full h-28 bg-surface-muted rounded-[26px] p-6 text-base text-text-main outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none font-medium"
                    value={newDetails}
                    onChange={(e) => setNewDetails(e.target.value)}
                    placeholder="Nama jalan, gedung, No. rumah, dll..."
                  />
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest mt-2"
                onClick={handleAddAddress}
              >
                Simpan Alamat
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
