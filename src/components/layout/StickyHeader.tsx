"use client";

import React from "react";
import { motion } from "framer-motion";
import { BackgroundLogo } from "@/components/ui/BackgroundLogo";
import { cn } from "@/lib/utils";

interface StickyHeaderProps {
  title: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
  variant?: "logo" | "minimal" | "solid";
  size?: "sm" | "lg";
}

export const StickyHeader = ({ 
  title, 
  leftAction, 
  rightAction, 
  className,
  variant = "logo",
  size = "lg"
}: StickyHeaderProps) => {
  return (
    <div className={cn(
      "sticky top-0 z-40 w-full max-w-[440px] mx-auto overflow-hidden transition-all duration-300",
      variant === "logo" && "bg-white/40 backdrop-blur-xl border-b border-surface-muted rounded-b-[32px] shadow-medium",
      variant === "minimal" && "bg-white/90 backdrop-blur-md border-b border-surface-muted",
      variant === "solid" && "bg-white border-b border-surface-muted shadow-soft",
      className
    )}>
      {/* Background Pattern for 'logo' variant */}
      {variant === "logo" && (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/60 z-1" />
          <BackgroundLogo className="w-full h-full scale-125 translate-y-[-10%] opacity-90" />
          {/* Subtle Glow */}
          <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[140%] bg-radial from-primary/10 to-transparent blur-3xl" />
        </div>
      )}

      {/* Header Content */}
      <div className={cn(
        "relative z-10 w-full px-4 md:px-6 flex items-center transition-all duration-300",
        size === "lg" ? "h-[140px] items-end pb-6" : "h-[72px] items-center"
      )}>
        <div className="w-full flex items-center justify-between gap-3">
          {/* Left Slot */}
          <div className="flex-1 flex justify-start min-w-[40px]">
            {leftAction}
          </div>

          {/* Title */}
          <div className="flex-4 flex justify-center text-center px-2">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "font-bold text-text-main tracking-tight leading-tight",
                size === "lg" 
                  ? (title.length > 15 ? "text-[24px]" : "text-[32px]")
                  : "text-[18px]"
              )}
            >
              {title}
            </motion.h1>
          </div>

          {/* Right Slot */}
          <div className="flex-1 flex justify-end min-w-[40px]">
            {rightAction}
          </div>
        </div>
      </div>
    </div>
  );
};
