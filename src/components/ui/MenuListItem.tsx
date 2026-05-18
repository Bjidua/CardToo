"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/Icons";
import Link from "next/link";

interface MenuListItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  showBorder?: boolean;
  subValue?: string;
  onClick?: () => void;
  className?: string;
}

export const MenuListItem = ({
  icon,
  label,
  href,
  showBorder = false,
  subValue,
  onClick,
  className,
}: MenuListItemProps) => {
  const content = (
    <>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-card bg-surface-hover flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-[16px] font-medium text-text-main">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {subValue && (
          <span className="text-[14px] text-text-sub font-medium">{subValue}</span>
        )}
        <Icons.ChevronRight
          size={18}
          className="text-text-sub group-hover:translate-x-1 transition-transform"
        />
      </div>
    </>
  );

  const containerClasses = cn(
    "flex items-center justify-between p-5 hover:bg-surface-hover/40 transition-colors group",
    showBorder && "border-b border-surface-muted",
    className
  );

  if (href) {
    return (
      <Link href={href} className={containerClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={containerClasses}>
      {content}
    </button>
  );
};
