"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Icons } from "./Icons";

/** Kategori tipe notifikasi yang memengaruhi tampilan warna & ikon default */
export type NotificationType = "system" | "promo" | "order" | "alert" | "message" | "chat";

/**
 * Properti pendukung komponen Kartu Notifikasi.
 */
interface NotificationCardProps {
  /** Label grup notifikasi (misal: "Hari Ini", "Pesanan") */
  label?: string;
  /** Judul singkat pemberitahuan */
  title: string;
  /** Detail atau deskripsi notifikasi */
  description: string;
  /** Jam / waktu notifikasi dikirim */
  time: string;
  /** Ikon kustom, akan mengesampingkan ikon default dari tipe */
  icon?: React.ReactNode;
  /** Tipe notifikasi */
  type?: NotificationType;
  /** Menandakan apakah notifikasi sudah dibuka/dibaca pengguna */
  isRead?: boolean;
  /** Ekstra CSS Class */
  className?: string;
  /** Callback saat notifikasi ditekan */
  onClick?: () => void;
}

/**
 * Memetakan tipe notifikasi ke skema warna background, warna teks, dan ikon bawaan.
 * 
 * @param type Tipe notifikasi
 */
const getNotificationConfig = (type: NotificationType) => {
  switch (type) {
    case "promo":
      return {
        icon: <Icons.Notification size={20} />,
        color: "bg-notification/10 text-notification",
        dotColor: "bg-notification",
      };
    case "order":
      return {
        icon: <Icons.Cart size={20} />,
        color: "bg-primary/10 text-primary",
        dotColor: "bg-primary",
      };
    case "alert":
      return {
        icon: <Icons.Info size={20} />,
        color: "bg-warning/10 text-warning",
        dotColor: "bg-warning",
      };
    case "message":
    case "chat":
      return {
        icon: <Icons.Message size={20} />,
        color: "bg-secondary/10 text-secondary",
        dotColor: "bg-secondary",
      };
    default:
      return {
        icon: <Icons.Info size={20} />,
        color: "bg-accent/10 text-accent",
        dotColor: "bg-accent",
      };
  }
};

/**
 * Komponen UI untuk merender satu item riwayat/notifikasi.
 * Mendukung warna ikon otomatis berdasarkan jenis (promo merah, order biru, dst).
 * Jika status isRead=true, tampilannya akan lebih redup (grayscale).
 */
export const NotificationCard = ({
  label,
  title,
  description,
  time,
  icon,
  type = "system",
  isRead = false,
  className,
  onClick,
}: NotificationCardProps) => {
  const config = getNotificationConfig(type);

  return (
    // Motion div untuk animasi hover (y: -3) dan tap/klik (scale: 0.97) demi native-feel UX
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "relative flex items-start gap-4 p-4 w-full rounded-card cursor-pointer transition-all duration-300",
        isRead 
          ? "bg-surface-muted/60 grayscale-[0.2]" // Jika sudah dibaca, ubah visual menjadi agak redup/abu-abu
          : "bg-white border border-surface-muted shadow-soft hover:shadow-medium",
        className
      )}
    >
      {/* Indikator Titik Unread (Belum Dibaca): Bulatan kecil berkedip (pulse) */}
      {!isRead && (
        <span className={cn(
          "absolute top-5 right-5 w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm animate-pulse", 
          config.dotColor
        )} />
      )}

      {/* Area Ikon dengan latar belakang transparan (Glassmorphism backdrop-blur) */}
      <div className={cn(
        "w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 transition-transform duration-500 hover:rotate-6",
        config.color,
        "backdrop-blur-md"
      )}>
        {icon || config.icon}
      </div>

      {/* Bagian Konten Kanan: Tag Tipe, Waktu Kirim, Judul, dan Teks Deskripsi */}
      <div className="flex-1 flex flex-col min-w-0 pt-0.5">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            {/* Tag label kategori atas */}
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
              isRead ? "bg-surface-hover text-text-sub" : `${config.color} brightness-95`
            )}>
              {label || type}
            </span>
          </div>
          <span className="text-[10px] font-medium text-text-sub/60 shrink-0">
            {time}
          </span>
        </div>
        
        {/* Judul Notifikasi */}
        <h3 className={cn(
          "text-[14px] font-bold leading-tight mb-1 transition-colors",
          isRead ? "text-text-main/60" : "text-text-main"
        )}>
          {title}
        </h3>
        
        {/* Deskripsi Notifikasi (dibatasi maksimal 2 baris teks) */}
        <p className={cn(
          "text-[12.5px] leading-relaxed line-clamp-2 transition-colors",
          isRead ? "text-text-sub/60" : "text-text-sub"
        )}>
          {description}
        </p>
      </div>
    </motion.div>
  );
};
