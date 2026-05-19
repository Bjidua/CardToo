"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Properti pendukung komponen input OTP.
 */
interface OTPInputProps {
  /** Label form teks di atas input */
  label?: string;
  /** Pesan kesalahan jika input OTP salah */
  error?: string;
  /** Jumlah digit kode OTP (default: 4) */
  length?: number;
  /** Callback ketika semua digit telah terisi penuh */
  onComplete?: (code: string) => void;
}

/**
 * Komponen Input Kode OTP (One-Time Password) kustom.
 * Menangani pemisahan input ke dalam kotak per digit secara otomatis, 
 * fitur auto-focus ke kotak berikutnya saat mengetik, dan kembali ke kotak sebelumnya saat menghapus (Backspace).
 */
const OTPInput = ({ label, error, length = 4, onComplete }: OTPInputProps) => {
  // State untuk menyimpan nilai tiap digit OTP (disesuaikan dengan properti `length`)
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  
  // Referensi DOM ke masing-masing elemen <input> untuk kontrol fokus manual
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /**
   * Menangani perubahan karakter pada kotak input indeks tertentu.
   * 
   * @param value Karakter masukan
   * @param index Indeks kotak input
   */
  const handleChange = (value: string, index: number) => {
    // Abaikan input jika bukan angka numerik
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Pastikan hanya karakter terakhir yang disimpan (jika user mengetik cepat ganda)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus: Pindahkan fokus kursor ke kotak berikutnya jika kotak saat ini sudah terisi
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Trigger callback penyelesaian kode OTP jika seluruh digit sudah terisi penuh
    const finalCode = newOtp.join("");
    if (finalCode.length === length && onComplete) {
      onComplete(finalCode);
    }
  };

  /**
   * Menangani aksi penekanan tombol backspace untuk kembali ke kotak sebelumnya.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Jika tombol yang ditekan adalah backspace dan kotak saat ini kosong, kembalikan kursor ke kotak sebelumnya
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

      {/* Barisan kotak-kotak input per digit OTP disusun seimbang (justify-between) */}
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
            // Desain kotak OTP: tinggi & lebar 64px, rounded-24px, teks bold 20px di tengah
            className={cn(
              "h-[64px] w-[64px] rounded-[24px] bg-surface text-center text-xl font-bold text-text-main outline-none transition-all",
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
