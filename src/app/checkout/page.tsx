"use client";

import React, { useEffect, useMemo, useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GuestEmptyState } from "@/components/auth/GuestEmptyState";
import { addressService } from "@/lib/services/address";
import { cartService } from "@/lib/services/cart";
import { orderService } from "@/lib/services/order";
import type { Address, CartItem, ShippingMethodOption } from "@/types";

// Konfigurasi daftar metode pengiriman (kurir) beserta harga & estimasi waktu sampai (ETD)
const SHIPPING_METHODS: ShippingMethodOption[] = [
  { id: "reg", name: "J&T Reguler", price: 15000, etd: "2-3 Hari" },
  { id: "exp", name: "JNE YES", price: 35000, etd: "Esok Sampai" },
  { id: "hmt", name: "SiCepat Halu", price: 12000, etd: "4-5 Hari" },
];

// Konfigurasi metode pembayaran yang didukung (saat ini hanya QRIS)
const PAYMENT_METHODS = [
  { id: "qr", name: "QRIS (OVO, Dana, GoPay)", icon: <Icons.QR size={20} /> },
] as const;

/**
 * Halaman Proses Checkout Belanja (CheckoutPage)
 * Mengelola proses pembuatan pesanan dari item-item yang terpilih di keranjang belanja,
 * pemilihan alamat pengiriman, pemilihan kurir logistik, dan penghitungan biaya akhir.
 */
export default function CheckoutPage() {
  const router = useRouter();

  // Mendapatkan data user login dan status guest dari AuthContext
  const { isGuest, user } = useAuth();

  // State untuk menyimpan kurir pengiriman terpilih (default: J&T Reguler)
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[0]);

  // State untuk menyimpan metode pembayaran terpilih (default: QRIS)
  const [selectedPayment] = useState(PAYMENT_METHODS[0]);

  // State alamat pengiriman aktif
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // State penampung item-item keranjang belanja yang terpilih untuk dibeli
  const [items, setItems] = useState<CartItem[]>([]);

  // State indikator pemuatan data utama dari database
  const [isLoading, setIsLoading] = useState(false);

  // State indikator submit pembuatan pesanan di database
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State penampung pesan error jika proses memuat/submit gagal
  const [error, setError] = useState("");

  /**
   * Effect Hook untuk memuat data item terpilih & alamat utama pengguna.
   * Dipicu ketika data user/guest sudah teridentifikasi di sisi client.
   */
  useEffect(() => {
    if (!user || isGuest) return;

    const loadCheckoutData = async () => {
      try {
        setIsLoading(true);
        // Memuat item yang dicentang di keranjang & alamat utama secara paralel
        const [nextItems, nextAddress] = await Promise.all([
          cartService.getSelectedItems(user.id),
          addressService.getPrimaryAddress(user.id),
        ]);

        setItems(nextItems);
        setSelectedAddress(nextAddress);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal memuat data checkout."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadCheckoutData();
  }, [isGuest, user]);

  /**
   * Mengumpulkan ID toko unik dari list produk untuk membatasi checkout multi-toko.
   * Menggunakan useMemo agar perhitungan hanya berjalan saat data `items` berubah.
   */
  const storeIds = useMemo(
    () => Array.from(new Set(items.map((item) => item.storeId))),
    [items]
  );

  // Perhitungan Subtotal Produk
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Perhitungan ongkos kirim berdasarkan kurir terpilih
  const shippingFee = selectedShipping.price;

  // Biaya aplikasi (platform fee) sebesar Rp 2.500 jika ada produk yang dibeli
  const appFee = subtotal > 0 ? 2500 : 0;

  // Total pembayaran akhir yang harus dibayarkan
  const total = subtotal + shippingFee + appFee;

  /**
   * Mengirim pesanan ke server dan mengarahkan pengguna ke halaman pembayaran.
   */
  const handlePlaceOrder = async () => {
    if (!user) return;

    try {
      setError("");
      setIsSubmitting(true);
      
      // Membuat entitas order baru di database melalui API orderService
      const order = await orderService.createOrderFromSelectedCart(user.id, {
        shippingMethod: selectedShipping,
        paymentMethod: "qris",
      });
      
      // Jika berhasil, arahkan ke halaman pembayaran dengan query parameter ID order terkait
      router.push(`/checkout/payment?orderId=${order.id}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal membuat pesanan."
      );
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  /**
   * Utilitas format angka desimal menjadi format mata uang Rupiah
   */
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  // UI STATE 1: Jika berstatus guest, arahkan login terlebih dahulu
  if (isGuest) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-surface-tint">
        <StickyHeader
          title="Konfirmasi Pesanan"
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="primary" />}
        />
        <GuestEmptyState
          title="Login untuk Checkout"
          description="Masuk dulu ke akun CardToo supaya kamu bisa melanjutkan pembayaran."
          icon={<Icons.Cart size={48} />}
        />
      </main>
    );
  }

  // UI STATE 2: Menampilkan loading spinner selama data alamat & keranjang dimuat
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-tint">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // UI STATE 3: Jika tidak ada produk terpilih untuk dicheckout
  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-surface-tint">
        <StickyHeader
          title="Konfirmasi Pesanan"
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="primary" />}
        />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-soft">
            <Icons.Cart size={40} className="text-primary opacity-20" />
          </div>
          <h2 className="text-[18px] font-bold text-text-main">Belum Ada Item</h2>
          <p className="text-[14px] text-text-sub mt-2 mb-8">
            Pilih item dari keranjang Anda untuk melanjutkan checkout.
          </p>
          <Button onClick={() => router.push("/cart")} className="px-10 h-14 rounded-full">
            Kembali ke Keranjang
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-tint pb-64">
      {/* Header Halaman atas */}
      <StickyHeader
        title="Konfirmasi Pesanan"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="px-6 pt-6 flex flex-col gap-8">
        
        {/* Seksi 1: Alamat Pengiriman */}
        <section className="bg-white p-6 rounded-[32px] shadow-soft border border-surface-muted">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icons.MapPin size={18} className="text-primary" />
              <h3 className="text-[14px] font-bold text-text-main uppercase tracking-widest">
                Alamat Pengiriman
              </h3>
            </div>
            <button
              onClick={() => router.push("/profile/address")}
              className="text-[12px] font-bold text-primary"
            >
              Ubah
            </button>
          </div>

          {selectedAddress ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-text-main">
                  {selectedAddress.name}
                </span>
                <span className="w-1 h-1 bg-text-sub rounded-full" />
                <span className="text-[13px] text-text-sub">
                  {selectedAddress.phone}
                </span>
              </div>
              <p className="text-[13px] text-text-sub leading-relaxed">
                {selectedAddress.details}
              </p>
            </div>
          ) : (
            <div
              onClick={() => router.push("/profile/address")}
              className="py-4 border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <Icons.Plus size={20} className="text-primary" />
              <span className="text-[12px] font-bold text-primary">
                Tambah Alamat Baru
              </span>
            </div>
          )}
        </section>

        {/* Seksi 2: Daftar Item yang Dibeli */}
        <section className="flex flex-col gap-4">
          <h3 className="text-[14px] font-bold text-text-main uppercase tracking-widest px-2">
            Item Pesanan
          </h3>
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-[32px] shadow-soft border border-surface-muted flex gap-4"
              >
                <div className="w-20 h-20 relative rounded-2xl overflow-hidden bg-surface-muted border border-surface-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-bold uppercase text-text-main/10">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-[14px] font-bold text-text-main leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-text-sub mt-1">{item.shopName}</p>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <span className="text-[14px] font-bold text-primary">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-[12px] font-bold text-text-sub">
                      x{item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seksi 3: Pilihan Kurir Pengiriman */}
        <section className="flex flex-col gap-4">
          <h3 className="text-[14px] font-bold text-text-main uppercase tracking-widest px-2">
            Metode Pengiriman
          </h3>
          <div className="flex flex-col gap-3">
            {SHIPPING_METHODS.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedShipping(method)}
                className={cn(
                  "p-5 rounded-[28px] border-2 transition-all flex items-center justify-between cursor-pointer",
                  selectedShipping.id === method.id
                    ? "bg-primary/5 border-primary shadow-lg shadow-primary/10"
                    : "bg-white border-surface-muted"
                )}
              >
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-[14px] font-bold",
                      selectedShipping.id === method.id
                        ? "text-primary"
                        : "text-text-main"
                    )}
                  >
                    {method.name}
                  </span>
                  <span className="text-[12px] text-text-sub font-medium">
                    Estimasi {method.etd}
                  </span>
                </div>
                <span className="text-[14px] font-bold text-text-main">
                  {formatPrice(method.price)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Seksi 4: Metode Pembayaran */}
        <section className="flex flex-col gap-4">
          <h3 className="text-[14px] font-bold text-text-main uppercase tracking-widest px-2">
            Metode Pembayaran
          </h3>
          <div className="bg-white p-5 rounded-[32px] shadow-soft border border-surface-muted flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {selectedPayment.icon}
              </div>
              <span className="text-[14px] font-bold text-text-main">
                {selectedPayment.name}
              </span>
            </div>
            <Icons.Check size={20} className="text-primary" />
          </div>
        </section>

        {/* Notifikasi limitasi transaksi multi-toko (v1) */}
        {storeIds.length > 1 && (
          <p className="px-2 text-[12px] font-medium text-danger">
            Checkout v1 hanya mendukung item dari satu toko dalam satu transaksi.
          </p>
        )}

        {/* Penampil error jika proses checkout gagal */}
        {error && (
          <p className="px-2 text-[12px] font-medium text-danger">{error}</p>
        )}
      </main>

      {/* Ringkasan Biaya Belanja & Tombol Konfirmasi Pesanan */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 bg-white border-t border-surface-muted p-6 flex flex-col gap-6 rounded-t-[32px] shadow-2xl">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-text-sub font-medium">Subtotal Produk</span>
            <span className="text-text-main font-bold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-text-sub font-medium">Ongkos Kirim</span>
            <span className="text-text-main font-bold">
              {formatPrice(shippingFee)}
            </span>
          </div>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-text-sub font-medium">Biaya Aplikasi</span>
            <span className="text-text-main font-bold">{formatPrice(appFee)}</span>
          </div>
          <div className="h-px bg-surface-muted my-1" />
          <div className="flex justify-between items-center">
            <span className="text-[15px] font-bold text-text-main uppercase tracking-widest">
              Total Pembayaran
            </span>
            <span className="text-[20px] font-bold text-primary">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {/* Tombol aksi utama untuk membuat invoice pesanan */}
        <Button
          onClick={() => void handlePlaceOrder()}
          disabled={!selectedAddress || storeIds.length > 1 || isSubmitting}
          className="w-full h-16 rounded-[24px] text-[16px] font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
        >
          {isSubmitting ? "Memproses..." : "Konfirmasi Pesanan"}
        </Button>
      </div>
    </div>
  );
}
