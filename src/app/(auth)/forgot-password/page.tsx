import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";

import bigLogo from "../../../../public/assets/big-logo.svg";

/**
 * Halaman Lupa Sandi (Forgot Password Page)
 * Menyediakan antarmuka bagi pengguna untuk memulihkan akun mereka.
 * Memuat kolom isian email, tombol kembali, ilustrasi logo besar, dan link ke halaman masuk kembali.
 */
export default function ForgotPasswordPage() {
  return (
    <main className="relative min-h-screen w-full bg-background px-6 pb-8 flex flex-col items-center">
      {/* Tombol Back untuk navigasi ke halaman sebelumnya */}
      <div className="absolute left-6 top-[66px] z-10">
        <BackButton variant="primary" />
      </div>

      {/* Ilustrasi Logo Besar di bagian tengah atas */}
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

      {/* Teks Judul dan Deskripsi Bantuan Lupa Kata Sandi */}
      <div className="mt-8 flex flex-col items-center text-center gap-2">
        <h1 className="text-[32px] font-bold text-text-main leading-tight">
          Forgot Password
        </h1>
        <p className="text-base text-text-sub max-w-[272px]">
          Forgot your account? Remember it now
        </p>
      </div>

      {/* Form Input Email Lupa Kata Sandi */}
      <form className="mt-8 w-full flex flex-col gap-6">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
        />

        {/* Link alternatif jika pengguna mengingat kembali kata sandinya */}
        <div className="flex justify-center items-center gap-1">
          <span className="text-[14px] text-text-main">Remember Now?</span>
          <Link
            href="/login"
            className="text-[14px] font-bold text-secondary hover:underline"
          >
            Log in
          </Link>
        </div>

        {/* Tombol Lanjut Kirim Email Pemulihan */}
        <div className="mt-4">
          <Button type="button" variant="primary">
            Continue
          </Button>
        </div>
      </form>
    </main>
  );
}
