"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Button } from "@/components/ui/Button";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Import assets secara statis
import bigLogo from "../../../public/assets/big-logo.svg";
import textLogo from "../../../public/assets/text-logo.svg";

const ONBOARDING_DATA = [
  {
    id: 1,
    image: bigLogo,
    title: "Explore Your Card",
    description: "Discover decks and rare cards shared by the community. Join, trade, and grow your TCG collection together!",
  },
  {
    id: 2,
    image: bigLogo,
    title: "Unlock Your Card!",
    description: "Continue to find the unique cards. Your adventure starts with your hands!.",
  },
  {
    id: 3,
    image: bigLogo,
    title: "Join the Community",
    description: "Connect with fellow TCG enthusiasts and grow your collection together.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main className="min-h-screen bg-surface-tint flex flex-col relative overflow-hidden">
      {/* Skip Button */}
      <div className="absolute top-10 right-6 z-20">
        <Link
          href="/login"
          className="text-base font-semibold text-black/30 hover:text-black transition-colors"
        >
          Skip
        </Link>
      </div>

      {/* Content Section (Swiper) */}
      <div className="flex-1 flex flex-col">
        <Swiper
          modules={[Pagination]}
          pagination={{
            el: ".onboarding-pagination",
            clickable: true,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="w-full h-full onboarding-swiper"
        >
          {ONBOARDING_DATA.map((item) => (
            <SwiperSlide key={item.id} className="flex flex-col items-center pt-24 px-8 text-center">
              {/* Illustration Area */}
              <div className="w-full flex justify-center mt-15">
                <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={300}
                    height={300}
                    className="object-contain drop-shadow-2xl animate-in zoom-in duration-700"
                    priority
                  />
                </div>
              </div>

              {/* Brand Logo Text */}
              <div className="w-full flex justify-center mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <Image
                  src={textLogo}
                  alt="CardToo"
                  width={250}
                  height={80}
                  className="object-contain"
                />
              </div>

              {/* Title & Description */}
              <div className="w-full flex flex-col items-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-[26px] font-bold text-black tracking-tight leading-tight">
                  {item.title}
                </h1>
                <p className="text-[15px] text-black/50 max-w-[300px] leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Bottom Actions & Pagination */}
      <div className="p-8 pb-12 flex flex-col items-center gap-10 z-10">
        {/* Custom Pagination Style (Handled via CSS below) */}
        <div className="onboarding-pagination flex justify-center gap-2" />

        {/* Action Button */}
        {/* Action Button - Hanya muncul di slide terakhir */}
        <div className="w-full max-w-[347px] h-[55px]">
          {activeIndex === ONBOARDING_DATA.length - 1 && (
            <Button
              variant="primary"
              onClick={() => router.push("/home")}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              Get Started
            </Button>
          )}
        </div>
      </div>

    </main>
  );
}