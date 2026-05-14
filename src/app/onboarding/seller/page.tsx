"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function SellerRegistrationPage() {
  const router = useRouter();
  const { becomeSeller } = useAuth();
  const [step, setStep] = useState(0); // 0: Welcome, 1: Store Info, 2: KYC, 3: Success

  const steps = [
    { title: "Info Toko", icon: <Icons.Store size={20} /> },
    { title: "Verifikasi", icon: <Icons.Lock size={20} /> },
    { title: "Selesai", icon: <Icons.Plus size={20} className="rotate-45" /> },
  ];

  const handleRegistrationComplete = () => {
    becomeSeller(); // Update AuthContext to seller status and redirect
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft pb-20">
      <StickyHeader
        title={step === 0 ? "Buka Toko Gratis" : "Registrasi Penjual"}
        leftAction={
          <BackButton 
            variant="primary" 
            onClick={() => step > 0 ? setStep(step - 1) : router.push("/profile")} 
          />
        }
      />

      <main className="flex-1 px-6 pt-6 pb-32">
        {step > 0 && step < 3 && (
          <div className="flex items-center justify-between mb-12 px-2 relative">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className={cn(
                    "w-11 h-11 rounded-full flex items-center justify-center transition-all",
                    step > i ? "bg-primary text-white" : step === i + 1 ? "bg-primary/20 text-primary border-2 border-primary" : "bg-white text-black/20 border border-black/5"
                  )}>
                    {step > i ? <Icons.Plus size={18} className="rotate-45" /> : s.icon}
                  </div>
                  <span className={cn(
                    "text-[11px] font-bold uppercase tracking-wider",
                    step >= i + 1 ? "text-primary" : "text-black/20"
                  )}>{s.title}</span>
                </div>
                {/* Connecting Line */}
                {i < steps.length - 1 && (
                  <div className="flex-1 h-[2px] mx-[-15px] mb-[20px] bg-black/5 relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: step > i + 1 ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 bg-primary"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 0 && <WelcomeStep key="welcome" onStart={() => setStep(1)} />}
          {step === 1 && <StoreInfoStep key="store" onNext={() => setStep(2)} />}
          {step === 2 && <KYCStep key="kyc" onNext={() => setStep(3)} />}
          {step === 3 && <SuccessStep key="success" onComplete={handleRegistrationComplete} />}
        </AnimatePresence>
      </main>
    </main>
  );
}

function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center text-center pt-8"
    >
      <div className="w-32 h-32 bg-white rounded-[40px] shadow-xl flex items-center justify-center mb-8">
        <Icons.Store size={64} className="text-primary" />
      </div>
      <h2 className="text-[26px] font-bold text-black leading-tight mb-4">Mulai Berjualan di CardToo</h2>
      <p className="text-[15px] text-black/50 leading-relaxed px-6 mb-12">
        Jangkau ribuan kolektor kartu di seluruh Indonesia. Proses pendaftaran cepat, aman, dan gratis!
      </p>

      <div className="w-full flex flex-col gap-6 mb-12">
        <BenefitItem icon={<Icons.Wallet size={20} />} title="Pencairan Dana Cepat" desc="Tarik saldo penjualanmu kapan saja." />
        <BenefitItem icon={<Icons.Delivery size={20} />} title="Logistik Terintegrasi" desc="Pick up paket langsung ke rumahmu." />
        <BenefitItem icon={<Icons.Review size={20} />} title="Terpercaya" desc="Sistem verifikasi untuk keamanan transaksi." />
      </div>

      <Button onClick={onStart}>
        Mulai Pendaftaran
      </Button>
    </motion.div>
  );
}

function StoreInfoStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6"
    >
      <div className="mb-2 px-2">
        <h3 className="text-[20px] font-bold text-black mb-1">Informasi Toko</h3>
        <p className="text-[14px] text-black/40">Gunakan nama yang menarik bagi kolektor.</p>
      </div>

      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 bg-surface-hover rounded-card border-2 border-dashed border-black/10 flex flex-col items-center justify-center text-black/20 gap-1">
          <Icons.Plus size={24} />
          <span className="text-[10px] font-bold uppercase">Logo Toko</span>
        </div>
      </div>

      <Input label="Nama Toko" placeholder="Contoh: CardMaster ID" />
      <Input label="Link Toko" placeholder="cardtoo.com/store/nama-tokomu" startIcon={<Icons.Search size={16} />} />
      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-main ml-4">Deskripsi Toko</label>
        <textarea 
          className="w-full h-32 bg-surface-muted rounded-[26px] px-6 py-4 text-base outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          placeholder="Ceritakan tentang koleksi kartu yang kamu jual..."
        />
      </div>

      <div className="pt-6">
        <Button onClick={onNext}>Lanjut Verifikasi</Button>
      </div>
    </motion.div>
  );
}

function KYCStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6"
    >
      <div className="mb-2 px-2">
        <h3 className="text-[20px] font-bold text-black mb-1">Verifikasi Identitas</h3>
        <p className="text-[14px] text-black/40">Pastikan data sesuai.</p>
      </div>
      
      <Input label="Nama Lengkap" placeholder="Masukkan Nama Lengkap" />
      <Input label="Nomor Telefon" placeholder="Masukkan Nomor Telefon" inputMode="numeric" />
      <Input label="Tanggal Lahir" placeholder="Masukkan Tanggal Lahir" inputMode="numeric" />

      <div className="bg-primary/5 p-4 rounded-card border border-primary/10 flex gap-3">
        <Icons.Lock size={20} className="text-primary shrink-0" />
        <p className="text-[12px] text-black/60 leading-tight">
          Data kamu dienkripsi dan hanya digunakan untuk keperluan verifikasi penjual.
        </p>
      </div>

      <div className="pt-6">
        <Button onClick={onNext}>Kirim Pendaftaran</Button>
      </div>
    </motion.div>
  );
}

function SuccessStep({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center pt-16"
    >
      <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center text-white mb-8 shadow-lg shadow-success/20">
        <Icons.Plus size={48} className="rotate-45 scale-125" />
      </div>
      <h2 className="text-[26px] font-bold text-black leading-tight mb-4">Pendaftaran Terkirim!</h2>
      <p className="text-[15px] text-black/50 leading-relaxed px-10 mb-12">
        (Demo) Selamat! Akun tokomu telah diaktifkan. Kamu sekarang bisa mulai mengelola produkmu.
      </p>

      <Button onClick={onComplete}>
        Masuk ke Dashboard Seller
      </Button>
    </motion.div>
  );
}

function BenefitItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-4 px-4">
      <div className="w-12 h-12 bg-white rounded-card shadow-soft flex items-center justify-center text-primary">
        {icon}
      </div>
      <div className="flex flex-col items-start">
        <h4 className="text-[15px] font-bold text-black">{title}</h4>
        <p className="text-[13px] text-black/40">{desc}</p>
      </div>
    </div>
  );
}

function UploadBox({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="p-6 bg-white rounded-card border-2 border-dashed border-black/5 flex flex-col items-center justify-center text-center gap-2 group hover:border-primary/30 transition-colors cursor-pointer">
      <div className="w-12 h-12 bg-surface-hover rounded-full flex items-center justify-center text-black/20 group-hover:text-primary transition-colors">
        <Icons.Plus size={24} />
      </div>
      <div className="flex flex-col">
        <span className="text-[14px] font-bold text-black">{label}</span>
        <span className="text-[11px] text-black/30">{desc}</span>
      </div>
    </div>
  );
}
