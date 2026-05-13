"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

const Checkbox = ({ label, className, ...props }: CheckboxProps) => {
  return (
    <label className={cn("flex items-center gap-2 cursor-pointer group", className)}>
      <input type="checkbox" className="hidden peer" {...props} />
      <div className="w-[20px] h-[20px] bg-surface-muted rounded-md peer-checked:bg-primary border border-surface-hover flex items-center justify-center transition-all duration-300">
        <svg 
          className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform duration-300" 
          viewBox="0 0 12 10" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 5L4 8L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {label && <span className="text-[14px] text-black select-none">{label}</span>}
    </label>
  );
};


export { Checkbox };
