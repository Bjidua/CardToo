// src/components/ui/Button.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
    isLoading?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            children,
            variant = "primary",
            isLoading = false,
            startIcon,
            endIcon,
            fullWidth = true, // Default to full width for mobile-first
            disabled,
            ...props
        },
        ref
    ) => {
        const baseClasses = cn(
            "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all active:scale-[0.98]",
            "font-bold text-base focus-visible:outline-none",
            "h-[55px] px-6 rounded-[26px]", // Sesuai spek Figma (55px height, 26px radius)
            "disabled:pointer-events-none disabled:opacity-60",
            "shadow-soft", // Shadow sesuai standard design system
            fullWidth ? "w-full" : "w-auto"
        );

        const variantClasses = {
            primary: "bg-primary text-white hover:brightness-110",
            secondary: "bg-secondary text-white hover:brightness-110",
            danger: "bg-danger text-white hover:brightness-110",
            ghost: "bg-background text-text-main shadow-none border border-transparent hover:bg-surface-hover", // "Cancel" variant
            outline: "bg-transparent text-primary border-2 border-primary shadow-none hover:bg-primary/5",
        };

        return (
            <button
                className={cn(baseClasses, variantClasses[variant], className)}
                ref={ref}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading && (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}

                {!isLoading && startIcon && (
                    <span className="inline-flex shrink-0">{startIcon}</span>
                )}

                <span className={cn(isLoading && "opacity-0")}>{children}</span>

                {!isLoading && endIcon && (
                    <span className="inline-flex shrink-0">{endIcon}</span>
                )}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
