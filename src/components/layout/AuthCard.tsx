import React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const AuthCard = ({ children, title, className }: AuthCardProps) => {
  return (
    <div
      className={cn(
        "relative -mt-4 w-full flex-1 bg-background rounded-t-[40px] px-8 pt-10 pb-8 flex flex-col",
        className
      )}
      style={{
        boxShadow:
          "0 -12px 32px rgba(0, 202, 224, 0.30), 0 18px 38px rgba(0, 202, 224, 0.30)",
      }}
    >
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
