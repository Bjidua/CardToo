"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BackButton } from "@/components/ui/BackButton";
import { SocialButton } from "@/components/ui/SocialButton";
import { Checkbox } from "@/components/ui/Checkbox";
import { OTPInput } from "@/components/ui/OTPInput";
import { AuthCard } from "@/components/layout/AuthCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { Icons } from "@/components/ui/Icons";
import { Separator } from "@/components/ui/Separator";
import { ProfilePicture } from "@/components/ui/ProfilePicture";
import { SlideCard } from "@/components/ui/SlideCard";
import { ProductCard } from "@/components/ui/ProductCard";
import { CategoryList } from "@/components/ui/CategoryList";
import { MessageCard } from "@/components/ui/MessageCard";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { Mail, Lock, LogIn } from "lucide-react";

export default function TestComponentsPage() {
  return (
    <main className="min-h-screen bg-background p-6 flex flex-col gap-10 pb-20">
      <div className="flex items-center gap-4">
        <BackButton variant="primary" />
        <div>
          <h1 className="text-2xl font-bold text-black">Component Lab</h1>
          <p className="text-sm text-gray-500">Katalog component CardToo</p>
        </div>
      </div>

      {/* App Layout Components */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b pb-2">App Layout: Header</h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <Header title="Home" />
          <div className="h-20 flex items-center justify-center bg-gray-50 text-gray-400 text-xs italic">
            Halaman Content Area
          </div>
        </div>
      </section>

      {/* Input Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b pb-2">Inputs & OTP</h2>
        <Input
          label="Email Address"
          placeholder="Enter your email"
          startIcon={<Mail size={18} />}
        />
        <OTPInput label="OTP Input (4 Digits)" length={4} />
        <Checkbox label="Remember me" />
      </section>

      {/* Button Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b pb-2">Buttons</h2>
        <div className="flex flex-col gap-3">
          <Button variant="primary" startIcon={<LogIn size={18} />}>
            Primary Button
          </Button>
          <Button variant="secondary">
            Secondary Button
          </Button>
          <Button variant="danger">
            Danger Button
          </Button>
          <Button variant="ghost">
            Ghost / Cancel Button
          </Button>
          
          <p className="text-sm text-gray-500 mt-2">Separator Component:</p>
          <Separator label="OR" />
        </div>
      </section>

      {/* Category Navigation */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b pb-2">Category Navigation</h2>
        <div className="bg-white py-6 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <CategoryList />
        </div>
      </section>

      {/* Product Catalog */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b pb-2">Product Catalog (172x250)</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <ProductCard 
            title="Pikachu VMAX (Secret Rare) - Vivid Voltage" 
            price={1500000} 
            condition="Mint"
          />
          <ProductCard 
            title="Charizard GX - Hidden Fates" 
            price={2750000} 
            condition="Near Mint"
          />
        </div>
      </section>

      {/* Promo & Banners */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b pb-2">Promo & Banners</h2>
        <div className="flex flex-col gap-4 items-center">
          <SlideCard 
            title="Dapatkan Diskon 50%" 
            description="Khusus untuk pembelian kartu Pokemon TCG minggu ini!"
          />
          <SlideCard 
            promotion="Exclusive"
            title="Limited Edition" 
            description="Cek koleksi kartu langka terbaru kami sekarang."
            className="border border-[#4CB6C4]/20"
          />
        </div>
      </section>

      {/* Profile & Avatar */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b pb-2">Profile & Avatar</h2>
        <div className="flex items-center gap-6 p-4 bg-white rounded-xl border border-gray-100">
          <div className="flex flex-col items-center gap-2">
            <ProfilePicture />
            <span className="text-[10px] text-gray-400 font-medium">Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProfilePicture alt="Veir" />
            <span className="text-[10px] text-gray-400 font-medium">Initial</span>
          </div>
        </div>
      </section>

      {/* Social Buttons */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b pb-2">Social Login</h2>
        <div className="flex flex-col gap-3">
          <SocialButton provider="google" />
          <SocialButton provider="apple" />
          <SocialButton provider="facebook" />
        </div>
      </section>

      {/* Messaging Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b pb-2">Messaging & Notifications</h2>
        <div className="flex flex-col gap-4 items-center bg-gray-50 p-6 rounded-xl">
          <MessageCard 
            userName="CardMaster99" 
            message="Ready for trade? I have the Pikachu VMAX you're looking for!" 
            time="2 min"
            unreadCount={3}
          />
          <MessageCard 
            userName="PokeCollector" 
            message="Thanks for the smooth transaction!" 
            time="1 hour"
          />
        </div>
      </section>

      {/* Messaging Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b pb-2">Collections & Folders</h2>
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl">
          <CollectionCard 
            title="Pokemon VMAX" 
            count={124} 
          />
          <CollectionCard 
            title="Yu-Gi-Oh! Rare" 
            count={45} 
          />
        </div>
      </section>

      {/* Icons & Navigation */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b pb-2">Custom Navigation</h2>
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Custom SVG Icons (Active/Inactive):</p>
            <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
              <Icons.Home active={true} size={32} className="text-primary" />
              <Icons.Message active={true} size={32} className="text-primary" />
              <Icons.Collection active={true} size={32} className="text-primary" />
              <Icons.Profile active={true} size={32} className="text-primary" />
              <Icons.Notification size={32} className="text-black" />
              <Icons.Cart size={32} className="text-black" />
              <Icons.Search size={32} className="text-black" />
            </div>
          </div>
          
          <div className="space-y-2 pb-10">
            <p className="text-sm text-gray-500">Bottom Navigation (Dynamic Pill):</p>
            <div className="relative h-[150px] bg-gray-50 rounded-xl overflow-hidden border border-dashed border-gray-300 flex items-center justify-center">
              <BottomNav isDemo={true} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
