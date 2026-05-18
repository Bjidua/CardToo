"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BackButton } from "@/components/ui/BackButton";
import { SocialButton } from "@/components/ui/SocialButton";
import { Checkbox } from "@/components/ui/Checkbox";
import { OTPInput } from "@/components/ui/OTPInput";
import { AuthCard } from "@/components/layout/AuthCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { Icons } from "@/components/ui/Icons";
import { Separator } from "@/components/ui/Separator";
import { ProfilePicture } from "@/components/ui/ProfilePicture";
import { SlideCard } from "@/components/ui/SlideCard";
import { ProductCard } from "@/components/ui/ProductCard";
import { CategoryList } from "@/components/ui/CategoryList";
import { MessageCard } from "@/components/ui/MessageCard";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { MenuListItem } from "@/components/ui/MenuListItem";
import { FavoriteItemCard } from "@/components/ui/FavoriteItemCard";
import { OrderItemCard } from "@/components/ui/OrderItemCard";
import { CartItemCard } from "@/components/ui/CartItemCard";
import { Accordion } from "@/components/ui/Accordion";
import { DetailBox } from "@/components/ui/DetailBox";
import { Mail, Lock, LogIn } from "lucide-react";

export default function TestComponentsPage() {
  return (
    <main className="min-h-screen bg-background p-6 flex flex-col gap-10 pb-20">
      <div className="flex items-center gap-4">
        <BackButton variant="primary" />
        <div>
          <h1 className="text-2xl font-bold text-text-main">Component Lab</h1>
          <p className="text-sm text-text-sub">Katalog component CardToo</p>
        </div>
      </div>

      {/* App Layout Components */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">App Layout: Header</h2>
        <div className="bg-white rounded-card border border-surface-muted overflow-hidden shadow-soft">
          <StickyHeader title="Home" />
          <div className="h-20 flex items-center justify-center bg-surface-light text-text-sub text-xs italic">
            Halaman Content Area
          </div>
        </div>
      </section>

      {/* Input Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">Inputs & OTP</h2>
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
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">Buttons</h2>
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
          
          <p className="text-sm text-text-sub mt-2">Separator Component:</p>
          <Separator label="OR" />
        </div>
      </section>

      {/* Category Navigation */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">Category Navigation</h2>
        <div className="bg-white py-6 rounded-card border border-surface-muted shadow-soft overflow-hidden">
          <CategoryList />
        </div>
      </section>

      {/* Product Catalog */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">Product Catalog (172x250)</h2>
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
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">Promo & Banners</h2>
        <div className="flex flex-col gap-4 items-center">
          <SlideCard 
            title="Dapatkan Diskon 50%" 
            description="Khusus untuk pembelian kartu Pokemon TCG minggu ini!"
          />
          <SlideCard 
            promotion="Exclusive"
            title="Limited Edition" 
            description="Cek koleksi kartu langka terbaru kami sekarang."
            className="border border-primary/20"
          />
        </div>
      </section>

      {/* Profile & Avatar */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">Profile & Avatar</h2>
        <div className="flex items-center gap-6 p-4 bg-white rounded-card border border-surface-muted">
          <div className="flex flex-col items-center gap-2">
            <ProfilePicture />
            <span className="text-[10px] text-text-sub font-medium">Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProfilePicture alt="Veir" />
            <span className="text-[10px] text-text-sub font-medium">Initial</span>
          </div>
        </div>
      </section>

      {/* Social Buttons */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">Social Login</h2>
        <div className="flex flex-col gap-3">
          <SocialButton provider="google" />
          <SocialButton provider="apple" />
          <SocialButton provider="facebook" />
        </div>
      </section>

      {/* Messaging Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">Messaging & Notifications</h2>
        <div className="flex flex-col gap-4 items-center bg-surface-light p-6 rounded-card">
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

      {/* List Items */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">Profile & Settings: List Items</h2>
        <div className="bg-white rounded-card border border-surface-muted overflow-hidden shadow-soft">
          <MenuListItem icon={<Icons.Store size={20} />} label="Toko Saya" href="#" showBorder />
          <MenuListItem icon={<Icons.Lock size={20} />} label="Keamanan" href="#" subValue="Kuat" />
        </div>
      </section>

      {/* Cart & Wishlist */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">Shopping: Cart & Wishlist</h2>
        <div className="flex flex-col gap-4">
          <p className="text-xs text-text-sub font-bold uppercase tracking-wider">Cart Item:</p>
          <CartItemCard 
            title="Pikachu VMAX (Secret Rare)"
            shopName="PokeShop Official"
            price={1500000}
            image="/assets/images/cards/pikachu.png"
            quantity={1}
          />
          
          <p className="text-xs text-text-sub font-bold uppercase tracking-wider mt-4">Favorite Item:</p>
          <FavoriteItemCard 
            id="1"
            title="Charizard GX"
            shopName="TCG Vault"
            price={2750000}
            image="/assets/images/cards/charizard.png"
          />
        </div>
      </section>

      {/* Order Tracking */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">Orders: History & Tracking</h2>
        <div className="flex flex-col gap-4">
          <OrderItemCard 
            order={{
              id: "ORD-20260504-001",
              shopName: "PokeStore ID",
              productTitle: "Mewtwo GX - Hidden Fates",
              condition: "Mint",
              quantity: 1,
              totalPrice: 850000,
              status: "Selesai",
              productImage: "/assets/images/cards/mewtwo.png"
            }}
          />
        </div>
      </section>

      {/* Collections Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">Collections & Folders</h2>
        <div className="grid grid-cols-2 gap-4 bg-surface-light p-6 rounded-card">
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
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">Custom Navigation</h2>
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-sm text-text-sub">Custom SVG Icons (Active/Inactive):</p>
            <div className="flex gap-4 p-4 bg-white rounded-card border border-surface-muted">
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
            <p className="text-sm text-text-sub">Bottom Navigation (Dynamic Pill):</p>
            <div className="relative h-[150px] bg-surface-light rounded-card overflow-hidden border border-dashed border-surface-hover flex items-center justify-center">
              <BottomNav isDemo={true} />
            </div>
          </div>
        </div>
      </section>
      {/* Product Detail Components */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-main border-b border-surface-muted pb-2">Product Detail: UI Atoms</h2>
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs text-text-sub font-bold uppercase tracking-wider mb-3">Detail Box (Grid Style):</p>
            <div className="grid grid-cols-2 gap-3">
              <DetailBox label="Card Number" value="033/106 RR" />
              <DetailBox label="HP" value="200" />
            </div>
          </div>
          
          <div>
            <p className="text-xs text-text-sub font-bold uppercase tracking-wider mb-1">Accordion System:</p>
            <Accordion 
              title="Informasi Pengiriman" 
              isOpen={true} 
              onToggle={() => {}}
            >
              <p className="text-sm text-text-sub">Packing kayu + Bubble wrap gratis.</p>
            </Accordion>
            <Accordion 
              title="Syarat & Ketentuan" 
              isOpen={false} 
              onToggle={() => {}}
            >
              <p className="text-sm text-text-sub">Tidak ada retur untuk kartu Loose.</p>
            </Accordion>
          </div>
        </div>
      </section>

    </main>
  );
}
