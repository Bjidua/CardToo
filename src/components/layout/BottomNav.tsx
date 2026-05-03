"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", href: "/home", icon: Icons.Home },
  { name: "Message", href: "/messages", icon: Icons.Message },
  { name: "Collection", href: "/collections", icon: Icons.Collection },
  { name: "Profile", href: "/profile", icon: Icons.Profile },
];

export const BottomNav = ({ isDemo = false }: { isDemo?: boolean }) => {
  const pathname = usePathname();

  return (
    <div className={cn(
      "left-0 right-0 flex justify-center px-4 z-50 pointer-events-none",
      isDemo ? "relative bottom-0" : "fixed bottom-8"
    )}>
      <nav className="flex items-center justify-between w-full max-w-[393px] pointer-events-auto gap-3">
        {/* Main Nav Card */}
        <motion.div 
          layout
          className="flex-1 h-[65px] bg-backgorund shadow-[0px_8px_16px_rgba(0,0,0,0.1)] rounded-[60px] px-2 flex items-center justify-between relative overflow-hidden"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname === `${item.href}/`;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex items-center justify-center h-[50px] outline-none"
                style={{ flex: isActive ? 2.5 : 1 }}
              >
                <motion.div
                  layout
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                    mass: 0.8
                  }}
                  className={cn(
                    "relative w-full h-full flex items-center justify-center rounded-[60px] overflow-hidden px-2",
                    isActive ? "text-white" : "text-accent"
                  )}
                >
                  {/* Shared Pill Background */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-primary z-0"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                        mass: 0.8
                      }}
                    />
                  )}

                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <Icon active={isActive} size={isActive ? 26 : 24} className="shrink-0" />
                    
                    {isActive && (
                      <motion.span
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[16px] font-bold leading-tight whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>

        {/* Search Button */}
        <motion.button 
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="w-[65px] h-[65px] bg-background shadow-[0px_8px_16px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center text-accent shrink-0 outline-none"
        >
          <Icons.Search size={34} />
        </motion.button>
      </nav>
    </div>
  );
};
