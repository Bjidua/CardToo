import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, startIcon, endIcon, fullWidth = true, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-auto")}>
        {label && (
          <label className="text-sm font-medium text-text-main ml-4">
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-6 text-text-sub">
              {startIcon}
            </div>
          )}
          
          <input
            className={cn(
              "h-[50px] w-full border-none bg-[#F2F2F2] px-6 py-2 text-base text-text-main transition-all outline-none",
              "rounded-[26px]", // Sesuai spek Figma
              "placeholder:text-black/50",
              "focus:ring-2 focus:ring-primary/30",
              startIcon && "pl-14",
              endIcon && "pr-14",
              error && "ring-2 ring-danger/50",
              className
            )}
            ref={ref}
            {...props}
          />

          {endIcon && (
            <div className="absolute right-6 text-text-sub">
              {endIcon}
            </div>
          )}
        </div>

        {error && (
          <span className="text-xs text-danger ml-4 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };