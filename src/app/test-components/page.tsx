"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BackButton } from "@/components/ui/BackButton";
import { SocialButton } from "@/components/ui/SocialButton";
import { Checkbox } from "@/components/ui/Checkbox";
import { OTPInput } from "@/components/ui/OTPInput";
import { AuthCard } from "@/components/layout/AuthCard";
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
        <div className="space-y-4">
          <label className="text-base text-black block">OTP Input (4 Digits)</label>
          <OTPInput length={4} />
        </div>
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

      {/* Layout Components */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold border-b pb-2">Layout: AuthCard (Mini Demo)</h2>
        <div className="relative h-[300px] bg-gray-200 overflow-hidden rounded-xl border border-dashed border-gray-400">
           <AuthCard title="Demo Auth Card" className="top-20">
              <p className="text-sm text-center text-gray-500">
                Konten di dalam kartu...
              </p>
           </AuthCard>
        </div>
      </section>
    </main>
  );
}
