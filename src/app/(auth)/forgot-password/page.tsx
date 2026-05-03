"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";

import bigLogo from "../../../../public/assets/big-logo.svg";

export default function ForgotPasswordPage() {
  return (
    <main className="relative min-h-screen w-full bg-background px-6 flex flex-col items-center">
      {/* Back Button */}
      <div className="absolute left-[33px] top-[66px]">
        <BackButton variant="primary" />
      </div>

      {/* Illustration Section */}
      <div className="mt-[155px] relative w-[180px] h-[164px] flex items-center justify-center">
        <Image
          src={bigLogo}
          alt="Illustration"
          width={180}
          height={164}
          className="w-full h-full object-contain drop-shadow-lg"
          priority
        />
      </div>

      {/* Title & Description */}
      <div className="mt-8 flex flex-col items-center text-center gap-2">
        <h1 className="text-[32px] font-bold text-black leading-tight">
          Forgot Password
        </h1>
        <p className="text-base text-black max-w-[272px]">
          Forgot your account? Remember it now
        </p>
      </div>

      {/* Form Section */}
      <form className="mt-8 w-full flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        {/* Menggunakan prop label bawaan template */}
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
        />

        <div className="flex justify-center items-center gap-1">
          <span className="text-[14px] text-black">Remember Now?</span>
          <Link
            href="/login"
            className="text-[14px] font-bold text-[#A98BFE] hover:underline"
          >
            Log in
          </Link>
        </div>

        <div className="mt-4">
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </div>
      </form>
    </main>
  );
}
