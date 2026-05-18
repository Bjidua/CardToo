"use client";

import React, { useEffect, useMemo, useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";
import { orderService } from "@/lib/services/order";
import type { BuyerOrder } from "@/types";

type TrackingStep = {
  id: number;
  title: string;
  time: string;
  status: "completed" | "current" | "upcoming";
  icon: React.ReactNode;
};

const formatStepTime = (value: string | null) =>
  value
    ? new Date(value).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const buildTrackingSteps = (order: BuyerOrder): TrackingStep[] => {
  const hasPaid = Boolean(order.paidAt);
  const isPacked = ["packed", "shipped", "completed"].includes(order.status);
  const isShipped = ["shipped", "completed"].includes(order.status);
  const isCompleted = order.status === "completed";

  return [
    {
      id: 1,
      title: "Pesanan Dibuat",
      time: formatStepTime(order.createdAt),
      status: "completed",
      icon: <Icons.Collection size={20} />,
    },
    {
      id: 2,
      title: "Pembayaran Dikonfirmasi",
      time: formatStepTime(order.paidAt),
      status: hasPaid
        ? "completed"
        : order.status === "unpaid"
          ? "current"
          : "upcoming",
      icon: <Icons.Wallet size={20} />,
    },
    {
      id: 3,
      title: "Pesanan Sedang Dikemas",
      time: isPacked ? formatStepTime(order.paidAt || order.updatedAt) : "-",
      status: isPacked
        ? "completed"
        : hasPaid
          ? "current"
          : "upcoming",
      icon: <Icons.Dikemas size={20} />,
    },
    {
      id: 4,
      title: `Dalam Pengiriman (${order.shippingMethod})`,
      time: isShipped ? formatStepTime(order.updatedAt) : "-",
      status: isShipped
        ? isCompleted
          ? "completed"
          : "current"
        : "upcoming",
      icon: <Icons.Delivery size={20} />,
    },
    {
      id: 5,
      title: "Pesanan Sampai di Tujuan",
      time: isCompleted ? formatStepTime(order.updatedAt) : "-",
      status: isCompleted ? "current" : "upcoming",
      icon: <Icons.Home size={20} />,
    },
  ];
};

export default function TrackClient({ id }: { id: string }) {
  const { user, isGuest } = useAuth();
  const [order, setOrder] = useState<BuyerOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || isGuest || !id) return;

    const loadOrder = async () => {
      try {
        setIsLoading(true);
        const nextOrder = await orderService.getBuyerOrderById(user.id, id);
        setOrder(nextOrder);
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrder();
  }, [id, isGuest, user]);

  const trackingSteps = useMemo(
    () => (order ? buildTrackingSteps(order) : []),
    [order]
  );

  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-surface-tint">
        <StickyHeader
          title="Lacak Pesanan"
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="primary" />}
        />
        <GuestEmptyState
          title="Login untuk Lacak Pesanan"
          description="Detail pengiriman hanya tersedia untuk pengguna yang sudah masuk."
          icon={<Icons.Delivery size={48} />}
        />
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-tint">
      <StickyHeader
        title="Lacak Pesanan"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="px-6 pt-8 pb-32 flex flex-col gap-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : !order ? (
          <section className="bg-white p-8 rounded-[32px] border border-surface-muted shadow-soft flex flex-col items-center text-center gap-3">
            <Icons.Delivery size={32} className="text-primary/30" />
            <p className="text-[16px] font-bold text-text-main">Pesanan Tidak Ditemukan</p>
            <p className="text-[13px] text-text-sub">
              Data pelacakan belum tersedia untuk pesanan ini.
            </p>
          </section>
        ) : (
          <>
            <section className="bg-white p-6 rounded-[32px] border border-surface-muted shadow-soft flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Icons.Delivery size={32} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-text-sub uppercase tracking-widest">
                  Kode Pesanan
                </span>
                <span className="text-[16px] font-bold text-text-main">
                  {order.orderCode}
                </span>
              </div>
            </section>

            <section className="flex flex-col gap-6 pl-4">
              {trackingSteps.map((step, index) => (
                <div key={step.id} className="relative flex gap-6">
                  {index !== trackingSteps.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-[20px] top-[40px] w-0.5 h-[calc(100%+24px)]",
                        step.status === "completed" ? "bg-primary" : "bg-surface-muted"
                      )}
                    />
                  )}

                  <div
                    className={cn(
                      "relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm",
                      step.status === "completed" && "bg-primary text-white",
                      step.status === "current" &&
                        "bg-accent text-white scale-110 ring-4 ring-accent/20",
                      step.status === "upcoming" && "bg-surface-muted text-text-sub/40"
                    )}
                  >
                    {step.icon}
                  </div>

                  <div className="flex flex-col gap-1 pb-10">
                    <h3
                      className={cn(
                        "text-[15px] font-bold",
                        step.status === "upcoming"
                          ? "text-text-sub/40"
                          : "text-text-main"
                      )}
                    >
                      {step.title}
                    </h3>
                    <span className="text-[12px] text-text-sub font-medium">
                      {step.time}
                    </span>
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-4 bg-primary/5 p-6 rounded-[32px] border border-primary/10 flex flex-col items-center text-center gap-3">
              <Icons.Message size={24} className="text-primary" />
              <p className="text-[13px] font-bold text-text-main">
                Ada kendala dengan pengiriman?
              </p>
              <button
                onClick={() => (window.location.href = "/messages")}
                className="text-[12px] font-bold text-primary uppercase tracking-widest bg-white px-6 py-2 rounded-full shadow-soft"
              >
                Hubungi Seller
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
