"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SocialButton } from "@/components/ui/SocialButton";
import { AuthCard } from "@/components/layout/AuthCard";
import { Separator } from "@/components/ui/Separator";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("Username, email, dan password wajib diisi.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    try {
      setIsSubmitting(true);
      await register(formData);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Registrasi gagal. Coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      <div className="bg-linear-to-b from-white via-white to-primary/2 px-6 pb-8 pt-[70px] text-center">
        <h1 className="text-[32px] font-bold leading-tight text-black">Sign Up</h1>
        <p className="mt-2 text-base text-black opacity-70">
          Let&apos;s create your account
        </p>
      </div>

      <AuthCard title="Create Account">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
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

          {error && (
            <p className="px-2 text-center text-[12px] font-medium text-danger">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col items-center space-y-6">
            <Button
              type="submit"
              variant="primary"
              className="rounded-[24px] shadow-medium"
              isLoading={isSubmitting}
            >
              Sign Up
            </Button>

            <Separator label="OR" />

            <SocialButton
              provider="google"
              type="button"
              onClick={() => setError("Google sign-up belum diaktifkan saat ini.")}
            />
          </div>
        </form>

        <div className="mt-auto flex items-center justify-center gap-1 pt-10">
          <span className="text-[14px] text-black">Have an account?</span>
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
