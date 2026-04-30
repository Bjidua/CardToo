import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CardToo - Mobile App",
  description: "TCG APP",
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
      <body className="bg-surface antialiased">
        {/* Main Wrapper untuk Mobile View */}
        <div className="mx-auto min-h-screen max-w-[440px] bg-background shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  )
}