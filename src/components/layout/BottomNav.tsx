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

  // Daftar halaman core yang menampilkan BottomNav
  const showOnPaths = ["/home", "/messages", "/collections", "/profile"];
  
  // Sembunyikan navbar jika tidak berada di path core (dan bukan demo)
  if (!isDemo && !showOnPaths.some(path => pathname === path || pathname === `${path}/`)) {
    return null;
  }

  return (
    <div className={cn(
      "left-0 right-0 flex justify-center px-4 z-50 pointer-events-none",
      isDemo ? "relative bottom-0" : "fixed bottom-8"
    )}>
      <nav className="flex items-center justify-between w-full max-w-[393px] pointer-events-auto gap-3">
        {/* Main Nav Card - STATIS (Tidak Berubah Ukuran) */}
        <div className="flex-1 h-[65px] bg-background shadow-[0px_8px_16px_rgba(0,0,0,0.1)] rounded-[60px] px-2 flex items-center justify-between relative overflow-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname === `${item.href}/`;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex-1 h-full flex items-center justify-center group"
              >
                {/* Floating Active Pill (Shared Layout) */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-y-2 inset-x-1 bg-primary rounded-[40px] z-0"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                      mass: 0.8
                    }}
                  />
                )}

                {/* Content Container */}
                <div className={cn(
                  "relative z-10 flex items-center justify-center gap-2 px-3 transition-colors duration-300",
                  isActive ? "text-white" : "text-accent/40"
                )}>
                  <item.icon 
                    active={isActive} 
                    size={24} 
                    className="shrink-0"
                  />
                  
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[14px] font-bold whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Search Button (Separate & Static) */}
        <Link href="/search">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-[65px] h-[65px] bg-white shadow-[0px_8px_16px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center active:bg-gray-50 transition-colors"
          >
            <Icons.Search size={28} className="text-accent" />
          </motion.button>
        </Link>
      </nav>
    </div>
  );
};
