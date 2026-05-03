import type { Metadata, Viewport } from "next"
import "./globals.css"
import { BottomNav } from "@/components/layout/BottomNav"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-surface antialiased overflow-x-hidden">
        {/* Main Wrapper: Berfungsi sebagai container HP yang selalu centered */}
        <div className="mx-auto min-h-screen max-w-[440px] bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] relative flex flex-col">
          {/* Konten Utama */}
          <main className="flex-1 flex flex-col relative overflow-hidden pb-32">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  )
}