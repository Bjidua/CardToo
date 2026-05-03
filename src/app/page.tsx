import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white to-[#F6DFFF] flex flex-col items-center justify-center p-6 text-center">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="w-40 h-40 flex items-center justify-center mb-4">
          <img 
            src="/assets/Big Logo.svg" 
            alt="CardToo Logo" 
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>
        <h1 className="text-4xl font-bold text-black tracking-tight">
          Card<span className="text-primary">Too</span>
        </h1>
        <p className="text-base text-gray-600 max-w-[280px]">
          The ultimate marketplace for your favorite TCG collections.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-[347px] flex flex-col gap-4">
        <Link href="/login" className="w-full">
          <Button variant="primary">Get Started</Button>
        </Link>
        <Link href="/register" className="w-full">
          <Button variant="ghost">Create Account</Button>
        </Link>
      </div>

      {/* Debug/Test Link */}
      <div className="mt-20 opacity-30 hover:opacity-100 transition-opacity">
        <Link href="/test-components" className="text-xs text-gray-500 underline">
          Component Lab
        </Link>
      </div>
    </main>
  );
}