"use client";

import React from "react";
import { ProfilePicture } from "@/components/ui/ProfilePicture";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  className?: string;
}

export const Header = ({ title = "Home", className }: HeaderProps) => {
  return (
    <>
      {/* Spacer agar konten tidak tertutup header yang fixed */}
      <div className="h-[90px]" />
      
      <header
        className={cn(
          "fixed top-0 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between w-full max-w-[440px] px-6 py-4 bg-white/80 backdrop-blur-md select-none shadow-sm rounded-b-[10px]",
          className
        )}
      >
      {/* Left: Profile Picture */}
      <div className="flex-1 flex justify-start">
        <ProfilePicture size={60} className="border-4" />
      </div>

      {/* Center: Page Title */}
      <div className="flex-1 flex justify-center">
        <h1 className="text-[34px] font-bold text-text-main tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right: Action Icons */}
      <div className="flex-1 flex justify-end items-center gap-4">
        <button className="relative p-1 hover:opacity-70 transition-opacity active:scale-90">
          <Icons.Notification size={32} className="text-accent" />
          {/* Subtle Notification Dot (Improvement) */}
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-white" />
        </button>
        <button className="p-1 hover:opacity-70 transition-opacity active:scale-90">
          <Icons.Cart size={32} className="text-accent" />
        </button>
      </div>
      </header>
    </>
  );
};
