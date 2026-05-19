"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/lib/services/auth";

/**
 * Halaman Ganti Password Akun (ChangePasswordPage)
 * Dibungkus dengan ProtectedRoute agar hanya bisa diakses dalam sesi login terotentikasi.
 */
export default function ChangePasswordPage() {
  return (
    <ProtectedRoute>
      <ChangePasswordContent />
    </ProtectedRoute>
  );
}

/**
 * Komponen Konten Form Ganti Password (ChangePasswordContent)
 * Mengumpulkan sandi lama dan sandi baru untuk diajukan ke `authService.updatePassword`.
 * Termasuk validasi kepatuhan minimal 8 karakter dan kesamaan kolom konfirmasi sandi.
 */
function ChangePasswordContent() {
  // State toggle visibility text password
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // State input form password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State feedback pesan error & success
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State loading status submit
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Menangani pengiriman formulir update password.
   * Melakukan serangkaian validasi sebelum menyentuh endpoint backend Appwrite.
   */
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    // Validasi 1: Kolom wajib diisi
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Lengkapi semua kolom password terlebih dahulu.");
      return;
    }

    // Validasi 2: Panjang karakter minimal 8
    if (newPassword.length < 8) {
      setError("Password baru minimal terdiri dari 8 karakter.");
      return;
    }

    // Validasi 3: Kesamaan konfirmasi password
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru belum sama.");
      return;
    }

    try {
      setIsSaving(true); // Aktifkan loader tombol
      
      // Kirim request pembaruan sandi ke backend Appwrite authService
      await authService.updatePassword(newPassword, currentPassword);
      
      // Reset isian field
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password berhasil diperbarui.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal memperbarui password."
      );
    } finally {
      setIsSaving(false); // Matikan status loading
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      {/* Header Halaman atas */}
      <StickyHeader
        title="Ganti Password"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-10 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Teks Petunjuk Pembuatan Sandi */}
          <div className="mb-4">
            <h2 className="text-[20px] font-bold text-text-main mb-2">
              Buat Password Baru
            </h2>
            <p className="text-[14px] text-text-sub leading-relaxed">
              Pastikan password-mu terdiri dari minimal 8 karakter dan merupakan
              kombinasi yang sulit ditebak.
            </p>
          </div>

          {/* Input Password Lama */}
          <Input
            label="Password Saat Ini"
            type={showCurrent ? "text" : "password"}
            placeholder="Masukkan password lama"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            endIcon={
              <button
                type="button"
                onClick={() => setShowCurrent((value) => !value)}
                className="text-primary font-bold text-[12px]"
              >
                {showCurrent ? "HIDE" : "SHOW"}
              </button>
            }
          />

          <div className="h-px w-full bg-surface-muted my-2" />

          {/* Input Password Baru */}
          <Input
            label="Password Baru"
            type={showNew ? "text" : "password"}
            placeholder="Masukkan password baru"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            endIcon={
              <button
                type="button"
                onClick={() => setShowNew((value) => !value)}
                className="text-primary font-bold text-[12px]"
              >
                {showNew ? "HIDE" : "SHOW"}
              </button>
            }
          />

          {/* Input Ulangi Password Baru */}
          <Input
            label="Konfirmasi Password Baru"
            type={showNew ? "text" : "password"}
            placeholder="Ulangi password baru"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            error={error || undefined}
          />

          {/* Alert Sukses */}
          {success ? (
            <p className="text-[13px] font-bold text-success text-center">{success}</p>
          ) : null}

          {/* Tombol Simpan */}
          <div className="pt-8">
            <Button onClick={() => void handleSubmit()} isLoading={isSaving}>
              Simpan Password
            </Button>
            {/* Tautan Alternatif Lupa Sandi */}
            <Link
              href="/forgot-password"
              className="mt-4 block text-center text-[13px] text-primary font-bold hover:underline"
            >
              Lupa Password?
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
