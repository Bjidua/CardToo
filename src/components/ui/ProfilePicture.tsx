"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, getAssetPath } from "@/lib/utils";

interface ProfilePictureProps {
  src?: string;
  alt?: string;
  className?: string;
  size?: number;
}

export const ProfilePicture = ({
  src,
  alt = "Profile Picture",
  className,
  size = 60,
}: ProfilePictureProps) => {
  const imageSrc = src || getAssetPath("/assets/ProfilePicture.svg");
  const isPreviewSource =
    imageSrc.startsWith("blob:") || imageSrc.startsWith("data:");

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden border-[5px] border-white shadow-soft bg-skeleton shrink-0",
        "select-none pointer-events-none", // Native App Feel
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
        draggable={false}
        unoptimized={isPreviewSource}
      />
    </div>
  );
};
