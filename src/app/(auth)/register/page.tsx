"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SocialButton } from "@/components/ui/SocialButton";
import { AuthCard } from "@/components/layout/AuthCard";
import { Separator } from "@/components/ui/Separator";
import { useAuth } from "@/context/AuthContext";

/**
 * Halaman Registrasi Akun Baru (Register Page)
 * Menyediakan form pendaftaran nama pengguna (username), email, dan password.
 * Melakukan validasi dasar panjang kata sandi dan kredensial sebelum memproses.
 */
export default function RegisterPage() {
  // Mengambil metode pendaftaran/registrasi global dari AuthContext
  const { register } = useAuth();

  // State penyimpan data input formulir pendaftaran
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  // State untuk penanganan pesan kesalahan visual
  const [error, setError] = React.useState("");

  // State loading status proses submit registrasi
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  /**
   * Menangani aksi klik tombol submit pada form registrasi.
   * Melakukan validasi isian wajib, minimal karakter sandi, dan memicu request pendaftaran.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); // Reset status kesalahan

    // Validasi field kosong
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("Username, email, dan password wajib diisi.");
      return;
    }

    // Validasi panjang minimum sandi sesuai standar keamanan Appwrite (min 8 karakter)
    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    try {
      setIsSubmitting(true); // Mulai loading spinner tombol
      // Eksekusi proses registrasi, disusul pembuatan data profil di collection database
      await register(formData);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Registrasi gagal. Coba lagi."
      );
    } finally {
      setIsSubmitting(false); // Matikan loading spinner tombol
    }
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      {/* Header Halaman Signup */}
      <div className="bg-linear-to-b from-white via-white to-primary/2 px-6 pb-8 pt-[70px] text-center">
        <h1 className="text-[32px] font-bold leading-tight text-text-main">Sign Up</h1>
        <p className="mt-2 text-base text-text-sub">
          Let&apos;s create your account
        </p>
      </div>

      {/* Kontainer form pendaftaran */}
      <AuthCard title="Create Account">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {/* Input Nama Pengguna (Username) */}
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              className="h-[55px] rounded-[24px] bg-surface-light px-6"
              value={formData.username}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, username: event.target.value }))
              }
            />

            {/* Input Surat Elektronik (Email) */}
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              className="h-[55px] rounded-[24px] bg-surface-light px-6"
              value={formData.email}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, email: event.target.value }))
              }
            />

            {/* Input Kata Sandi (Password) */}
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              className="h-[55px] rounded-[24px] bg-surface-light px-6"
              value={formData.password}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, password: event.target.value }))
              }
            />
          </div>

          {/* Banner pesan kesalahan */}
          {error && (
            <p className="px-2 text-center text-[12px] font-medium text-danger">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col items-center space-y-6">
            {/* Tombol kirim pendaftaran */}
            <Button
              type="submit"
              variant="primary"
              className="rounded-[24px] shadow-medium"
              isLoading={isSubmitting}
            >
              Sign Up
            </Button>

            {/* Pembatas OR */}
            <Separator label="OR" />

            {/* Pendaftaran alternatif via Google */}
            <SocialButton
              provider="google"
              type="button"
              onClick={() => setError("Google sign-up belum diaktifkan saat ini.")}
            />
          </div>
        </form>

        {/* Footer navigasi balik ke sign in */}
        <div className="mt-auto flex items-center justify-center gap-1 pt-10">
          <span className="text-[14px] text-text-main">Have an account?</span>
          <Link
            href="/login"
            className="text-[14px] font-bold text-secondary hover:underline"
          >
            Sign In
          </Link>
        </div>
      </AuthCard>
    </main>
  );
}
