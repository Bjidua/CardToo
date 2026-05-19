"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Properti pendukung komponen rute terlindungi.
 */
interface ProtectedRouteProps {
  /** Komponen anak/halaman yang akan dirender jika lolos validasi */
  children: React.ReactNode;
  /** Jika true, rute ini hanya bisa diakses oleh akun dengan role Seller */
  requireSeller?: boolean;
}

/**
 * Komponen pembungkus (Wrapper) untuk mengamankan halaman dari pengguna yang belum login.
 * Jika `isGuest` true, akan otomatis me-redirect ke `/login`.
 * Jika `requireSeller` true dan pengguna bukan seller, akan me-redirect ke `/profile`.
 * Selama proses validasi (loading context), komponen akan menampilkan spinner.
 */
export const ProtectedRoute = ({ children, requireSeller = false }: ProtectedRouteProps) => {
  // Router instance Next.js untuk redirection halaman
  const router = useRouter();

  // Mengambil state autentikasi pengguna secara dinamis dari AuthContext
  const { isGuest, isLoading, isSeller } = useAuth();

  /**
   * Effect Hook untuk memantau status autentikasi pengguna secara real-time.
   * Redirect dilakukan hanya jika status pemuatan data autentikasi (isLoading) selesai.
   */
  useEffect(() => {
    // Jalankan pengecekan redirection jika proses memuat data auth telah selesai
    if (!isLoading) {
      // Jika pengguna adalah tamu (Guest / belum login), lempar ke halaman Login
      if (isGuest) {
        router.push("/login");
      } 
      // Jika halaman membutuhkan role Seller tetapi pengguna bukan Seller, lempar ke halaman Profil pembeli
      else if (requireSeller && !isSeller) {
        router.push("/profile");
      }
    }
  }, [isGuest, isLoading, isSeller, requireSeller, router]);

  // Tampilkan spinner loading full screen jika data autentikasi masih dimuat (loading state)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-tint">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Jika halaman butuh role Seller tetapi pengguna bukan seller, cegah perenderan konten anak
  if (requireSeller && !isSeller) return null;

  // Render komponen anak jika pengguna telah berhasil terautentikasi (bukan guest)
  return !isGuest ? <>{children}</> : null;
};


