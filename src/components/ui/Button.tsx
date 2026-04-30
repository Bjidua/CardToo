// src/components/ui/Button.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline" | "dark" | "ghost";
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
            fullWidth = false,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseClasses = cn(
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn transition-colors",
            "font-medium text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            "h-11 px-5 py-2.5",
            "disabled:pointer-events-none disabled:opacity-60",
            fullWidth ? "w-full" : "w-auto"
        );

        const variantClasses = {
            primary: cn(
                "bg-primary text-white shadow-soft", // #00CAE0 & shadow-soft
                "hover:brightness-105 active:brightness-95"
            ),
            secondary: cn(
                "bg-secondary text-white shadow-soft", // #A78BFA
                "hover:brightness-105 active:brightness-95"
            ),
            outline: cn(
                "border border-primary bg-transparent text-primary",
                "hover:bg-primary/5 active:bg-primary/10"
            ),
            dark: cn(
                "bg-accent text-white", // #434343
                "hover:brightness-110 active:brightness-90",
                "rounded-full px-4 h-9 text-small"
            ),
            ghost: cn(
                "bg-transparent text-text-main",
                "hover:bg-surface active:bg-neutral-border/50"
            ),
        };

        return (
            <button
                className={cn(baseClasses, variantClasses[variant], className)}
                ref={ref}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="h-4 w-4 animate-spin text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
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