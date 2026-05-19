"use client";

import React, { useEffect, useMemo, useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { CartItemCard } from "@/components/ui/CartItemCard";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";
import { Icons } from "@/components/ui/Icons";
import { cartService } from "@/lib/services/cart";
import type { CartItem } from "@/types";

/**
 * Halaman Keranjang Belanja Utama (CartPage).
 * Menyediakan antarmuka untuk melacak barang belanjaan pembeli, mengatur kuantitas,
 * memilih item secara massal atau per toko, serta melanjutkan ke checkout pembayaran.
 */
export default function CartPage() {
  // Instance router Next.js untuk kebutuhan navigasi halaman
  const router = useRouter();

  // Membaca status auth user & guest dari context global
  const { isGuest, user } = useAuth();

  // State untuk menyimpan seluruh daftar item di keranjang belanja pengguna
  const [items, setItems] = useState<CartItem[]>([]);

  // State indikator status pemuatan data dari database
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Mengelompokkan item belanjaan berdasarkan nama Toko/Shop (shopName).
   * Menggunakan useMemo agar pengelompokan tidak dihitung ulang kecuali state `items` berubah.
   */
  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      // Inisialisasi array kosong jika toko belum terdaftar di accumulator
      if (!acc[item.shopName]) acc[item.shopName] = [];
      // Masukkan item ke array toko bersangkutan
      acc[item.shopName].push(item);
      return acc;
    }, {} as Record<string, typeof items>);
  }, [items]);

  /**
   * Effect Hook untuk memuat data item keranjang belanja dari database.
   * Dipicu saat data user atau status guest berubah.
   */
  useEffect(() => {
    // Lewati jika pengguna adalah tamu (guest) atau data user belum dimuat
    if (!user || isGuest) return;

    const loadItems = async () => {
      try {
        setIsLoading(true);
        // Memanggil API cartService untuk mendaftar seluruh isi keranjang belanja
        const nextItems = await cartService.listItems(user.id);
        setItems(nextItems);
      } finally {
        setIsLoading(false);
      }
    };

    void loadItems();
  }, [isGuest, user]);

  /**
   * Menandai/mencentang status terpilih dari satu item produk secara spesifik.
   * 
   * @param id ID unik item keranjang
   * @param checked Status centang (true/false)
   */
  const toggleCheck = async (id: string, checked: boolean) => {
    // Update state di sisi client secara optimis (instan)
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, selected: checked } : item))
    );
    // Simpan status centang baru ke database
    await cartService.setSelected(id, checked);
  };

  /**
   * Menandai/mencentang seluruh item produk milik toko tertentu.
   * 
   * @param shopName Nama toko target
   * @param checked Status centang yang diinginkan
   */
  const toggleStore = async (shopName: string, checked: boolean) => {
    // Saring item yang masuk dalam toko target
    const targetItems = items.filter((item) => item.shopName === shopName);
    
    // Update state di client untuk seluruh item toko target
    setItems((current) =>
      current.map((item) =>
        item.shopName === shopName ? { ...item, selected: checked } : item
      )
    );
    
    // Simpan perubahan secara massal ke database dengan Promise.all
    await Promise.all(
      targetItems.map((item) => cartService.setSelected(item.id, checked))
    );
  };

  /**
   * Menandai/mencentang seluruh produk yang ada di dalam keranjang belanja.
   * 
   * @param checked Status centang massal global
   */
  const toggleAll = async (checked: boolean) => {
    if (!user) return;
    
    // Update status terpilih untuk seluruh item di sisi client
    setItems((current) => current.map((item) => ({ ...item, selected: checked })));
    
    // Simpan perubahan massal global ke database
    await cartService.setAllSelected(user.id, checked);
  };

  /**
   * Memperbarui kuantitas produk di dalam keranjang.
   * 
   * @param id ID unik item keranjang
   * @param delta Jumlah perubahan (+1 atau -1)
   */
  const updateQuantity = async (id: string, delta: number) => {
    // Cari item target dalam state
    const target = items.find((item) => item.id === id);
    if (!target) return;

    // Batasi kuantitas minimal adalah 1
    const nextQuantity = Math.max(1, target.quantity + delta);
    
    // Update kuantitas baru di sisi client
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item
      )
    );
    
    // Simpan perubahan kuantitas ke database
    await cartService.updateQuantity(id, nextQuantity);
  };

  /**
   * Menghapus item produk dari daftar keranjang belanja.
   * 
   * @param id ID unik item keranjang
   */
  const removeItem = async (id: string) => {
    // Hapus item dari state client secara instan
    setItems((current) => current.filter((item) => item.id !== id));
    // Hapus dokumen item di database
    await cartService.removeItem(id);
  };

  /**
   * Mengarahkan pengguna menuju halaman konfirmasi pesanan (Checkout)
   */
  const handleCheckout = () => {
    router.push("/checkout");
  };

  // Menghitung subtotal dari produk-produk yang dicentang saja
  const subtotal = items.reduce(
    (acc, item) => (item.selected ? acc + item.price * item.quantity : acc),
    0
  );

  // Menghitung biaya jasa aplikasi jika subtotal > 0
  const fee = subtotal > 0 ? 5000 : 0;

  // Menghitung total biaya belanja keseluruhan
  const total = subtotal + fee;

  // Mengecek apakah seluruh item keranjang terpilih/dicentang
  const isAllChecked = items.length > 0 && items.every((item) => item.selected);

  // Menghitung total item yang terpilih/dicentang
  const selectedCount = items.filter((item) => item.selected).length;

  // UI STATE 1: Jika berstatus guest, tampilkan himbauan login
  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-surface-tint">
        <StickyHeader 
          title="Keranjang Saya" 
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="primary" />} 
        />
        <GuestEmptyState 
          title="Login untuk Menyimpan Barang" 
          description="Keranjang belanja hanya tersedia untuk pengguna terdaftar. Masuk sekarang untuk melanjutkan."
          icon={<Icons.Cart size={48} />}
        />
      </main>
    );
  }

  // UI UTAMA
  return (
    <div className="flex flex-col min-h-screen bg-surface-tint">
      {/* Header Halaman atas */}
      <StickyHeader 
        title="Keranjang Saya" 
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />} 
      />

      <main className="flex-1 px-6 pt-4 pb-48">
        
        {/* Seksi Pilihan Pilih Semua */}
        <div className="flex items-center justify-between mb-8 bg-white/60 backdrop-blur-xl p-4 rounded-[28px] border border-surface-muted shadow-soft">
          <Checkbox 
            label={<span className="font-bold text-text-main ml-2">Pilih Semua</span>}
            checked={isAllChecked}
            onChange={(e) => toggleAll(e.target.checked)}
          />
          <span className="text-[12px] font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full uppercase tracking-widest">
            {selectedCount} Item
          </span>
        </div>

        {/* Daftar Item Keranjang Terkelompok per Toko */}
        <div className="flex flex-col gap-10">
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedItems).map(([shopName, shopItems]) => {
              // Cek apakah semua produk di toko ini dicentang
              const isStoreChecked = shopItems.every((item) => item.selected);
              return (
                <motion.div 
                  key={shopName}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4"
                >
                  {/* Bagian Header Toko */}
                  <div className="flex items-center gap-3 px-2">
                    <Checkbox 
                      checked={isStoreChecked}
                      onChange={(e) => toggleStore(shopName, e.target.checked)}
                    />
                    <div className="flex items-center gap-2">
                      <Icons.Store size={18} className="text-primary" />
                      <h3 className="text-[14px] font-bold text-text-main">{shopName}</h3>
                      <Icons.Check size={12} className="text-white bg-primary rounded-full p-0.5" />
                    </div>
                  </div>

                  {/* Daftar Produk di Toko Tersebut */}
                  <div className="flex flex-col gap-4">
                    {shopItems.map((item) => (
                      <CartItemCard
                        key={item.id}
                        title={item.title}
                        shopName={item.shopName}
                        price={item.price}
                        image={item.image || undefined}
                        quantity={item.quantity}
                        isChecked={item.selected}
                        onCheck={(checked) => void toggleCheck(item.id, checked)}
                        onIncrement={() => void updateQuantity(item.id, 1)}
                        onDecrement={() => void updateQuantity(item.id, -1)}
                        onRemove={() => void removeItem(item.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Animasi Spinner Pemuatan Data */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}

          {/* Keadaan Kosong (Empty State) jika tidak ada produk di keranjang */}
          {!isLoading && items.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 text-text-sub"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-soft">
                <Icons.Cart size={48} className="text-primary/20" />
              </div>
              <h3 className="text-[18px] font-bold text-text-main">Wah, keranjangmu kosong</h3>
              <p className="text-[13px] font-medium text-text-sub/60">Yuk, cari kartu favoritmu sekarang!</p>
              <Button variant="primary" className="mt-8 px-10 h-14 rounded-full font-bold shadow-lg shadow-primary/20" onClick={() => router.push('/home')}>
                Mulai Belanja
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Ringkasan Belanja & Tombol Checkout (Footer Melayang) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-40 flex justify-center p-6 bg-linear-to-t from-surface-tint via-surface-tint/90 to-transparent pointer-events-none">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="w-full bg-white rounded-[32px] shadow-2xl p-8 pointer-events-auto border border-surface-muted"
        >
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex justify-between items-center text-[13px] font-medium text-text-sub">
              <span>Subtotal Produk</span>
              <span className="font-bold text-text-main">Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-medium text-text-sub">
              <span>Biaya Layanan</span>
              <span className="font-bold text-text-main">Rp {fee.toLocaleString("id-ID")}</span>
            </div>
            <div className="border-t-2 border-dashed border-surface-muted mt-3 pt-4 flex justify-between items-center">
              <span className="font-bold text-text-main text-[16px]">Total Bayar</span>
              <span className="font-bold text-primary text-[24px]">Rp {total.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* Tombol checkout (hanya aktif jika minimal ada 1 item yang dipilih) */}
          <Button 
            variant="primary" 
            disabled={selectedCount === 0}
            onClick={handleCheckout}
            className="w-full h-16 rounded-2xl text-[16px] font-bold shadow-lg shadow-primary/30 uppercase tracking-widest"
          >
            Checkout ({selectedCount})
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
