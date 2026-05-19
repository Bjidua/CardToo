"use client";

import React, { useEffect, useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";
import { useAuth } from "@/context/AuthContext";
import { addressService } from "@/lib/services/address";
import type { Address } from "@/types";

/**
 * Halaman Daftar Alamat Pengiriman (AddressPage)
 * Menyediakan manajemen alamat kirim untuk transaksi belanja pembeli:
 * - Load dan tampilkan seluruh daftar alamat yang tersimpan di database Appwrite.
 * - Memilih alamat aktif (primary) untuk digunakan saat proses checkout.
 * - Tombol aksi hapus alamat & atur sebagai alamat utama.
 * - Modal slide-up sheet untuk menambahkan alamat baru secara interaktif.
 */
export default function AddressPage() {
  const router = useRouter();

  // Otorisasi user global
  const { isGuest, user } = useAuth();

  // State daftar alamat terdaftar milik user
  const [addresses, setAddresses] = useState<Address[]>([]);

  // State flag pengendali visibilitas modal tambah alamat (bottom sheet)
  const [isAdding, setIsAdding] = useState(false);

  // State ID alamat yang sedang terpilih secara visual di UI
  const [selectedId, setSelectedId] = useState("");

  // State loading status pemuatan list alamat dari backend
  const [isLoading, setIsLoading] = useState(false);

  // State form penampung alamat baru
  const [newLabel, setNewLabel] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newDetails, setNewDetails] = useState("");

  /**
   * Effect Hook untuk menarik list alamat dari database.
   * Dijalankan ketika status login user berubah.
   */
  useEffect(() => {
    if (!user || isGuest) return;

    const loadAddresses = async () => {
      try {
        setIsLoading(true); // Aktifkan spinner memuat
        const nextAddresses = await addressService.listAddresses(user.id);
        setAddresses(nextAddresses);
        
        // Cari alamat yang di-set utama (primary) untuk disorot pertama kali
        const primary = nextAddresses.find((address) => address.isPrimary);
        setSelectedId(primary?.id || nextAddresses[0]?.id || "");
      } finally {
        setIsLoading(false); // Matikan spinner memuat
      }
    };

    void loadAddresses();
  }, [isGuest, user]);

  /**
   * Mengubah status alamat terpilih menjadi alamat utama di database Appwrite.
   * 
   * @param id ID unik alamat
   */
  const handleSetPrimary = async (id: string) => {
    if (!user) return;
    await addressService.setPrimaryAddress(user.id, id);
    
    // Perbarui state lokal dengan mematikan primary lama dan menyalakan yang baru
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isPrimary: addr.id === id,
      }))
    );
    setSelectedId(id);
  };

  /**
   * Menghapus salah satu alamat pengguna dari database.
   * 
   * @param id ID unik alamat yang akan dihapus
   */
  const handleDelete = async (id: string) => {
    if (!user) return;
    await addressService.deleteAddress(user.id, id);
    
    // Tarik ulang daftar alamat terbaru untuk memulihkan state UI
    const nextAddresses = await addressService.listAddresses(user.id);
    setAddresses(nextAddresses);
    const primary = nextAddresses.find((address) => address.isPrimary);
    setSelectedId(primary?.id || nextAddresses[0]?.id || "");
  };

  /**
   * Menyimpan alamat baru yang dimasukkan pembeli lewat modal bottom sheet.
   */
  const handleAddAddress = async () => {
    if (!user) return;
    if (!newName || !newDetails) return; // Validasi field wajib
    
    // Kirim request penambahan alamat ke database
    const newAddr = await addressService.createAddress(user.id, {
      label: newLabel || "Lainnya",
      name: newName,
      phone: newPhone,
      details: newDetails,
      isPrimary: addresses.length === 0, // Alamat pertama otomatis di-set sebagai alamat utama
    });

    // Perbarui state list alamat dari server
    const nextAddresses = await addressService.listAddresses(user.id);
    setAddresses(nextAddresses);
    setSelectedId(newAddr.id);
    setIsAdding(false); // Tutup modal slide-up
    
    // Reset isian field form ke string kosong
    setNewLabel(""); setNewName(""); setNewPhone(""); setNewDetails("");
  };

  /**
   * Mengonfirmasi alamat pengiriman yang dipilih.
   * Menyetel alamat tersebut sebagai alamat utama/aktif saat ini, lalu kembali ke halaman sebelumnya (Checkout).
   */
  const handleConfirmAddress = async () => {
    if (!user || !selectedId) {
      router.back();
      return;
    }

    await handleSetPrimary(selectedId);
    router.back();
  };

  // UI STATE 1: Proteksi login tamu (guest)
  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-surface-tint">
        <StickyHeader
          title="Daftar Alamat"
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="primary" />}
        />
        <GuestEmptyState
          title="Login untuk Kelola Alamat"
          description="Alamat pengiriman hanya tersedia untuk pengguna yang sudah masuk."
          icon={<Icons.MapPin size={48} />}
        />
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-tint pb-32">
      {/* Header Halaman Utama */}
      <StickyHeader
        title="Daftar Alamat"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
        rightAction={
          /* Tombol Tambah Alamat Baru */
          <button 
            onClick={() => setIsAdding(true)}
            className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center active:scale-90 transition-all"
          >
            <Icons.Plus size={20} />
          </button>
        }
      />

      <main className="px-6 pt-6 flex flex-col gap-5">
        {/* Spinner memuat data */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {/* Render List Card Alamat dengan AnimatePresence */}
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
              {/* Badge Alamat Utama (Primary) */}
              {addr.isPrimary && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                  Utama
                </div>
              )}

              {/* Judul/Label Alamat */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  selectedId === addr.id ? "bg-primary text-white" : "bg-surface-muted text-text-sub"
                )}>
                  <Icons.MapPin size={16} />
                </div>
                <span className="text-[15px] font-bold text-text-main">{addr.label}</span>
              </div>

              {/* Detail Info Alamat & Kontak Penerima */}
              <div className="flex flex-col">
                <h3 className="text-[14px] font-bold text-text-main">{addr.name}</h3>
                <p className="text-[12px] text-text-sub font-medium">{addr.phone}</p>
                <p className="text-[13px] text-text-sub leading-relaxed mt-2">{addr.details}</p>
              </div>

              {/* Deretan Tombol Kontrol Alamat (Ubah, Set Utama, Hapus) */}
              <div className="flex items-center gap-4 pt-4 border-t border-surface-muted">
                <button 
                  onClick={(e) => { e.stopPropagation(); /* Integrasi edit */ }}
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

        {/* Tampilan kosong (Empty State) jika tidak ada alamat */}
        {!isLoading && addresses.length === 0 && !isAdding && (
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

      {/* Button Konfirmasi Alamat bawah */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-6 bg-linear-to-t from-surface-tint via-surface-tint/80 to-transparent z-40">
        <Button 
          variant="primary" 
          className="w-full h-15 rounded-2xl text-[16px] font-bold shadow-lg shadow-primary/30 uppercase tracking-widest"
          onClick={() => void handleConfirmAddress()}
        >
          Konfirmasi Alamat
        </Button>
      </div>

      {/* Modal Bottom Sheet: Form Tambah Alamat Baru */}
      <AnimatePresence>
        {isAdding && (
          <>
            {/* Latar Belakang Gelap Transparan */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="fixed inset-0 z-50 bg-text-main/20 backdrop-blur-sm"
            />
            {/* Panel Form Geser ke Atas (Slide Up) */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white rounded-t-[48px] z-50 shadow-2xl p-8 pb-12 flex flex-col gap-6"
            >
              {/* Handle Geser Panel */}
              <div className="w-12 h-1.5 bg-surface-muted rounded-full mx-auto" />
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] font-bold text-text-main">Tambah Alamat Baru</h2>
                <p className="text-[13px] text-text-sub">Pastikan detail alamat sudah benar.</p>
              </div>

              {/* Isian Form Input */}
              <div className="flex flex-col gap-5 overflow-y-auto max-h-[60vh] px-1 no-scrollbar">
                <Input label="Label Alamat (Rumah/Kantor)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Contoh: Rumah" />
                <Input label="Nama Penerima" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nama Lengkap" />
                <Input label="Nomor Telepon" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="0812..." />
                
                {/* Area Input Alamat Lengkap */}
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

              {/* Tombol Simpan */}
              <Button 
                variant="primary" 
                className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest mt-2"
                onClick={() => void handleAddAddress()}
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
