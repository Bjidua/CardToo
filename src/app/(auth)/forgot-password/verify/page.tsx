"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { OTPInput } from "@/components/ui/OTPInput";
import { getAssetPath } from "@/lib/utils";

/**
 * Halaman Verifikasi Kode OTP (VerifyCodePage)
 * Menyediakan form masukan kode OTP 4-digit yang dikirimkan ke email user.
 * Dilengkapi dengan tombol kirim ulang kode (resend), tombol kembali, dan ilustrasi logo.
 */
export default function VerifyCodePage() {
  return (
    <main className="relative min-h-screen w-full bg-white px-6 pb-8 flex flex-col items-center">
      {/* Tombol Back untuk navigasi ke rute sebelumnya */}
      <div className="absolute left-6 top-[66px] z-10">
        <BackButton variant="primary" />
      </div>

      {/* Ilustrasi Logo Besar di bagian tengah atas */}
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

      {/* Judul & Detail Informasi Kiriman OTP */}
      <div className="mt-8 flex flex-col items-center text-center">
        <h1 className="text-[20px] font-bold text-text-main">Check your email</h1>
        <p className="text-[16px] text-text-sub">Enter the code sent to</p>
        {/* Placeholder Email Pengguna */}
        <p className="text-[16px] font-bold text-text-main">[EMAIL_ADDRESS]</p>
      </div>

      {/* Seksi Input Kode Verifikasi */}
      <div className="mt-12 w-full flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <span className="text-base text-text-main">Verification Code</span>
          {/* Tombol Kirim Ulang Kode OTP */}
          <button className="text-base text-secondary font-medium hover:underline">
            Resend Code
          </button>
        </div>

        {/* Komponen Input OTP 4-Digit */}
        <OTPInput length={4} onComplete={() => {}} />

        {/* Teks Petunjuk Tambahan Folder Spam */}
        <p className="mt-4 text-[14px] text-text-sub text-center px-4">
          Can&apos;t find the email? Check your spam folder.
        </p>
      </div>

      {/* Tombol Konfirmasi Verifikasi dan Lanjut */}
      <div className="mt-12 w-full">
        <Link href="/forgot-password/reset">
          <Button variant="primary">Continue</Button>
        </Link>
      </div>
    </main>
  );
}

