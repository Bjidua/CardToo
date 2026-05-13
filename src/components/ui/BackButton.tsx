"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronsLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const BackButton = ({ variant = "primary", className, ...props }: BackButtonProps) => {
  const router = useRouter();

  const variants = {
    primary: "bg-primary", // Blue (#00CAE0 / #00E6FF)
    secondary: "bg-secondary", // Purple (#A78BFA)
  };

  return (
    <button
      type="button"
      onClick={props.onClick || (() => router.back())}
      className={cn(
        "flex items-center justify-center p-[10px] w-[42px] h-[40px] rounded-[24px] shadow-soft",
        "transition-all active:scale-90 hover:brightness-110",
        variants[variant],
        className
      )}
      {...props}
    >
      <ChevronsLeft size={22} className="text-white" />
    </button>
  );
};

export { BackButton };
