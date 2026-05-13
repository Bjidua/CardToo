"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { OTPInput } from "@/components/ui/OTPInput";
import { getAssetPath } from "@/lib/utils";

export default function VerifyCodePage() {
  return (
    <main className="relative min-h-screen w-full bg-white px-6 flex flex-col items-center">
      {/* Back Button */}
      <div className="absolute left-[33px] top-[66px]">
        <BackButton variant="primary" />
      </div>

      {/* Logo Section */}
      <div className="mt-[155px] relative w-[180px] h-[164px] flex items-center justify-center">
        <Image 
          src={getAssetPath("/assets/big-logo.svg")} 
          alt="Illustration" 
          width={180}
          height={164}
          className="w-full h-full object-contain drop-shadow-lg"
          priority
        />
      </div>

      {/* Header Text */}
      <div className="mt-8 flex flex-col items-center text-center">
        <h1 className="text-[20px] font-bold text-black">
          Check your email
        </h1>
        <p className="text-[16px] text-black">
          Enter the code sent to
        </p>
        <p className="text-[16px] font-bold text-black">
          veir@gmail.com
        </p>
      </div>

      {/* Verification Code Section */}
      <div className="mt-12 w-full flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <span className="text-base text-black">Verification Code</span>
          <button className="text-base text-secondary font-medium hover:underline">
            Resend Code
          </button>
        </div>

        <OTPInput length={4} onComplete={(code) => console.log("OTP Complete:", code)} />

        <p className="mt-4 text-[14px] text-black text-center px-4">
          can’t find the email? Check your spam folder
        </p>
      </div>

      {/* Action Button */}
      <div className="mt-12 w-full">
        <Link href="/forgot-password/reset">
          <Button variant="primary">
            Continue
          </Button>
        </Link>
      </div>
    </main>
  );
}
