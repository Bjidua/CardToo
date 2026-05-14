"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

const isDev = process.env.NODE_ENV !== "production";
const isGodModeAllowed = process.env.NEXT_PUBLIC_ENABLE_GOD_MODE === "true";

export const DevGodModePanel = () => {
  const { isGodModeEnabled, setGodMode } = useAuth();

  if (!isDev || !isGodModeAllowed) return null;

  return (
    <div className="fixed right-4 top-4 z-[60] rounded-2xl bg-background shadow-medium border border-accent/20 p-3 w-[180px]">
      <p className="text-[11px] font-bold text-text-main mb-2">DEV GOD MODE</p>
      <button
        type="button"
        onClick={() => setGodMode(!isGodModeEnabled)}
        className="w-full h-9 rounded-xl bg-primary text-white text-[12px] font-bold active:scale-[0.99] transition-transform"
      >
        {isGodModeEnabled ? "Disable" : "Enable"}
      </button>
      <p className="mt-2 text-[10px] text-text-main/70 leading-tight">
        Dev-only bypass untuk testing akses fitur tanpa guest lock.
      </p>
    </div>
  );
};