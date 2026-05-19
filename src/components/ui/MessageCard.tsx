"use client";

import React from "react";
import { ProfilePicture } from "@/components/ui/ProfilePicture";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/**
 * Properti pendukung untuk komponen MessageCard (Kartu Pesan).
 */
interface MessageCardProps {
  /** Nama pengguna atau toko lawan bicara */
  userName: string;
  /** Cuplikan isi pesan terakhir (akan dipotong otomatis jika terlalu panjang) */
  message: string;
  /** Waktu pesan terakhir dikirim (misal: "12:30", "Kemarin") */
  time: string;
  /** Jumlah pesan masuk yang belum dibaca (jika > 0 akan menampilkan badge notifikasi merah) */
  unreadCount?: number;
  /** URL gambar avatar profil lawan bicara */
  avatar?: string;
  /** Ekstra CSS class */
  className?: string;
  /** Aksi ketika kartu chat ini ditekan */
  onClick?: () => void;
}

/**
 * Komponen UI untuk menampilkan satu kontak obrolan (chat/room) 
 * dalam daftar Inbox pesan pengguna.
 */
export const MessageCard = ({
  userName,
  message,
  time,
  unreadCount = 0,
  avatar,
  className,
  onClick,
}: MessageCardProps) => {
  return (
    // Pembungkus utama menggunakan motion.div dengan transisi active tap mengecil (scale: 0.98)
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 p-4 w-full bg-white rounded-card",
        "shadow-soft hover:shadow-medium",
        "transition-all duration-300 cursor-pointer select-none",
        className
      )}
    >
      {/* Sisi Kiri: Gambar Foto Profil Lawan Bicara */}
      <ProfilePicture 
        size={50} 
        className="shrink-0 border-2" 
        src={avatar}
      />

      {/* Sisi Tengah: Nama Kontak & Cuplikan Isi Pesan Terakhir */}
      <div className="flex-1 flex flex-col justify-center gap-0.5 overflow-hidden">
        {/* Nama kontak dipotong (truncate) jika terlalu panjang melampaui lebar kontainer */}
        <h4 className="text-[16px] font-semibold text-primary truncate">
          {userName}
        </h4>
        {/* Teks cuplikan chat dibatasi maksimal 2 baris (line-clamp-2) */}
        <p className="text-[14px] text-text-sub font-normal line-clamp-2 leading-tight">
          {message}
        </p>
      </div>

      {/* Sisi Kanan: Metadata Waktu Kirim & Badge Jumlah Chat Belum Dibaca */}
      <div className="flex flex-col items-end justify-between h-full py-1 shrink-0">
        {/* Indikator waktu pesan terakhir */}
        <span className="text-[11px] font-light text-text-sub">
          {time}
        </span>
        
        {/* Tampilkan badge bulat notifikasi merah hanya jika unreadCount bernilai lebih besar dari 0 */}
        {unreadCount > 0 && (
          <div className="flex items-center justify-center w-[22px] h-[22px] bg-notification rounded-full shadow-sm">
            <span className="text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
