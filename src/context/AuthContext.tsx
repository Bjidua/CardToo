"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthStatus = "loading" | "guest" | "user";

interface AuthContextType {
  status: AuthStatus;
  login: (token: string, isSeller?: boolean) => void;
  logout: () => void;
  becomeSeller: () => void;
  isLoading: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  isSeller: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [isSeller, setIsSeller] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const sellerStatus = localStorage.getItem("is_seller") === "true";
    
    if (token) {
      setStatus("user");
      setIsSeller(sellerStatus);
    } else {
      setStatus("guest");
      setIsSeller(false);
    }
  }, []);

  const login = (token: string, sellerStatus: boolean = false) => {
    localStorage.setItem("auth_token", token);
    if (sellerStatus) localStorage.setItem("is_seller", "true");
    setStatus("user");
    setIsSeller(sellerStatus);
    router.push("/home");
  };

  const becomeSeller = () => {
    localStorage.setItem("is_seller", "true");
    setIsSeller(true);
    router.push("/seller/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("is_seller");
    setStatus("guest");
    setIsSeller(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{
      status,
      login,
      logout,
      becomeSeller,
      isLoading: status === "loading",
      isGuest: status === "guest",
      isAuthenticated: status === "user",
      isSeller
    }}>

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
