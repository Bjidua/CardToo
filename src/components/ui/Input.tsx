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
          <label className="text-small font-medium text-text-main ml-1">
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3.5 text-text-sub">
              {startIcon}
            </div>
          )}
          
          <input
            className={cn(
              "h-12 w-full rounded-lg border-none bg-surface px-4 py-2 text-body text-text-main transition-all outline-none",
              "placeholder:text-text-sub/60",
              "focus:ring-2 focus:ring-primary/30 focus:bg-white",
              startIcon && "pl-11",
              endIcon && "pr-11",
              error && "ring-2 ring-danger/50 bg-danger/5",
              className
            )}
            ref={ref}
            {...props}
          />

          {endIcon && (
            <div className="absolute right-3.5 text-text-sub">
              {endIcon}
            </div>
          )}
        </div>

        {error && (
          <span className="text-small text-danger ml-1 font-medium animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };