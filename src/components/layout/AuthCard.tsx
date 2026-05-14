import React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const AuthCard = ({ children, title, className }: AuthCardProps) => {
  return (
    <div className={cn(
      "relative mt-[32px] w-full bg-background rounded-t-card shadow-medium px-6 pt-[36px] pb-8 flex flex-col",
      className
    )}>
      {title && (
        <h2 className="text-[20px] font-bold text-center text-black mb-8">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export { AuthCard };
