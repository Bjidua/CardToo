"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth";
import { profileService } from "@/lib/services/profile";
import { storeService } from "@/lib/services/store";
import type {
  AuthUser,
  LoginInput,
  RegisterInput,
  SellerOnboardingInput,
  Store,
  UserProfile,
} from "@/types";

type AuthStatus = "loading" | "guest" | "user";

interface AuthContextType {
  status: AuthStatus;
  user: AuthUser | null;
  profile: UserProfile | null;
  store: Store | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  becomeSeller: (input: SellerOnboardingInput) => Promise<void>;
  refreshAuth: () => Promise<void>;
  isLoading: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  isSeller: boolean;
  isGodModeEnabled: boolean;
  setGodMode: (enabled: boolean) => void;
  toggleGodMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GOD_MODE_KEY = "dev_god_mode_enabled";
const IS_DEV = process.env.NODE_ENV !== "production";
const IS_GOD_MODE_ALLOWED =
  IS_DEV && process.env.NEXT_PUBLIC_ENABLE_GOD_MODE === "true";

const godModeStorage = {
  get: () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(GOD_MODE_KEY) === "true";
  },
  set: (value: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(GOD_MODE_KEY, value ? "true" : "false");
    }
  },
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [isGodModeEnabled, setIsGodModeEnabled] = useState(() =>
    IS_GOD_MODE_ALLOWED ? godModeStorage.get() : false
  );

  const loadAuthenticatedState = async () => {
    const currentUser = await authService.getCurrentAccount();

    if (!currentUser) {
      setUser(null);
      setProfile(null);
      setStore(null);
      setStatus("guest");
      return;
    }

    const currentProfile = await profileService.getProfile(currentUser.id);
    const currentStore = await storeService.getStoreByOwnerUserId(currentUser.id);

    setUser(currentUser);
    setProfile(currentProfile);
    setStore(currentStore);
    setStatus("user");
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        await loadAuthenticatedState();
      } finally {
        if (isMounted) {
          setStatus((current) => (current === "loading" ? "guest" : current));
        }
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshAuth = async () => {
    setStatus("loading");
    await loadAuthenticatedState();
  };

  const login = async (input: LoginInput) => {
    await authService.login(input);
    await refreshAuth();
    router.push("/home");
  };

  const register = async (input: RegisterInput) => {
    const createdUser = await authService.register(input);
    await profileService.createProfile({
      userId: createdUser.id,
      username: input.username,
      email: input.email,
    });
    await refreshAuth();
    router.push("/home");
  };

  const becomeSeller = async (input: SellerOnboardingInput) => {
    if (!user || !profile) {
      throw new Error("Kamu harus login dulu sebelum membuka toko.");
    }

    const updatedProfile = await profileService.updateProfile(user.id, {
      role: "seller",
      full_name: input.fullName?.trim() || profile.full_name,
      phone: input.phone?.trim() || profile.phone,
    });

    const createdStore = await storeService.createStore(user.id, input);

    setProfile(updatedProfile);
    setStore(createdStore);
    setStatus("user");
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
    setStore(null);
    setStatus("guest");
    router.push("/login");
  };

  const setGodMode = (enabled: boolean) => {
    if (!IS_GOD_MODE_ALLOWED) return;
    godModeStorage.set(enabled);
    setIsGodModeEnabled(enabled);
  };

  const toggleGodMode = () => {
    setGodMode(!isGodModeEnabled);
  };

  const effectiveAuth = useMemo(() => {
    const godMode = IS_GOD_MODE_ALLOWED && isGodModeEnabled;
    const authenticated = status === "user" || godMode;
    const seller = profile?.role === "seller" || Boolean(store) || godMode;

    return {
      godMode,
      authenticated,
      guest: !authenticated,
      seller,
    };
  }, [status, profile?.role, store, isGodModeEnabled]);

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        profile,
        store,
        login,
        register,
        logout,
        becomeSeller,
        refreshAuth,
        isLoading: status === "loading",
        isGuest: effectiveAuth.guest,
        isAuthenticated: effectiveAuth.authenticated,
        isSeller: effectiveAuth.seller,
        isGodModeEnabled: effectiveAuth.godMode,
        setGodMode,
        toggleGodMode,
      }}
    >
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
