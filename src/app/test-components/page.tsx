"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BackButton } from "@/components/ui/BackButton";
import { SocialButton } from "@/components/ui/SocialButton";
import { Checkbox } from "@/components/ui/Checkbox";
import { OTPInput } from "@/components/ui/OTPInput";
import { AuthCard } from "@/components/layout/AuthCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { Icons } from "@/components/ui/Icons";
import { Separator } from "@/components/ui/Separator";
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

      {/* Social Buttons */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b pb-2">Social Login</h2>
        <div className="flex flex-col gap-3">
          <SocialButton provider="google" />
          <SocialButton provider="apple" />
          <SocialButton provider="facebook" />
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
