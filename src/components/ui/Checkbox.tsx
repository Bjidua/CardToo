"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = ({ label, className, ...props }: CheckboxProps) => {
  return (
    <label className={cn("flex items-center gap-2 cursor-pointer group", className)}>
      <input type="checkbox" className="hidden peer" {...props} />
      <div className="w-[15px] h-[15px] bg-skeleton rounded-sm peer-checked:bg-primary transition-colors" />
      <span className="text-[14px] text-black select-none">{label}</span>
    </label>
  );
};

export { Checkbox };
