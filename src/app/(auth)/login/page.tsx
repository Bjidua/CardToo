"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SocialButton } from "@/components/ui/SocialButton";
import { Checkbox } from "@/components/ui/Checkbox";
import { AuthCard } from "@/components/layout/AuthCard";
import { Separator } from "@/components/ui/Separator";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-linear-to-b from-white to-[#F6DFFF]">
      {/* Header Section */}
      <div className="flex flex-col items-center pt-[70px] px-6 text-center">
        <h1 className="text-[32px] font-bold leading-tight text-black">Sign In</h1>
        <p className="mt-2 text-base text-black opacity-70">
          Login to access your account
        </p>
      </div>

      {/* Auth Card Template */}
      <AuthCard title="Welcome Back">
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-4">
            <Input 
              label="Email"
              type="email" 
              placeholder="Enter your email" 
            />
            
            <Input 
              label="Password"
              type="password" 
              placeholder="Enter your password" 
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-2">
              <Checkbox label="Remember me" />
              <Link 
                href="/forgot-password" 
                className="text-[12px] font-bold text-secondary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="mt-6 space-y-6 flex flex-col items-center">
            <Button type="submit" variant="primary">
              Sign In
            </Button>
            
            <Link href="/" className="w-full">
              <Button variant="ghost" className="bg-surface shadow-soft">
                Cancel
              </Button>
            </Link>

            <Separator label="OR" />

            <SocialButton provider="google" />
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-auto pt-10 flex justify-center items-center gap-1">
          <span className="text-[14px] text-black">Don’t have an account?</span>
          <Link 
            href="/register" 
            className="text-[14px] font-bold text-secondary hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </AuthCard>
    </main>
  );
}
