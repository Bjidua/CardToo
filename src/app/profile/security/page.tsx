"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { MenuListItem } from "@/components/ui/MenuListItem";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { commerceGatewayService } from "@/lib/services/commerceGateway";

export default function SecurityPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Hapus akun? Jika toko masih aktif, Anda harus menutup toko terlebih dahulu."
    );
    if (!confirmed) return;

    try {
      setIsDeletingAccount(true);
      await commerceGatewayService.deleteAccount();

      try {
        await logout();
      } catch {
        router.replace("/login");
      }

      window.alert("Akun berhasil dihapus.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus akun.";
      window.alert(message);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      <StickyHeader
        title="Keamanan & Password"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-32">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-[14px] font-bold text-text-sub uppercase tracking-wider px-2">Autentikasi Utama</h3>
            <div className="bg-white rounded-card overflow-hidden shadow-soft border border-surface-muted">
              <MenuListItem icon={<Icons.Lock size={20} />} label="Ganti Password" href="/profile/security/password" showBorder />
              <MenuListItem icon={<Icons.Plus size={20} />} label="Verifikasi Dua Langkah (2FA)" href="/profile/security/2fa" subValue="Segera Hadir" showBorder />
              <MenuListItem icon={<Icons.Review size={20} />} label="PIN CardToo" href="/profile/security/pin" subValue="Segera Hadir" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[14px] font-bold text-text-sub uppercase tracking-wider px-2">Akses Perangkat</h3>
            <div className="bg-white rounded-card overflow-hidden shadow-soft border border-surface-muted">
              <MenuListItem icon={<Icons.Store size={20} />} label="Daftar Perangkat Terhubung" href="/profile/security/devices" subValue="Kelola" />
            </div>
          </div>

          <div className="px-2">
            <p className="text-[12px] text-text-sub/60 leading-relaxed">
              Lindungi akunmu dengan mengaktifkan fitur keamanan tambahan. Jangan berikan kode OTP atau PIN kepada siapapun, termasuk pihak CardToo.
            </p>
          </div>

          <div className="bg-white rounded-card overflow-hidden shadow-soft border border-danger/30 p-5">
            <p className="text-[14px] font-bold text-danger">Zona Berbahaya</p>
            <p className="mt-2 text-[12px] text-text-sub/70">
              Menghapus akun akan menghapus data akun secara permanen.
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full h-12 rounded-xl border-danger text-danger"
              onClick={() => void handleDeleteAccount()}
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? "Menghapus Akun..." : "Hapus Akun"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
