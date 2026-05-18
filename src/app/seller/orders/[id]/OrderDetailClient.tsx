"use client";

import React, { useEffect, useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import {
  formatSellerOrderStatus,
  orderService,
} from "@/lib/services/order";
import type { SellerOrder } from "@/types";

export default function OrderDetailClient({ id }: { id: string }) {
  return (
    <ProtectedRoute requireSeller={true}>
      <SellerOrderDetailContent id={id} />
    </ProtectedRoute>
  );
}

function SellerOrderDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<SellerOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShipping, setIsShipping] = useState(false);

  useEffect(() => {
    if (!user || !id) return;

    const loadOrder = async () => {
      try {
        setIsLoading(true);
        const nextOrder = await orderService.getSellerOrderById(user.id, id);
        setOrder(nextOrder);
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrder();
  }, [id, user]);

  const handleShipOrder = async () => {
    if (!user || !order) return;

    try {
      setIsShipping(true);
      const updatedOrder = await orderService.markOrderAsShipped(order.id, user.id);
      setOrder(updatedOrder);
    } finally {
      setIsShipping(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-surface-tint">
        <StickyHeader
          title="Detail Pesanan"
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="secondary" />}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-surface-tint">
        <StickyHeader
          title="Detail Pesanan"
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="secondary" />}
        />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-soft">
            <Icons.Dikemas size={40} className="text-secondary opacity-20" />
          </div>
          <h2 className="text-[18px] font-bold text-text-main">Pesanan Tidak Ditemukan</h2>
          <p className="text-[14px] text-text-sub mt-2 mb-8">
            Data pesanan mungkin sudah dihapus atau tidak tersedia.
          </p>
          <button
            onClick={() => router.push("/seller/orders")}
            className="px-10 h-14 bg-secondary text-white font-bold rounded-full shadow-lg shadow-secondary/20"
          >
            Kembali ke Pesanan
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-tint pb-32">
      <StickyHeader
        title="Detail Pesanan"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="secondary" />}
      />

      <main className="px-6 pt-6 flex flex-col gap-6">
        <section className="bg-white p-6 rounded-[32px] border border-surface-muted shadow-soft flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-text-sub uppercase tracking-widest">
              Status Pesanan
            </span>
            <h2 className="text-[18px] font-bold text-secondary">
              {formatSellerOrderStatus(order.status)}
            </h2>
            <span className="text-[12px] text-text-sub mt-1">{order.orderCode}</span>
          </div>
          <Icons.Dikemas size={32} className="text-secondary/50" />
        </section>

        <section className="bg-white p-6 rounded-[32px] border border-surface-muted shadow-soft flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-surface-muted pb-3">
            <Icons.Delivery size={20} className="text-secondary" />
            <h3 className="text-[14px] font-bold text-text-main uppercase tracking-widest">
              Informasi Pengiriman
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <span className="text-[12px] text-text-sub font-bold">Kurir</span>
              <span className="text-[14px] font-bold text-text-main">
                {order.courier} ({order.shippingEtd})
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-text-sub font-bold">Penerima</span>
              <span className="text-[14px] font-bold text-text-main">
                {order.customerName} ({order.phone})
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-text-sub font-bold">Alamat Lengkap</span>
              <span className="text-[13px] font-medium text-text-main leading-relaxed">
                {order.address}
              </span>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-[32px] border border-surface-muted shadow-soft flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-surface-muted pb-3">
            <Icons.Collection size={20} className="text-secondary" />
            <h3 className="text-[14px] font-bold text-text-main uppercase tracking-widest">
              Daftar Produk ({order.items.length})
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-surface-muted border border-surface-muted shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-secondary/10 flex items-center justify-center">
                      <Icons.Collection size={24} className="text-secondary/30" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 justify-center">
                  <h4 className="text-[14px] font-bold text-text-main line-clamp-1">
                    {item.title}
                  </h4>
                  <span className="text-[12px] text-text-sub">{item.condition}</span>
                  <div className="flex justify-between items-center mt-2 gap-3">
                    <span className="text-[14px] font-bold text-secondary">
                      Rp {item.totalPrice.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[12px] font-bold text-text-sub">
                      x{item.qty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-surface-muted flex flex-col gap-2">
            <div className="flex justify-between items-center text-[13px] text-text-sub font-medium">
              <span>Subtotal</span>
              <span>Rp {order.subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-[13px] text-text-sub font-medium">
              <span>Ongkir</span>
              <span>Rp {order.shippingFee.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-[13px] text-text-sub font-medium">
              <span>Biaya Layanan</span>
              <span>Rp {order.appFee.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-surface-muted">
              <span className="text-[14px] font-bold text-text-sub">Total Pesanan</span>
              <span className="text-[18px] font-bold text-secondary">
                Rp {order.totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </section>
      </main>

      {order.status === "packed" && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-6 bg-linear-to-t from-surface-tint via-surface-tint/90 to-transparent">
          <Button
            variant="secondary"
            className="w-full h-14 rounded-2xl text-[16px] font-bold uppercase tracking-widest shadow-lg shadow-secondary/20"
            disabled={isShipping}
            onClick={() => void handleShipOrder()}
          >
            {isShipping ? "Mengirim..." : "Kirim Pesanan"}
          </Button>
        </div>
      )}
    </div>
  );
}
