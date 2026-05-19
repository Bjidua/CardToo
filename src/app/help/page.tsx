"use client";

import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Icons } from "@/components/ui/Icons";
import { MenuListItem } from "@/components/ui/MenuListItem";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

/**
 * Halaman Pusat Bantuan (HelpPage)
 * Menampilkan bilah pencarian FAQ bantuan, daftar topik FAQ populer (pembayaran, tracking, refund, dll.),
 * serta CTA tombol bantuan live chat customer service.
 */
export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      {/* Header Halaman atas dengan tombol kembali */}
      <StickyHeader
        title="Pusat Bantuan"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-6 pb-32">
        {/* Kolom masukan pencarian topik FAQ */}
        <div className="mb-8">
          <Input
            placeholder="Ada yang bisa kami bantu?"
            startIcon={<Icons.Search size={18} />}
            className="bg-white border border-surface-muted shadow-soft"
          />
        </div>

        {/* Seksi Topik Populer dengan navigasi menu list */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[18px] font-bold text-text-main px-2">Topik Populer</h3>
          <div className="bg-white rounded-card overflow-hidden shadow-soft border border-surface-muted">
            <MenuListItem icon={<Icons.Wallet size={20} />} label="Cara membayar pesanan" href="#" showBorder />
            <MenuListItem icon={<Icons.Delivery size={20} />} label="Melacak posisi kartu" href="#" showBorder />
            <MenuListItem icon={<Icons.Review size={20} />} label="Kebijakan pengembalian dana" href="#" showBorder />
            <MenuListItem icon={<Icons.Store size={20} />} label="Panduan menjadi penjual" href="#" />
          </div>
        </div>

        {/* Banner CTA Hubungi Layanan Konsumen (Live Chat CS) */}
        <div className="mt-10 p-6 bg-primary/5 rounded-card border border-primary/10 flex flex-col items-center gap-4">
          <p className="text-[14px] font-medium text-text-sub text-center">Masih butuh bantuan?</p>
          <Button type="button" variant="primary" fullWidth={false} className="h-[44px] px-8 rounded-full shadow-medium">
            Chat Customer Service
          </Button>
        </div>
      </main>
    </div>
  );
}
