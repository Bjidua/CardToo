"use client";

import React, { useEffect } from "react"; // Mengimpor library React dan hooks yang dibutuhkan
import Image from "next/image"; // Mengimpor komponen Image dari Next.js untuk optimasi gambar
import { useRouter } from "next/navigation"; // Mengimpor hook useRouter untuk navigasi halaman

// Mengimpor aset logo gambar SVG dari folder public/assets
import bigLogo from "../../public/assets/big-logo.svg";
import textLogo from "../../public/assets/text-logo.svg";

/**
 * Halaman utama (Root Route `/`).
 * Berfungsi sebagai Splash Screen awal aplikasi.
 * Akan mengecek LocalStorage untuk menentukan apakah pengguna harus
 * diarahkan ke halaman Onboarding (pertama kali) atau langsung ke Home (`/home`).
 */
export default function Home() {
  // Instance router Next.js untuk redirection navigasi
  const router = useRouter();

  /**
   * Effect Hook untuk mengelola transisi otomatis dari Splash Screen ke halaman berikutnya.
   * Efek ini dijalankan satu kali saat komponen pertama kali dimuat (mount).
   */
  useEffect(() => {
    // Simulasi penahanan layar loading splash screen selama 1.5 detik (1500ms)
    const timer = setTimeout(() => {
      // Membaca status penyelesaian onboarding dari LocalStorage browser
      const hasSeenOnboarding = localStorage.getItem("has_seen_onboarding");
      
      // Jika pengguna sudah pernah melewati onboarding, arahkan langsung ke beranda utama (/home)
      if (hasSeenOnboarding) {
        router.replace("/home");
      } 
      // Jika belum pernah, arahkan ke alur onboarding awal (/onboarding)
      else {
        router.replace("/onboarding");
      }
    }, 1500);

    // Membersihkan timer timeout saat komponen di-unmount agar tidak terjadi kebocoran memori (memory leak)
    return () => clearTimeout(timer);
  }, [router]);

  return (
    // Area utama splash screen dengan background putih bersih, layout rata tengah, dan animasi transisi masuk (fade-in)
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
      <div className="flex flex-col items-center">
        {/* Kontainer untuk Logo Maskot Utama */}
        <div className="w-70 h-70 flex items-center justify-center">
          <Image 
            src={bigLogo} // Menggunakan aset logo besar
            alt="CardToo Logo" // Teks alternatif untuk aksesibilitas
            width={160} // Lebar gambar
            height={160} // Tinggi gambar
            // Efek detak jantung lambat (animate-pulse) untuk memberikan kesan dinamis pada splash screen
            className="w-full h-full object-contain drop-shadow-xl animate-pulse"
            // Properti priority digunakan Next.js untuk mempercepat loading aset LCP (Largest Contentful Paint)
            priority
          />
        </div>
        {/* Kontainer untuk Logo Teks Merek "CardToo" */}
        <div className="w-full flex justify-center mt-4">
          <Image
            src={textLogo} // Menggunakan aset logo teks
            alt="CardToo Text Logo" // Teks alternatif untuk aksesibilitas
            width={280} // Lebar gambar
            height={120} // Tinggi gambar
            className="object-contain drop-shadow-xl" // Style untuk logo teks
            priority // Menandakan bahwa ini adalah gambar prioritas tinggi
          />
        </div>
      </div>
    </main>
  );
}