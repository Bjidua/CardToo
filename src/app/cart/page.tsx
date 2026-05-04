"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { CartItemCard } from "@/components/ui/CartItemCard";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_CART = [
  { id: "1", title: "Tittle", shopName: "Name Shop", price: 0, quantity: 1, isChecked: false },
  { id: "2", title: "Tittle", shopName: "Name Shop", price: 0, quantity: 1, isChecked: false },
  { id: "3", title: "Tittle", shopName: "Name Shop", price: 0, quantity: 1, isChecked: false },
  { id: "4", title: "Tittle", shopName: "Name Shop", price: 0, quantity: 1, isChecked: false },
];

export default function CartPage() {
  const [items, setItems] = useState(INITIAL_CART);

  const toggleCheck = (id: string, checked: boolean) => {
    setItems(items.map(item => item.id === id ? { ...item, isChecked: checked } : item));
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

  const subtotal = items.reduce((acc, item) => item.isChecked ? acc + (item.price * item.quantity) : acc, 0);
  const fee = 0;
  const total = subtotal + fee;

  const isAllChecked = items.length > 0 && items.every(item => item.isChecked);

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-[#F7F9FA] to-[#F6DFFF]">
      <StickyHeader 
        title="My Cart" 
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />} 
      />

      <main className="flex-1 px-6 pt-4 pb-40">
        {/* Select All */}
        <div className="flex items-center mb-6">
          <Checkbox 
            label="All" 
            checked={isAllChecked}
            onChange={(e) => toggleAll(e.target.checked)}
          />
        </div>

        {/* Cart Items */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <CartItemCard
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
              </motion.div>
            ))}
          </AnimatePresence>

          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p>Keranjang kamu kosong</p>
            </div>
          )}
        </div>
      </main>

      {/* Checkout Summary Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center p-6 bg-transparent pointer-events-none">
        <div className="w-full max-w-[400px] bg-surface-light rounded-[16px] shadow-2xl p-6 pointer-events-auto border border-gray-100">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex justify-between items-center text-[16px]">
              <span className="font-normal text-black">Subtotal</span>
              <span className="font-bold text-black">Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-[16px]">
              <span className="font-normal text-black">Fee</span>
              <span className="font-bold text-black">Rp {fee.toLocaleString("id-ID")}</span>
            </div>
            <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between items-center text-[16px]">
              <span className="font-bold text-black">Total</span>
              <span className="font-bold text-black">Rp {total.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <Button variant="secondary" className="w-full h-[55px] rounded-[26px] text-[16px] font-bold shadow-soft">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
