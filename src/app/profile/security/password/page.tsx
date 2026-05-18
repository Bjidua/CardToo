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

export default function ChangePasswordPage() {
  return (
    <ProtectedRoute>
      <ChangePasswordContent />
    </ProtectedRoute>
  );
}

function ChangePasswordContent() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Lengkapi semua kolom password terlebih dahulu.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password baru minimal terdiri dari 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru belum sama.");
      return;
    }

    try {
      setIsSaving(true);
      await authService.updatePassword(newPassword, currentPassword);
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
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
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
          <div className="mb-4">
            <h2 className="text-[20px] font-bold text-text-main mb-2">
              Buat Password Baru
            </h2>
            <p className="text-[14px] text-text-sub leading-relaxed">
              Pastikan password-mu terdiri dari minimal 8 karakter dan merupakan
              kombinasi yang sulit ditebak.
            </p>
          </div>

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

          <Input
            label="Konfirmasi Password Baru"
            type={showNew ? "text" : "password"}
            placeholder="Ulangi password baru"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            error={error || undefined}
          />

          {success ? (
            <p className="text-[13px] font-bold text-success text-center">{success}</p>
          ) : null}

          <div className="pt-8">
            <Button onClick={() => void handleSubmit()} isLoading={isSaving}>
              Simpan Password
            </Button>
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
