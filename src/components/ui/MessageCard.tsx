"use client";

import React from "react";
import { ProfilePicture } from "@/components/ui/ProfilePicture";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MessageCardProps {
  userName: string;
  message: string;
  time: string;
  unreadCount?: number;
  avatar?: string;
  className?: string;
  onClick?: () => void;
}

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
      {/* Avatar */}
      <ProfilePicture 
        size={50} 
        className="shrink-0 border-2" 
        src={avatar}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center gap-0.5 overflow-hidden">
        <h4 className="text-[16px] font-semibold text-primary truncate">
          {userName}
        </h4>
        <p className="text-[14px] text-black/60 font-normal line-clamp-2 leading-tight">
          {message}
        </p>
      </div>

      {/* Meta Info */}
      <div className="flex flex-col items-end justify-between h-full py-1 shrink-0">
        <span className="text-[11px] font-light text-black/40">
          {time}
        </span>
        
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
