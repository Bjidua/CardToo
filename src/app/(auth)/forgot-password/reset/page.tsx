import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getAssetPath } from "@/lib/utils";

/**
 * Halaman Atur Ulang Kata Sandi (ResetPasswordPage)
 * Menyediakan antarmuka bagi pengguna untuk memasukkan kata sandi baru mereka setelah 
 * melakukan verifikasi kode pemulihan akun yang dikirimkan via email.
 */
export default function ResetPasswordPage() {
  return (
    <main className="relative min-h-screen w-full bg-white px-6 pb-8 flex flex-col items-center">
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

      {/* Judul Halaman */}
      <div className="mt-8">
        <h1 className="text-[32px] font-bold text-text-main text-center leading-tight">
          Reset Password
        </h1>
      </div>

      {/* Form Input Kata Sandi Baru */}
      <form className="mt-12 w-full flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {/* Input Password Baru */}
          <Input
            type="password"
            placeholder="Enter your new password"
          />
          {/* Input Konfirmasi Password Baru */}
          <Input
            type="password"
            placeholder="Confirm your new password"
          />
        </div>

        {/* Deretan Tombol Kontrol (Kirim & Batal) */}
        <div className="mt-6 flex flex-col gap-4">
          {/* Tombol Simpan & Lanjut */}
          <Button type="button" variant="primary">
            Continue
          </Button>

          {/* Tombol Batal, kembali ke Halaman Login */}
          <Link href="/login" className="w-full">
            <Button type="button" variant="ghost" className="bg-background shadow-soft">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </main>
  );
}

