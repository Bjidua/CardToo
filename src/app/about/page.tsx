"use client";

import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/ui/Icons";
import { getAssetPath } from "@/lib/utils";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      <StickyHeader
        title="Tentang CardToo"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-12 pb-32 flex flex-col items-center">
        <div className="w-28 h-28 bg-white rounded-[32px] shadow-medium flex items-center justify-center p-6 mb-6">
          <Image
            src={getAssetPath("/assets/big-logo.svg")}
            alt="CardToo Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        <h2 className="text-[24px] font-bold text-text-main">CardToo</h2>
        <p className="text-[14px] text-text-sub font-medium mb-10 text-center">
          The Ultimate TCG Marketplace
          <br />
          Version 1.0.4 (Beta)
        </p>

        <div className="w-full flex flex-col gap-4">
          <SocialButton icon={<Icons.Message size={20} />} label="Instagram" value="@cardtoo.official" href="https://www.instagram.com/cardtoo.official" />
          <SocialButton icon={<Icons.Search size={20} />} label="Website" value="www.cardtoo.com" href="https://www.cardtoo.com" />
          <SocialButton icon={<Icons.Profile size={20} />} label="Discord Community" value="CardToo HQ" href="https://www.discord.com/cardtoohq" />
        </div>

        <div className="mt-auto pt-10 text-center">
          <p className="text-[12px] text-text-sub/50 font-medium">
            {"© 2026 CardToo Marketplace."}
            <br />
            Made with love for Card Collectors.
          </p>
        </div>
      </main>
    </div>
  );
}

function SocialButton({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="bg-white p-5 rounded-card shadow-soft border border-surface-muted flex items-center justify-between group active:scale-[0.98] transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-card bg-surface-hover flex items-center justify-center text-accent">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] text-text-sub font-bold uppercase tracking-wider">{label}</span>
          <span className="text-[15px] font-bold text-text-main">{value}</span>
        </div>
      </div>
      <Icons.ChevronRight size={18} className="text-text-sub/50" />
    </Link>
  );
}
