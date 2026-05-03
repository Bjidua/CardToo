import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

// Import logo secara statis agar path-nya otomatis ditangani Next.js
import bigLogo from "../../public/assets/big-logo.svg";
import textLogo from "../../public/assets/text-logo.svg";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      {/* Hero Section */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-70 h-70 flex items-center justify-center">
          <Image 
            src={bigLogo} 
            alt="CardToo Logo" 
            width={160}
            height={160}
            className="w-full h-full object-contain drop-shadow-xl"
            priority
          />
        </div>
        <div className="w-full flex justify-center mb-4">
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

      {/* Debug/Test Link */}
      <div className="mt-20 opacity-30 hover:opacity-100 transition-opacity">
        <Link href="/test-components" className="text-xs text-gray-500 underline">
          Component Lab
        </Link>
      </div>
    </main>
  );
}