"use client";

import React, { useState, useMemo } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { CartItemCard } from "@/components/ui/CartItemCard";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";
import { Icons } from "@/components/ui/Icons";

interface CartItem {
  id: string;
  title: string;
  shopName: string;
  price: number;
  quantity: number;
  isChecked: boolean;
}

const INITIAL_CART: CartItem[] = [];

export default function CartPage() {
  const router = useRouter();
  const { isGuest } = useAuth();
  const [items, setItems] = useState(INITIAL_CART);

  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.shopName]) acc[item.shopName] = [];
      acc[item.shopName].push(item);
      return acc;
    }, {} as Record<string, typeof items>);
  }, [items]);

  const toggleCheck = (id: string, checked: boolean) => {
    setItems(items.map(item => item.id === id ? { ...item, isChecked: checked } : item));
  };

  const toggleStore = (shopName: string, checked: boolean) => {
    setItems(items.map(item => item.shopName === shopName ? { ...item, isChecked: checked } : item));
  };

  const toggleAll = (checked: boolean) => {
    setItems(items.map(item => ({ ...item, isChecked: checked })));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const subtotal = items.reduce((acc, item) => item.isChecked ? acc + (item.price * item.quantity) : acc, 0);
  const fee = subtotal > 0 ? 5000 : 0;
  const total = subtotal + fee;
  const isAllChecked = items.length > 0 && items.every(item => item.isChecked);
  const selectedCount = items.filter(item => item.isChecked).length;

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

  return (
    <div className="flex flex-col min-h-screen bg-surface-tint">
      <StickyHeader 
        title="Keranjang Saya" 
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />} 
      />

      <main className="flex-1 px-6 pt-4 pb-48">
        {/* Select All Bar */}
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

        {/* Grouped Cart Items */}
        <div className="flex flex-col gap-10">
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedItems).map(([shopName, shopItems]) => {
              const isStoreChecked = shopItems.every(i => i.isChecked);
              return (
                <motion.div 
                  key={shopName}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4"
                >
                  {/* Store Header */}
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

                  {/* Store Products List */}
                  <div className="flex flex-col gap-4">
                    {shopItems.map((item) => (
                      <CartItemCard
                        key={item.id}
                        title={item.title}
                        shopName={item.shopName}
                        price={item.price}
                        quantity={item.quantity}
                        isChecked={item.isChecked}
                        onCheck={(checked) => toggleCheck(item.id, checked)}
                        onIncrement={() => updateQuantity(item.id, 1)}
                        onDecrement={() => updateQuantity(item.id, -1)}
                        onRemove={() => removeItem(item.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {items.length === 0 && (
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

      {/* Checkout Summary Footer */}
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
