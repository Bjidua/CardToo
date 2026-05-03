"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ResetPasswordPage() {
  return (
    <main className="relative min-h-screen w-full bg-white px-6 flex flex-col items-center">
      {/* Logo Section */}
      <div className="mt-[155px] relative w-[180px] h-[164px] flex items-center justify-center">
        <Image 
          src="/assets/big-logo.svg" 
          alt="Illustration" 
          width={180}
          height={164}
          className="w-full h-full object-contain drop-shadow-lg"
          priority
        />
      </div>

      {/* Title */}
      <div className="mt-8">
        <h1 className="text-[32px] font-bold text-black text-center leading-tight">
          Reset Password
        </h1>
      </div>

      {/* Form Section */}
      <form className="mt-12 w-full flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-4">
          <Input 
            type="password" 
            placeholder="Enter your new password" 
          />
          <Input 
            type="password" 
            placeholder="Confirm your new password" 
          />
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <Button variant="primary">
            Continue
          </Button>
          
          <Link href="/login" className="w-full">
            <Button variant="ghost" className="bg-background shadow-soft">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </main>
  );
}
