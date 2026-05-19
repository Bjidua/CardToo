"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

// Cek apakah aplikasi berjalan pada lingkungan non-produksi (development mode)
const isDev = process.env.NODE_ENV !== "production";

// Cek status perizinan God Mode dari konfigurasi variabel lingkungan (.env)
const isGodModeAllowed = process.env.NEXT_PUBLIC_ENABLE_GOD_MODE === "true";

/**
 * Panel kecil rahasia yang hanya muncul di environment Development.
 * Berfungsi untuk mengaktifkan/mematikan `God Mode` agar developer 
 * bisa melewati (bypass) proses login selama pengujian UI/UX.
 */
export const DevGodModePanel = () => {
  // Mengambil state dan fungsi toggle God Mode dari AuthContext secara global
  const { isGodModeEnabled, setGodMode } = useAuth();

  // Sembunyikan panel seutuhnya di mode produksi atau jika God Mode dimatikan secara global di .env
  if (!isDev || !isGodModeAllowed) return null;

  return (
    // Box penampung panel di posisi absolut pojok kanan atas layar dengan prioritas z-index sangat tinggi (z-[60])
    <div className="fixed right-4 top-4 z-60 rounded-2xl bg-background shadow-medium border border-accent/20 p-3 w-[180px]">
      {/* Judul Panel */}
      <p className="text-[11px] font-bold text-text-main mb-2">DEV GOD MODE</p>
      
      {/* Tombol aksi klik untuk menyalakan/mematikan bypass login */}
      <button
        type="button"
        onClick={() => setGodMode(!isGodModeEnabled)}
        className="w-full h-9 rounded-xl bg-primary text-white text-[12px] font-bold active:scale-[0.99] transition-transform"
      >
        {isGodModeEnabled ? "Disable" : "Enable"}
      </button>
      
      {/* Deskripsi petunjuk developer */}
      <p className="mt-2 text-[10px] text-text-main/70 leading-tight">
        Dev-only bypass untuk testing akses fitur tanpa guest lock.
      </p>
    </div>
  );
};
