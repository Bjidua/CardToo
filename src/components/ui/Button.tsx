import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Properti pendukung untuk komponen tombol kustom (Button)
 */
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Konten di dalam tombol */
    children: React.ReactNode;
    /** Varian gaya tombol berdasarkan desain sistem (default: primary) */
    variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
    /** Menampilkan status memuat (spinner) dan menonaktifkan tombol jika di set true */
    isLoading?: boolean;
    /** Elemen ikon yang ditampilkan sebelum teks */
    startIcon?: React.ReactNode;
    /** Elemen ikon yang ditampilkan setelah teks */
    endIcon?: React.ReactNode;
    /** Jika true, lebar tombol akan menjadi 100% dari kontainernya (default: true) */
    fullWidth?: boolean;
}

/**
 * Komponen Tombol inti yang digunakan di seluruh aplikasi CardToo.
 * Menggunakan gaya standar dari Figma (h-55px, rounded-26px).
 * Mendukung status pemuatan dan penambahan ikon di sisi kanan/kiri.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            children,
            variant = "primary",
            isLoading = false,
            startIcon,
            endIcon,
            fullWidth = true, // Default ke lebar penuh untuk mendukung pendekatan mobile-first
            disabled,
            ...props
        },
        ref
    ) => {
        // Kelas CSS dasar untuk tata letak tombol, animasi transisi, dan interaksi active tap
        const baseClasses = cn(
            "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all active:scale-[0.98]",
            "font-bold text-base focus-visible:outline-none",
            "h-[55px] px-6 rounded-[26px]", // Sesuai spek Figma (tinggi 55px, radius rounded 26px)
            "disabled:pointer-events-none disabled:opacity-60",
            "shadow-soft", // Shadow sesuai spesifikasi standar design system
            fullWidth ? "w-full" : "w-auto"
        );

        // Kategori varian warna tombol yang dapat dipilih sesuai context kegunaan
        const variantClasses = {
            primary: "bg-primary text-white hover:brightness-110",
            secondary: "bg-secondary text-white hover:brightness-110",
            danger: "bg-danger text-white hover:brightness-110",
            ghost: "bg-background text-text-main shadow-none border border-transparent hover:bg-surface-hover", // Varian tombol batal (cancel)
            outline: "bg-transparent text-primary border-2 border-primary shadow-none hover:bg-primary/5",
        };

        return (
            <button
                className={cn(baseClasses, variantClasses[variant], className)}
                ref={ref}
                // Tombol dinonaktifkan secara otomatis jika sedang memuat (isLoading) atau properti disabled bernilai true
                disabled={isLoading || disabled}
                {...props}
            >
                {/* Menampilkan animasi loader lingkaran jika sedang dalam proses pemuatan (loading) */}
                {isLoading && (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}

                {/* Menampilkan ikon awal sebelum teks jika dikirimkan oleh pemanggil komponen */}
                {!isLoading && startIcon && (
                    <span className="inline-flex shrink-0">{startIcon}</span>
                )}

                {/* Sembunyikan opacity teks tombol jika sedang menampilkan spinner agar visual tetap rapi */}
                <span className={cn(isLoading && "opacity-0")}>{children}</span>

                {/* Menampilkan ikon akhir setelah teks jika dikirimkan oleh pemanggil komponen */}
                {!isLoading && endIcon && (
                    <span className="inline-flex shrink-0">{endIcon}</span>
                )}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
