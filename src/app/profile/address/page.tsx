"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const DUMMY_ADDRESSES = [
  {
    id: "1",
    label: "Rumah Utama",
    recipient: "CanTika",
    phone: "08123456789",
    address: "Jl. Mawar No. 12, Kel. Menteng, Kec. Menteng, Jakarta Pusat, DKI Jakarta",
    isDefault: true,
  },
  {
    id: "2",
    label: "Kantor",
    recipient: "Hafiz",
    phone: "08123456789",
    address: "Sudirman Central Business District (SCBD), Lot 28, Jakarta Selatan",
    isDefault: false,
  },
];

export default function AddressPage() {
  const [addresses, setAddresses] = useState(DUMMY_ADDRESSES);

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-[#F6DFFF]">
      <StickyHeader
        title="Alamat Saya"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-32">
        <div className="flex flex-col gap-5">
          <AnimatePresence>
            {addresses.map((addr) => (
              <motion.div
                key={addr.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-5 rounded-card bg-white shadow-soft border transition-all",
                  addr.isDefault ? "border-primary/30 ring-1 ring-primary/10" : "border-black/5"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[16px] font-bold text-black">{addr.label}</h4>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase">Default</span>
                    )}
                  </div>
                  <button className="text-primary font-bold text-[14px]">Ubah</button>
                </div>
                <p className="text-[14px] font-bold text-black mb-1">{addr.recipient}</p>
                <p className="text-[13px] text-black/60 mb-2">{addr.phone}</p>
                <p className="text-[13px] text-black/60 leading-relaxed">{addr.address}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="fixed bottom-10 left-0 right-0 px-10 flex justify-center z-40">
          <Button 
            fullWidth={false} 
            className="px-12 h-[58px] shadow-lg shadow-primary/20"
            startIcon={<Icons.Plus size={20} />}
          >
            Tambah Alamat Baru
          </Button>
        </div>
      </main>
    </div>
  );
}
