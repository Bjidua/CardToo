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

/**
 * Halaman Pendaftaran Penjual (SellerRegistrationPage)
 * Alur onboarding langkah-demi-langkah (multi-step wizard) untuk memandu pembeli menjadi penjual (seller).
 * Terdiri dari 4 langkah:
 * - Langkah 0: Welcome (Penjelasan keuntungan jualan)
 * - Langkah 1: Info Toko (Nama toko, slug tautan, deskripsi toko)
 * - Langkah 2: KYC (Nama lengkap, No HP, Tanggal lahir)
 * - Langkah 3: Success (Pendaftaran berhasil & redirect ke dashboard)
 */
export default function SellerRegistrationPage() {
  const router = useRouter();
  
  // Mengambil service upgrade ke role seller dari AuthContext
  const { becomeSeller } = useAuth();
  
  // State pengendali langkah wizard aktif saat ini (0 sampai 3)
  const [step, setStep] = useState(0);
  
  // State loading saat memproses update database & store creation
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State penyimpan pesan kesalahan validasi/server
  const [error, setError] = useState("");
  
  // State form informasi detail toko
  const [storeForm, setStoreForm] = useState({
    storeName: "",
    storeSlug: "",
    description: "",
  });
  
  // State form KYC (Know Your Customer) identitas penjual
  const [kycForm, setKycForm] = useState({
    fullName: "",
    phone: "",
    birthDate: "",
  });

  // Judul & Ikon untuk diagram progress bar multi-step
  const steps = [
    { title: "Info Toko", icon: <Icons.Store size={20} /> },
    { title: "Verifikasi", icon: <Icons.Lock size={20} /> },
    { title: "Selesai", icon: <Icons.Plus size={20} className="rotate-45" /> },
  ];

  /**
   * Menyelesaikan proses pendaftaran.
   * Mengirim request data toko dan data identitas ke database Appwrite.
   */
  const handleRegistrationComplete = async () => {
    // Validasi data nama toko wajib diisi
    if (!storeForm.storeName.trim()) {
      setError("Nama toko wajib diisi.");
      setStep(1); // Balikkan ke form info toko
      return;
    }

    try {
      setError("");
      setIsSubmitting(true); // Aktifkan spinner loading tombol
      
      // Panggil metode becomeSeller pada auth context
      await becomeSeller({
        storeName: storeForm.storeName,
        preferredSlug: storeForm.storeSlug,
        description: storeForm.description,
        fullName: kycForm.fullName,
        phone: kycForm.phone,
      });
      
      setStep(3); // Pindah ke langkah sukses
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Pendaftaran seller gagal. Coba lagi."
      );
    } finally {
      setIsSubmitting(false); // Matikan spinner loading
    }
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft pb-20">
      {/* Header Halaman Dinamis berdasarkan status step */}
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
        {/* Render Progress Bar multi-step jika berada di langkah input data */}
        {step > 0 && step < 3 && (
          <div className="flex items-center justify-between mb-12 px-2 relative">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                {/* Bulatan Ikon Langkah */}
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className={cn(
                    "w-11 h-11 rounded-full flex items-center justify-center transition-all",
                    step > i ? "bg-primary text-white" : step === i + 1 ? "bg-primary/20 text-primary border-2 border-primary" : "bg-white text-text-sub/60 border border-surface-muted"
                  )}>
                    {step > i ? <Icons.Plus size={18} className="rotate-45" /> : s.icon}
                  </div>
                  <span className={cn(
                    "text-[11px] font-bold uppercase tracking-wider",
                    step >= i + 1 ? "text-primary" : "text-text-sub/60"
                  )}>{s.title}</span>
                </div>
                {/* Garis Penghubung antar langkah dengan animasi motion */}
                {i < steps.length - 1 && (
                  <div className="flex-1 h-[2px] mx-[-15px] mb-[20px] bg-surface-muted relative overflow-hidden">
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

        {/* Transisi Animasi Langkah menggunakan Framer Motion AnimatePresence */}
        <AnimatePresence mode="wait">
          {step === 0 && <WelcomeStep key="welcome" onStart={() => setStep(1)} />}
          {step === 1 && (
            <StoreInfoStep
              key="store"
              data={storeForm}
              onChange={setStoreForm}
              onNext={() => {
                if (!storeForm.storeName.trim()) {
                  setError("Nama toko wajib diisi.");
                  return;
                }
                setError("");
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <KYCStep
              key="kyc"
              data={kycForm}
              onChange={setKycForm}
              onNext={handleRegistrationComplete}
              isSubmitting={isSubmitting}
              error={error}
            />
          )}
          {step === 3 && (
            <SuccessStep key="success" onComplete={() => router.push("/seller/dashboard")} />
          )}
        </AnimatePresence>
      </main>
    </main>
  );
}

/**
 * Komponen Langkah 0: Sambutan Selamat Datang
 * Berisi deskripsi umum keuntungan menjadi seller TCG.
 */
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
      <h2 className="text-[26px] font-bold text-text-main leading-tight mb-4">Mulai Berjualan di CardToo</h2>
      <p className="text-[15px] text-text-sub leading-relaxed px-6 mb-12">
        Jangkau ribuan kolektor kartu di seluruh Indonesia. Proses pendaftaran cepat, aman, dan gratis!
      </p>

      {/* Rincian Keuntungan */}
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

/**
 * Komponen Langkah 1: Input detail identitas Toko
 */
function StoreInfoStep({
  data,
  onChange,
  onNext,
}: {
  data: {
    storeName: string;
    storeSlug: string;
    description: string;
  };
  onChange: React.Dispatch<
    React.SetStateAction<{
      storeName: string;
      storeSlug: string;
      description: string;
    }>
  >;
  onNext: () => void;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6"
    >
      <div className="mb-2 px-2">
        <h3 className="text-[20px] font-bold text-text-main mb-1">Informasi Toko</h3>
        <p className="text-[14px] text-text-sub">Gunakan nama yang menarik bagi kolektor.</p>
      </div>

      {/* Bagian upload placeholder logo toko */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 bg-surface-hover rounded-card border-2 border-dashed border-surface-muted flex flex-col items-center justify-center text-text-sub/60 gap-1">
          <Icons.Plus size={24} />
          <span className="text-[10px] font-bold uppercase">Logo Toko</span>
        </div>
      </div>

      {/* Input nama toko */}
      <Input
        label="Nama Toko"
        placeholder="Contoh: CardMaster ID"
        value={data.storeName}
        onChange={(event) =>
          onChange((prev) => ({ ...prev, storeName: event.target.value }))
        }
      />
      
      {/* Input tautan URL kustom toko */}
      <Input
        label="Link Toko"
        placeholder="cardtoo.com/store/nama-tokomu"
        startIcon={<Icons.Search size={16} />}
        value={data.storeSlug}
        onChange={(event) =>
          onChange((prev) => ({ ...prev, storeSlug: event.target.value }))
        }
      />
      
      {/* Area teks deskripsi toko */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-main ml-4">Deskripsi Toko</label>
        <textarea 
          className="w-full h-32 bg-surface-muted rounded-[26px] px-6 py-4 text-base outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          placeholder="Ceritakan tentang koleksi kartu yang kamu jual..."
          value={data.description}
          onChange={(event) =>
            onChange((prev) => ({ ...prev, description: event.target.value }))
          }
        />
      </div>

      <div className="pt-6">
        <Button onClick={onNext}>Lanjut Verifikasi</Button>
      </div>
    </motion.div>
  );
}

/**
 * Komponen Langkah 2: KYC & Pengisian Data Identitas
 */
function KYCStep({
  data,
  onChange,
  onNext,
  isSubmitting,
  error,
}: {
  data: {
    fullName: string;
    phone: string;
    birthDate: string;
  };
  onChange: React.Dispatch<
    React.SetStateAction<{
      fullName: string;
      phone: string;
      birthDate: string;
    }>
  >;
  onNext: () => Promise<void>;
  isSubmitting: boolean;
  error: string;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6"
    >
      <div className="mb-2 px-2">
        <h3 className="text-[20px] font-bold text-text-main mb-1">Verifikasi Identitas</h3>
        <p className="text-[14px] text-text-sub">Pastikan data sesuai.</p>
      </div>
      
      {/* Input nama lengkap KTP */}
      <Input
        label="Nama Lengkap"
        placeholder="Masukkan Nama Lengkap"
        value={data.fullName}
        onChange={(event) =>
          onChange((prev) => ({ ...prev, fullName: event.target.value }))
        }
      />
      
      {/* Input nomor telepon aktif */}
      <Input
        label="Nomor Telefon"
        placeholder="Masukkan Nomor Telefon"
        inputMode="numeric"
        value={data.phone}
        onChange={(event) =>
          onChange((prev) => ({ ...prev, phone: event.target.value }))
        }
      />
      
      {/* Input tanggal lahir */}
      <Input
        label="Tanggal Lahir"
        placeholder="Masukkan Tanggal Lahir"
        inputMode="numeric"
        value={data.birthDate}
        onChange={(event) =>
          onChange((prev) => ({ ...prev, birthDate: event.target.value }))
        }
      />

      {/* Info keamanan enkripsi */}
      <div className="bg-primary/5 p-4 rounded-card border border-primary/10 flex gap-3">
        <Icons.Lock size={20} className="text-primary shrink-0" />
        <p className="text-[12px] text-text-sub leading-tight">
          Data kamu dienkripsi dan hanya digunakan untuk keperluan verifikasi penjual.
        </p>
      </div>

      {/* Visual error */}
      {error && (
        <p className="px-2 text-center text-[12px] font-medium text-danger">
          {error}
        </p>
      )}

      <div className="pt-6">
        <Button onClick={() => void onNext()} isLoading={isSubmitting}>
          Kirim Pendaftaran
        </Button>
      </div>
    </motion.div>
  );
}

/**
 * Komponen Langkah 3: Pendaftaran Berhasil & Sukses
 */
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
      <h2 className="text-[26px] font-bold text-text-main leading-tight mb-4">Pendaftaran Terkirim!</h2>
      <p className="text-[15px] text-text-sub leading-relaxed px-10 mb-12">
        (Demo) Selamat! Akun tokomu telah diaktifkan. Kamu sekarang bisa mulai mengelola produkmu.
      </p>

      <Button onClick={onComplete}>
        Masuk ke Dashboard Seller
      </Button>
    </motion.div>
  );
}

/**
 * Komponen Rincian Keuntungan Individual (BenefitItem)
 */
function BenefitItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-4 px-4">
      <div className="w-12 h-12 bg-white rounded-card shadow-soft flex items-center justify-center text-primary">
        {icon}
      </div>
      <div className="flex flex-col items-start">
        <h4 className="text-[15px] font-bold text-text-main">{title}</h4>
        <p className="text-[13px] text-text-sub">{desc}</p>
      </div>
    </div>
  );
}
