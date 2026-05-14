"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Image from "next/image";
import { getAssetPath } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { SellerOrder, SellerOrderItem } from "@/types";

export default function OrderDetailClient({ id }: { id: string }) {
  const router = useRouter();
  
  // Data akan di-fetch dari Appwrite saat integrasi backend
  const [order] = useState<SellerOrder | null>(null);

  if (!order) {
    return (
      <ProtectedRoute requireSeller={true}>
        <div className="flex flex-col min-h-screen bg-surface-tint">
          <StickyHeader 
            title="Detail Pesanan" 
            variant="minimal" 
            size="sm" 
            leftAction={<BackButton variant="secondary"/>} 
          />
          <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-soft">
              <Icons.Dikemas size={40} className="text-secondary opacity-20" />
            </div>
            <h2 className="text-[18px] font-bold text-text-main">Pesanan Tidak Ditemukan</h2>
            <p className="text-[14px] text-text-sub mt-2 mb-8">Data pesanan mungkin sudah dihapus atau tidak tersedia.</p>
            <button 
              onClick={() => router.push("/seller/orders")}
              className="px-10 h-14 bg-secondary text-white font-bold rounded-full shadow-lg shadow-secondary/20"
            >
              Kembali ke Pesanan
            </button>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireSeller={true}>
      <div className="flex flex-col min-h-screen bg-surface-tint pb-32">
        <StickyHeader 
          title="Detail Pesanan" 
          variant="minimal" 
          size="sm" 
          leftAction={<BackButton variant="secondary"/>} 
        />

        <main className="px-6 pt-6 flex flex-col gap-6">
          {/* Status Header */}
          <section className="bg-white p-6 rounded-[32px] border border-surface-muted shadow-soft flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-text-sub uppercase tracking-widest">Status Pesanan</span>
              <h2 className="text-[18px] font-bold text-secondary">{order.status === "Pending" ? "Perlu Dikirim" : order.status}</h2>
            </div>
            <Icons.Dikemas size={32} className="text-secondary/50" />
          </section>

          {/* Customer & Shipping Info */}
          <section className="bg-white p-6 rounded-[32px] border border-surface-muted shadow-soft flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-surface-muted pb-3">
              <Icons.Delivery size={20} className="text-secondary" />
              <h3 className="text-[14px] font-bold text-text-main uppercase tracking-widest">Informasi Pengiriman</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <span className="text-[12px] text-text-sub font-bold">Kurir</span>
                <span className="text-[14px] font-bold text-text-main">{order.courier}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-text-sub font-bold">Penerima</span>
                <span className="text-[14px] font-bold text-text-main">{order.customerName} ({order.phone})</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-text-sub font-bold">Alamat Lengkap</span>
                <span className="text-[13px] font-medium text-text-main leading-relaxed">
                  {order.address}
                </span>
              </div>
            </div>
          </section>

          {/* Order Items */}
          <section className="bg-white p-6 rounded-[32px] border border-surface-muted shadow-soft flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-surface-muted pb-3">
              <Icons.Collection size={20} className="text-secondary" />
              <h3 className="text-[14px] font-bold text-text-main uppercase tracking-widest">Daftar Produk ({order.items.length})</h3>
            </div>

            <div className="flex flex-col gap-4">
              {order.items.map((item: SellerOrderItem) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-surface-muted border border-surface-muted">
                    {/* Gambar fallback jika URL error */}
                    <div className="absolute inset-0 bg-secondary/10 flex items-center justify-center">
                      <Icons.Collection size={24} className="text-secondary/30" />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 justify-center">
                    <h4 className="text-[14px] font-bold text-text-main line-clamp-1">{item.title}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[14px] font-bold text-secondary">
                        Rp {item.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[12px] font-bold text-text-sub">x{item.qty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-surface-muted">
              <span className="text-[14px] font-bold text-text-sub">Total Pendapatan</span>
              <span className="text-[18px] font-bold text-secondary">
                Rp {order.totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
