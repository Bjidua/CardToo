"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import bigLogo from "../../public/assets/big-logo.svg";
import textLogo from "../../public/assets/text-logo.svg";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Simulasi loading splash screen sebentar
    const timer = setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem("has_seen_onboarding");
      if (hasSeenOnboarding) {
        router.replace("/home");
      } else {
        router.replace("/onboarding");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
      <div className="flex flex-col items-center">
        <div className="w-70 h-70 flex items-center justify-center">
          <Image 
            src={bigLogo} 
            alt="CardToo Logo" 
            width={160}
            height={160}
            className="w-full h-full object-contain drop-shadow-xl animate-pulse"
            priority
          />
        </div>
        <div className="w-full flex justify-center mt-4">
          <Image
            src={textLogo}
            alt="CardToo Text Logo"
            width={280}
            height={120}
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>
      </div>
    </main>
  );
}