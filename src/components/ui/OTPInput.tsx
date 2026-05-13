"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  label?: string;
  error?: string;
  length?: number;
  onComplete?: (code: string) => void;
}

const OTPInput = ({ label, error, length = 4, onComplete }: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Trigger completion
    const finalCode = newOtp.join("");
    if (finalCode.length === length && onComplete) {
      onComplete(finalCode);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-text-main ml-4">
          {label}
        </label>
      )}

      <div className="flex justify-between items-center w-full gap-4 sm:gap-[31px]">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "w-[64px] h-[64px] bg-surface rounded-[24px] text-center text-xl font-bold text-black outline-none transition-all",
              "focus:ring-2 focus:ring-primary/50",
              error && "ring-2 ring-danger/50",
              "select-none"
            )}
          />
        ))}
      </div>

      {error && (
        <span className="text-xs text-danger ml-4 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};

export { OTPInput };
