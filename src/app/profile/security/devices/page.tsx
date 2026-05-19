"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { authService } from "@/lib/services/auth";
import { useAuth } from "@/context/AuthContext";
import type { Device } from "@/types";

type SessionItem = Awaited<ReturnType<typeof authService.listSessions>>[number];

/**
 * Memformat string waktu pembuatan sesi ke format lokal yang rapi (id-ID)
 */
const formatSessionTime = (session: SessionItem) => {
  if (session.current) {
    return "Sesi aktif saat ini";
  }

  return new Date(session.$createdAt).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Menormalisasi objek sesi mentah Appwrite ke interface Device UI
 */
const toDevice = (session: SessionItem): Device => ({
  id: session.$id,
  name:
    [session.clientName, session.osName].filter(Boolean).join(" - ") ||
    session.clientCode ||
    "Perangkat tidak dikenal",
  location: session.countryName || session.ip || "Lokasi tidak tersedia",
  time: formatSessionTime(session),
  isCurrent: session.current,
});

/**
 * Halaman Manajemen Perangkat / Sesi Terhubung (DevicesPage)
 * Dibungkus dengan ProtectedRoute untuk mencegah akses tamu tanpa login.
 */
export default function DevicesPage() {
  return (
    <ProtectedRoute>
      <DevicesContent />
    </ProtectedRoute>
  );
}

/**
 * Komponen Konten Manajemen Perangkat (DevicesContent)
 * Memanggil endpoint Appwrite `authService.listSessions` untuk melacak seluruh login perangkat aktif,
 * dan menyediakan opsi logout perangkat tunggal maupun logout massal dari semua perangkat lain.
 */
function DevicesContent() {
  const { refreshAuth } = useAuth();
  
  // State daftar perangkat aktif
  const [devices, setDevices] = useState<Device[]>([]);
  
  // State pesan error API
  const [error, setError] = useState("");
  
  // State loading pemuatan data
  const [isLoading, setIsLoading] = useState(true);
  
  // State ID sesi perangkat yang sedang di-logout agar memicu loader lokal di list item
  const [loggingOutId, setLoggingOutId] = useState<string | null>(null);
  
  // State loading status logout massal semua perangkat
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  /**
   * Effect Hook untuk memuat seluruh sesi perangkat aktif yang terdaftar di Appwrite.
   */
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setIsLoading(true);
        setError("");
        const sessions = await authService.listSessions();
        setDevices(sessions.map(toDevice));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal memuat daftar perangkat."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadSessions();
  }, []);

  // Memeriksa apakah ada sesi masuk lain selain tab browser aktif saat ini
  const hasOtherSessions = useMemo(
    () => devices.some((device) => !device.isCurrent),
    [devices]
  );

  /**
   * Mengakhiri sesi masuk perangkat tertentu.
   * 
   * @param sessionId ID unik sesi Appwrite
   */
  const handleLogoutSession = async (sessionId: string) => {
    try {
      setLoggingOutId(sessionId); // Set loader baris perangkat
      await authService.logoutSession(sessionId);
      
      // Hapus perangkat dari state lokal
      setDevices((prev) => prev.filter((device) => device.id !== sessionId));
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "Gagal mengeluarkan perangkat."
      );
    } finally {
      setLoggingOutId(null);
    }
  };

  /**
   * Mengakhiri seluruh sesi masuk aktif lainnya di perangkat lain secara massal.
   */
  const handleLogoutAll = async () => {
    try {
      setIsLoggingOutAll(true);
      await authService.logoutAllSessions();
      
      // Sinkronisasi data sesi otentikasi global
      await refreshAuth();
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "Gagal mengakhiri semua sesi."
      );
    } finally {
      setIsLoggingOutAll(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      {/* Header Halaman atas */}
      <StickyHeader
        title="Perangkat Terhubung"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-32">
        {/* Banner Edukasi Keamanan */}
        <div className="bg-primary/5 p-4 rounded-card border border-primary/10 mb-8">
          <p className="text-[13px] text-text-sub leading-relaxed">
            Ini adalah daftar sesi Appwrite yang saat ini masuk ke akun CardToo
            kamu. Keluar dari perangkat yang tidak kamu kenali.
          </p>
        </div>

        {/* Tampilan Pesan Kesalahan */}
        {error ? (
          <div className="mb-6 rounded-card border border-danger/10 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">
            {error}
          </div>
        ) : null}

        {/* Render List Perangkat atau Spinner loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {devices.map((device) => (
              <div
                key={device.id}
                className="bg-white p-5 rounded-card shadow-soft border border-surface-muted flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-hover rounded-card flex items-center justify-center text-accent">
                    <Icons.Store size={24} />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-text-main">
                        {device.name}
                      </span>
                      {device.isCurrent ? (
                        <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded uppercase">
                          Ini
                        </span>
                      ) : null}
                    </div>
                    <span className="text-[12px] text-text-sub">
                      {device.location} • {device.time}
                    </span>
                  </div>
                </div>
                {/* Tombol Logout per-baris perangkat */}
                {!device.isCurrent ? (
                  <button
                    type="button"
                    className="text-[14px] font-bold text-danger disabled:opacity-60"
                    onClick={() => void handleLogoutSession(device.id)}
                    disabled={loggingOutId === device.id}
                  >
                    {loggingOutId === device.id ? "Logout..." : "Logout"}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {/* Tombol Logout Massal (Logout dari semua perangkat lain) */}
        <button
          type="button"
          className="w-full mt-10 py-4 text-danger font-bold border-2 border-danger/10 rounded-card active:scale-[0.98] transition-all disabled:opacity-60"
          onClick={() => void handleLogoutAll()}
          disabled={!hasOtherSessions || isLoggingOutAll}
        >
          {isLoggingOutAll ? "Memproses..." : "Logout dari Semua Perangkat"}
        </button>
      </main>
    </div>
  );
}
