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
      "absolute inset-x-0 bottom-0 top-[187px] bg-[#FAFAFA] rounded-t-[46px] shadow-[0px_-9px_21.2px_rgba(0,0,0,0.25)] px-6 pt-[36px] pb-10 flex flex-col",
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
