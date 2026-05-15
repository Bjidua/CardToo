import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SocialButton } from "@/components/ui/SocialButton";
import { AuthCard } from "@/components/layout/AuthCard";
import { Separator } from "@/components/ui/Separator";

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      <div className="bg-linear-to-b from-white via-white to-primary/2 px-6 pb-8 pt-[70px] text-center">
        <h1 className="text-[32px] font-bold leading-tight text-black">Sign Up</h1>
        <p className="mt-2 text-base text-black opacity-70">
          Let&apos;s create your account
        </p>
      </div>

      <AuthCard title="Create Account">
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              className="h-[55px] rounded-[24px] bg-surface-light px-6"
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              className="h-[55px] rounded-[24px] bg-surface-light px-6"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              className="h-[55px] rounded-[24px] bg-surface-light px-6"
            />
          </div>

          <div className="mt-6 space-y-6 flex flex-col items-center">
            <Button type="button" variant="primary" className="rounded-[24px] shadow-medium">
              Sign Up
            </Button>

            <Separator label="OR" />

            <SocialButton provider="google" />
          </div>
        </form>

        <div className="mt-auto pt-10 flex justify-center items-center gap-1">
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
