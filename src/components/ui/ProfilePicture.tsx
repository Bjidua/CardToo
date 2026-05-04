"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProfilePictureProps {
  src?: string;
  alt?: string;
  className?: string;
  size?: number;
}

export const ProfilePicture = ({
  src = "/assets/ProfilePicture.svg",
  alt = "Profile Picture",
  className,
  size = 60,
}: ProfilePictureProps) => {
  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden border-[5px] border-white shadow-[2px_4px_4px_rgba(0,0,0,0.25)] bg-skeleton shrink-0",
        "select-none pointer-events-none", // Native App Feel
        className
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-black/20 font-bold">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};
