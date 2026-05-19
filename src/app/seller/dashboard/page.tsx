"use client";

import React from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { MenuListItem } from "@/components/ui/MenuListItem";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { productService } from "@/lib/services/product";
import { orderService, formatSellerOrderStatus } from "@/lib/services/order";
import type { SellerOrder } from "@/types";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function SellerDashboardPage() {
  return (
    <ProtectedRoute requireSeller={true}>
      <SellerDashboardContent />
    </ProtectedRoute>
  );
}

function SellerDashboardContent() {
  const router = useRouter();
  const { store } = useAuth();
  const [productCount, setProductCount] = React.useState(0);
  const [sellerOrders, setSellerOrders] = React.useState<SellerOrder[]>([]);

  React.useEffect(() => {
    const loadProducts = async () => {
      if (!store?.id) {
        setProductCount(0);
        return;
      }

      try {
        const products = await productService.listSellerProducts(store.id);
        setProductCount(products.length);
      } catch {
        setProductCount(0);
      }
    };

    void loadProducts();
  }, [store?.id]);

  React.useEffect(() => {
    const loadOrders = async () => {
      if (!store?.ownerUserId) {
        setSellerOrders([]);
        return;
      }

      try {
        const orders = await orderService.listSellerOrders(store.ownerUserId);
        setSellerOrders(orders);
      } catch {
        setSellerOrders([]);
      }
    };

    void loadOrders();
  }, [store?.ownerUserId]);

  const pendingCount = sellerOrders.filter((order) => order.status === "packed").length;
  const shippedCount = sellerOrders.filter((order) => order.status === "shipped").length;
  const recentSales = sellerOrders.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-white pb-32">
      <StickyHeader
        title="Dashboard Toko"
        variant="minimal"
        size="sm"
        leftAction={
          <BackButton variant="secondary" onClick={() => router.push("/profile")} />
        }
      />

      <main className="flex-1 px-6 pt-6">
        <div className="w-full bg-linear-to-br bg-secondary to-secondary/15 rounded-[24px] p-6 text-white shadow-medium mb-6 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-text-main/10 blur-xl" />

          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-medium text-white/80">
                {store?.name || "Saldo Penghasilan"}
              </span>
              <Icons.Wallet size={20} className="text-white/80" />
            </div>
            <h2 className="text-[32px] font-bold tracking-tight leading-none mb-4">Rp 0</h2>
            <button
              type="button"
              disabled
              className="bg-white text-secondary/70 font-bold text-[13px] px-6 py-2.5 rounded-full w-fit shadow-soft cursor-not-allowed opacity-80"
            >
              Tarik Saldo Segera Hadir
            </button>
            <p className="mt-3 text-[11px] font-medium text-white/80">
              Payout penjual belum dibuka karena alur pencairan backend belum
              diaktifkan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <Link href="/seller/orders?tab=Pending">
            <StatBox icon={<Icons.Cart size={20} />} title="Pesanan Baru" count={pendingCount} />
          </Link>
          <Link href="/seller/orders?tab=Processing">
            <StatBox icon={<Icons.MapPin size={20} />} title="Dikirim" count={shippedCount} />
          </Link>
          <Link href="/seller/products">
            <StatBox icon={<Icons.Collection size={20} />} title="Produk" count={productCount} />
          </Link>
        </div>

        <h3 className="text-[14px] font-bold text-text-sub uppercase tracking-wider px-2 mb-3">
          Manajemen Toko
        </h3>
        <div className="bg-white rounded-card overflow-hidden shadow-soft border border-surface-muted mb-8">
          <MenuListItem
            icon={<Icons.Chart size={20} />}
            label="Laporan Penjualan"
            href="/seller/reports"
            showBorder
          />
          <MenuListItem
            icon={<Icons.Collection size={20} />}
            label="Kelola Produk"
            href="/seller/products"
            showBorder
          />
          <MenuListItem
            icon={<Icons.Cart size={20} />}
            label="Pesanan Masuk"
            href="/seller/orders"
            showBorder
          />
          <MenuListItem
            icon={<Icons.Settings size={20} />}
            label="Pengaturan Toko"
            href="/seller/settings"
          />
        </div>

        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-[14px] font-bold text-text-sub uppercase tracking-wider">
            Penjualan Terbaru
          </h3>
          <Link href="/seller/orders" className="text-[12px] font-bold text-secondary uppercase">
            Lihat Semua
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {recentSales.length > 0 ? (
            recentSales.map((sale) => (
              <RecentSaleItem
                key={sale.id}
                title={sale.items[0]?.title || "Pesanan"}
                price={sale.totalPrice}
                status={formatSellerOrderStatus(sale.status)}
                date={new Date(sale.date).toLocaleDateString("id-ID")}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 bg-white/50 rounded-card border border-dashed border-surface-muted text-text-sub">
              <span className="text-[12px] font-medium italic">
                Belum ada penjualan terbaru
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function RecentSaleItem({
  title,
  price,
  status,
  date,
}: {
  title: string;
  price: number;
  status: string;
  date: string;
}) {
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="bg-white p-4 rounded-card shadow-soft border border-surface-muted flex items-center justify-between">
      <div className="flex flex-col gap-0.5">
        <span className="text-[14px] font-bold text-text-main line-clamp-1">{title}</span>
        <span className="text-[12px] text-text-sub">{date}</span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[14px] font-bold text-secondary">{formatPrice(price)}</span>
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
            status === "Selesai" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
          )}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function StatBox({
  icon,
  title,
  count,
  alert = false,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  alert?: boolean;
}) {
  return (
    <div className="bg-white p-3 rounded-[20px] shadow-soft border border-surface-muted flex flex-col items-center justify-center text-center relative gap-1">
      {alert && (
        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white animate-pulse" />
      )}
      <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-1">
        {icon}
      </div>
      <span className="text-[18px] font-bold text-text-main leading-none">{count}</span>
      <span className="text-[10px] font-medium text-text-sub leading-tight">{title}</span>
    </div>
  );
}
