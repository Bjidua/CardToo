"use client";

import React from "react";

interface DetailBoxProps {
  label: string;
  value: string;
  className?: string;
}

export function DetailBox({ label, value, className }: DetailBoxProps) {
  return (
    <div className={`bg-surface-light p-4 rounded-2xl border border-surface-muted flex flex-col gap-0.5 ${className}`}>
      <span className="text-[10px] text-text-sub font-bold uppercase tracking-wider">{label}</span>
      <span className="text-[13px] font-black text-text-main line-clamp-1">{value}</span>
    </div>
  );
}
