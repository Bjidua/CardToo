import type { Metadata, Viewport } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { BottomNav } from "@/components/layout/BottomNav"
import { AuthProvider } from "@/context/AuthContext"
import { LanguageProvider } from "@/context/LanguageContext"
import { DevGodModePanel } from "@/components/layout/DevGodModePanel"

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "CardToo - Marketplace TCG",
  description: "Beli dan Jual Kartu TCG Favoritmu",
}

// Safe Area Insets untuk mobile view
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

/**
 * Komponen Induk Layout Aplikasi (Root Layout).
 * Mengatur kerangka dasar HTML, konfigurasi font "Outfit", penyediaan Konteks Global
 * (Auth & Language), serta pembungkus berukuran `max-w-[440px]` untuk 
 * mempertahankan tampilan berdesain Mobile/Native App pada desktop.
 */
export default function RootLayout({
  children,
}: Readonly<{ 
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-white antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            <DevGodModePanel />
            {/* Main Wrapper: Berfungsi sebagai container HP yang selalu centered */}
            <div className="mx-auto min-h-screen max-w-[440px] bg-white shadow-medium relative flex flex-col">
              {/* Konten Utama */}
              <main className="flex-1 flex flex-col relative">
                {children}
              </main>
              <BottomNav />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
