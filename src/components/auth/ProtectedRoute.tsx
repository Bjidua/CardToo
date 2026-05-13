"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSeller?: boolean;
}

export const ProtectedRoute = ({ children, requireSeller = false }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isGuest, isLoading, isSeller } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isGuest) {
        router.push("/login");
      } else if (requireSeller && !isSeller) {
        router.push("/profile");
      }
    }
  }, [isGuest, isLoading, isSeller, requireSeller, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-tint">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Jika butuh seller tapi bukan seller, jangan render
  if (requireSeller && !isSeller) return null;

  return !isGuest ? <>{children}</> : null;
};

