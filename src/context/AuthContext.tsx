"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
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
  isGodModeEnabled: boolean;
  setGodMode: (enabled: boolean) => void;
  toggleGodMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_SELLER_KEY = "is_seller";
const GOD_MODE_KEY = "dev_god_mode_enabled";
const IS_DEV = process.env.NODE_ENV !== "production";
const IS_GOD_MODE_ALLOWED = IS_DEV && process.env.NEXT_PUBLIC_ENABLE_GOD_MODE === "true";

/**
 * Temporary client auth storage.
 * TODO(Appwrite): replace these helpers with Appwrite Account session APIs.
 */
const authStorage = {
  getToken: () => (typeof window === "undefined" ? null : localStorage.getItem(AUTH_TOKEN_KEY)),
  setToken: (token: string) => {
    if (typeof window !== "undefined") localStorage.setItem(AUTH_TOKEN_KEY, token);
  },
  clearToken: () => {
    if (typeof window !== "undefined") localStorage.removeItem(AUTH_TOKEN_KEY);
  },
  getIsSeller: () => (typeof window === "undefined" ? false : localStorage.getItem(AUTH_SELLER_KEY) === "true"),
  setIsSeller: (value: boolean) => {
    if (typeof window !== "undefined") localStorage.setItem(AUTH_SELLER_KEY, value ? "true" : "false");
  },
  clearIsSeller: () => {
    if (typeof window !== "undefined") localStorage.removeItem(AUTH_SELLER_KEY);
  },
  getGodMode: () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(GOD_MODE_KEY) === "true";
  },
  setGodMode: (value: boolean) => {
    if (typeof window !== "undefined") localStorage.setItem(GOD_MODE_KEY, value ? "true" : "false");
  },
  clearGodMode: () => {
    if (typeof window !== "undefined") localStorage.removeItem(GOD_MODE_KEY);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>(() => {
    if (typeof window === "undefined") return "loading";
    return authStorage.getToken() ? "user" : "guest";
  });

  const [isSeller, setIsSeller] = useState(() => authStorage.getIsSeller());
  const [isGodModeEnabled, setIsGodModeEnabled] = useState(() => {
    if (!IS_GOD_MODE_ALLOWED) return false;
    return authStorage.getGodMode();
  });

  const router = useRouter();

  const login = (token: string, sellerStatus: boolean = false) => {
    authStorage.setToken(token);
    authStorage.setIsSeller(sellerStatus);
    setStatus("user");
    setIsSeller(sellerStatus);
    router.push("/home");
  };

  const becomeSeller = () => {
    authStorage.setIsSeller(true);
    setIsSeller(true);
    router.push("/seller/dashboard");
  };

  const logout = () => {
    authStorage.clearToken();
    authStorage.clearIsSeller();
    setStatus("guest");
    setIsSeller(false);
    router.push("/login");
  };

  const setGodMode = (enabled: boolean) => {
    if (!IS_GOD_MODE_ALLOWED) return;
    authStorage.setGodMode(enabled);
    setIsGodModeEnabled(enabled);
  };

  const toggleGodMode = () => {
    setGodMode(!isGodModeEnabled);
  };

  const effectiveAuth = useMemo(() => {
    const godMode = IS_GOD_MODE_ALLOWED && isGodModeEnabled;
    const authenticated = status === "user" || godMode;
    return {
      godMode,
      authenticated,
      guest: !authenticated,
      seller: isSeller || godMode
    };
  }, [status, isSeller, isGodModeEnabled]);

  return (
    <AuthContext.Provider value={{
      status,
      login,
      logout,
      becomeSeller,
      isLoading: status === "loading",
      isGuest: effectiveAuth.guest,
      isAuthenticated: effectiveAuth.authenticated,
      isSeller: effectiveAuth.seller,
      isGodModeEnabled: effectiveAuth.godMode,
      setGodMode,
      toggleGodMode
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
