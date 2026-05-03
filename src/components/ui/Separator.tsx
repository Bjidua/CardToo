"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps {
  label?: string;
  className?: string;
}

export const Separator = ({ label, className }: SeparatorProps) => {
  return (
    <div className={cn("w-full flex items-center gap-4 py-2", className)}>
      <div className="h-px flex-1 bg-black/10 border-t border-dashed border-black/30" />
      {label && (
        <span className="text-base text-black/50 font-medium">{label}</span>
      )}
      <div className="h-px flex-1 bg-black/10 border-t border-dashed border-black/30" />
    </div>
  );
};
