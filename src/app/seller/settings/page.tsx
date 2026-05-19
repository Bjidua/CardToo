"use client";

import React, { useEffect, useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { commerceGatewayService } from "@/lib/services/commerceGateway";
import { reviewService } from "@/lib/services/review";
import { storeService } from "@/lib/services/store";
import type { Store } from "@/types";
import { useRouter } from "next/navigation";

export default function SellerSettingsPage() {
  return (
    <ProtectedRoute requireSeller={true}>
      <SellerSettingsContent />
    </ProtectedRoute>
  );
}

function SellerSettingsContent() {
  const { store, user, refreshAuth } = useAuth();
  if (!store || !user) {
    return (
      <div className="flex flex-col min-h-screen bg-surface-tint">
        <StickyHeader
          title="Pengaturan Toko"
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="secondary" />}
        />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
        </main>
      </div>
    );
  }

  return (
    <SellerSettingsForm
      key={`${store.id}:${store.name}:${store.bannerUrl ?? ""}:${store.description}:${store.location}`}
      store={store}
      userId={user.id}
      refreshAuth={refreshAuth}
    />
  );
}

function SellerSettingsForm({
  store,
  userId,
  refreshAuth,
}: {
  store: Store;
  userId: string;
  refreshAuth: () => Promise<void>;
}) {
  const router = useRouter();
  const [storeName, setStoreName] = useState(store.name);
  const [description, setDescription] = useState(store.description);
  const [location, setLocation] = useState(store.location || "Indonesia");
  const [coverImage, setCoverImage] = useState<string | null>(
    store.bannerUrl || store.coverImage || null
  );
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isClosingStore, setIsClosingStore] = useState(false);
  const [storeRating, setStoreRating] = useState("0.0");
  const [responseTime] = useState("Belum dihitung otomatis");

  useEffect(() => {
    return () => {
      if (coverImage?.startsWith("blob:")) {
        URL.revokeObjectURL(coverImage);
      }
    };
  }, [coverImage]);

  useEffect(() => {
    if (!store.id) return;

    const loadMetadata = async () => {
      try {
        const summary = await reviewService.getStoreReviewSummary(store.id);
        setStoreRating(summary.averageRating.toFixed(1));
      } catch {
        setStoreRating("0.0");
      }
    };

    void loadMetadata();
  }, [store.id]);

  const handleSave = async () => {
    if (!store.id || !storeName.trim()) return;

    try {
      setIsSaving(true);
      await storeService.updateStore(userId, store.id, {
        storeName,
        location,
        description,
        bannerFile,
      });
      setBannerFile(null);
      await refreshAuth();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseStore = async () => {
    const confirmed = window.confirm(
      "Tutup toko ini? Semua produk, percakapan, dan data terkait toko akan dihapus permanen."
    );
    if (!confirmed) return;

    try {
      setIsClosingStore(true);
      await commerceGatewayService.closeStore();
      await refreshAuth();
      window.alert("Toko berhasil ditutup.");
      router.replace("/profile");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menutup toko.";
      window.alert(message);
    } finally {
      setIsClosingStore(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-tint pb-32">
      <StickyHeader
        title="Pengaturan Toko"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="secondary" />}
      />

      <main className="px-6 pt-6 flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <label className="text-[14px] font-bold text-text-main uppercase tracking-widest px-2">
            Banner Toko
          </label>
          <div className="relative h-48 w-full rounded-[40px] overflow-hidden border-2 border-dashed border-secondary/20 bg-white shadow-soft group">
            {coverImage ? (
              <Image src={coverImage} alt="Cover" fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-secondary/10 flex flex-col items-center justify-center gap-3 text-secondary">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                  <Icons.Plus size={24} />
                </div>
                <span className="text-[12px] font-bold">Unggah Foto Sampul</span>
              </div>
            )}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setBannerFile(file);
                  setCoverImage((current) => {
                    if (current?.startsWith("blob:")) {
                      URL.revokeObjectURL(current);
                    }
                    return URL.createObjectURL(file);
                  });
                }
              }}
            />
          </div>
          <p className="text-[11px] text-text-sub px-4 italic font-medium opacity-60">
            *Rekomendasi ukuran: 1200 x 400 pixel
          </p>
        </section>

        <section className="bg-white rounded-[40px] p-8 shadow-medium border border-surface-muted flex flex-col gap-6">
          <Input
            label="Nama Toko"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="bg-surface-tint border-none rounded-[24px]"
          />

          <div className="relative group">
            <Input
              label="Lokasi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              startIcon={<Icons.MapPin size={18} className="text-secondary" />}
              className="bg-surface-tint border-none rounded-[24px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-medium text-text-sub uppercase tracking-wider ml-4">
              Deskripsi
            </p>
            <textarea
              className="w-full h-32 bg-surface-tint rounded-[24px] p-6 text-[14px] text-text-main outline-none focus:ring-2 focus:ring-secondary/30 transition-all resize-none placeholder:text-text-sub/40 font-medium"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan tentang toko Tuan..."
            />
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[32px] border border-surface-muted flex flex-col gap-1 shadow-soft">
            <span className="text-[10px] text-text-sub font-bold uppercase tracking-widest">
              Waktu Balas
            </span>
            <span className="text-[15px] font-bold text-text-main leading-tight">{responseTime}</span>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-surface-muted flex flex-col gap-1 shadow-soft">
            <span className="text-[10px] text-text-sub font-bold uppercase tracking-widest">
              Rating Toko
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-bold text-text-main">{storeRating}</span>
              <Icons.Review size={12} className="text-warning fill-warning" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[28px] border border-danger/30 p-5 shadow-soft">
          <p className="text-[14px] font-bold text-danger">Zona Berbahaya</p>
          <p className="mt-2 text-[12px] text-text-sub">
            Menutup toko akan menghapus data toko secara permanen.
          </p>
          <Button
            variant="outline"
            className="mt-4 w-full h-12 rounded-xl border-danger text-danger"
            onClick={() => void handleCloseStore()}
            disabled={isClosingStore}
          >
            {isClosingStore ? "Menutup Toko..." : "Tutup Toko"}
          </Button>
        </section>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-6 bg-linear-to-t from-surface-tint via-surface-tint/80 to-transparent z-40">
        <Button
          variant="secondary"
          className="w-full h-14 rounded-2xl text-[16px] font-bold shadow-lg shadow-secondary/30 uppercase tracking-widest"
          onClick={() => void handleSave()}
          disabled={isSaving}
        >
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
}
