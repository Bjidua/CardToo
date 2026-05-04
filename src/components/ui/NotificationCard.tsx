"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  label?: string;
  title: string;
  description: string;
  time: string;
  icon?: React.ReactNode;
  className?: string;
}

export const NotificationCard = ({
  label = "TIME SENSITIVE",
  title,
  description,
  time,
  icon,
  className,
}: NotificationCardProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-[14px] p-4 w-full min-h-[80px] bg-surface-muted rounded-[22px]",
        className
      )}
    >
      {/* Icon Placeholder */}
      <div className="w-10 h-10 bg-black/10 rounded-[10px] flex items-center justify-center shrink-0 self-start mt-1">
        {icon || <div className="w-full h-full bg-gray-400/50 rounded-[10px]" />}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold text-black/50 uppercase tracking-tight truncate">
            {label}
          </span>
          <span className="text-[10px] font-normal text-black/50 shrink-0">
            {time}
          </span>
        </div>
        <h3 className="text-[13px] font-semibold text-text-main mt-0.5 leading-tight">
          {title}
        </h3>
        <p className="text-[13px] font-normal text-text-main mt-0.5 leading-snug">
          {description}
        </p>
      </div>
    </div>
  );
};
