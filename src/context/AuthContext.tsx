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

/**
 * Status yang mungkin terjadi selama proses verifikasi autentikasi:
 * - `loading`: Sedang memuat/memeriksa sesi ke Appwrite
 * - `guest`: Pengguna belum login
 * - `user`: Pengguna berhasil login (baik buyer maupun seller)
 */
type AuthStatus = "loading" | "guest" | "user";

/**
 * Antarmuka/struktur data untuk state global Autentikasi yang disediakan oleh AuthContext.
 */
interface AuthContextType {
  status: AuthStatus;
  /** Data akun Appwrite dasar */
  user: AuthUser | null;
  /** Data profil pengguna (nama, role, avatar) dari database */
  profile: UserProfile | null;
  /** Data toko (jika pengguna adalah seller) */
  store: Store | null;
  /** Fungsi untuk memproses login */
  login: (input: LoginInput) => Promise<void>;
  /** Fungsi untuk membuat akun baru */
  register: (input: RegisterInput) => Promise<void>;
  /** Fungsi untuk mengakhiri sesi aktif */
  logout: () => Promise<void>;
  /** Fungsi untuk meng-upgrade role dari buyer menjadi seller dan membuat profil toko */
  becomeSeller: (input: SellerOnboardingInput) => Promise<void>;
  /** Memuat ulang status pengguna secara manual */
  refreshAuth: () => Promise<void>;
  /** Bernilai true saat sedang mengecek sesi */
  isLoading: boolean;
  /** Bernilai true jika pengguna belum login */
  isGuest: boolean;
  /** Bernilai true jika pengguna sudah memiliki sesi aktif */
  isAuthenticated: boolean;
  /** Bernilai true jika pengguna adalah penjual */
  isSeller: boolean;
  /** Mengabaikan pengecekan autentikasi jika di lingkungan dev (khusus untuk bypass UI) */
  isGodModeEnabled: boolean;
  setGodMode: (enabled: boolean) => void;
  toggleGodMode: () => void;
}

// Inisialisasi Context utama untuk Autentikasi
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Nama key untuk penyimpanan status bypass developer mode (God Mode)
const GOD_MODE_KEY = "dev_god_mode_enabled";
// Deteksi apakah aplikasi berjalan di local development environment
const IS_DEV = process.env.NODE_ENV !== "production";
// Bypass hanya diperbolehkan jika bernilai true pada file env lokal
const IS_GOD_MODE_ALLOWED =
  IS_DEV && process.env.NEXT_PUBLIC_ENABLE_GOD_MODE === "true";

// Helper untuk membaca & menyimpan status God Mode ke local storage browser
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

/**
 * Komponen Provider (pembungkus utama) untuk menyalurkan state autentikasi 
 * ke seluruh komponen aplikasi CardToo.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  
  // Mengelola status pemuatan dan detail session dari Appwrite
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  
  // Developer Mode (God Mode) bypass state
  const [isGodModeEnabled, setIsGodModeEnabled] = useState(() =>
    IS_GOD_MODE_ALLOWED ? godModeStorage.get() : false
  );

  /**
   * Menarik status otorisasi dari database secara sinkron/berurutan.
   * Dipanggil saat inisialisasi awal atau refreshAuth.
   */
  const loadAuthenticatedState = async () => {
    // Ambil data akun dari Appwrite Auth
    const currentUser = await authService.getCurrentAccount();

    if (!currentUser) {
      setUser(null);
      setProfile(null);
      setStore(null);
      setStatus("guest");
      return;
    }

    // Ambil data profil dari database Appwrite
    const currentProfile = await profileService.getProfile(currentUser.id);
    
    // Ambil data toko jika terdaftar sebagai seller
    const currentStore = await storeService.getStoreByOwnerUserId(currentUser.id);

    setUser(currentUser);
    setProfile(currentProfile);
    setStore(currentStore);
    setStatus("user");
  };

  // Efek samping untuk menarik sesi ketika aplikasi pertama kali dimuat di browser
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        await loadAuthenticatedState();
      } finally {
        if (isMounted) {
          // Pastikan status dimutasi menjadi guest jika user tidak memiliki session terdaftar
          setStatus((current) => (current === "loading" ? "guest" : current));
        }
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Memicu pemuatan ulang otorisasi secara manual.
   */
  const refreshAuth = async () => {
    setStatus("loading");
    await loadAuthenticatedState();
  };

  /**
   * Memproses login menggunakan kredensial email & kata sandi.
   * @param input Data email & password
   */
  const login = async (input: LoginInput) => {
    await authService.login(input);
    await refreshAuth();
    router.push("/home");
  };

  /**
   * Mendaftarkan pengguna baru dan langsung membuat baris profil di database.
   * @param input Kredensial pendaftaran baru
   */
  const register = async (input: RegisterInput) => {
    const createdUser = await authService.register(input);
    // Buat profil pengguna baru terkait ID yang baru saja didaftarkan
    await profileService.createProfile({
      userId: createdUser.id,
      username: input.username,
      email: input.email,
    });
    await refreshAuth();
    router.push("/home");
  };

  /**
   * Mengupgrade peran pembeli (buyer) biasa menjadi penjual (seller) dan mendaftarkan toko baru.
   * @param input Detail data nama lengkap, nomor HP, nama toko, banner, logo, dll.
   */
  const becomeSeller = async (input: SellerOnboardingInput) => {
    if (!user || !profile) {
      throw new Error("Kamu harus login dulu sebelum membuka toko.");
    }

    // Ubah role profil pengguna di database menjadi 'seller'
    const updatedProfile = await profileService.updateProfile(user.id, {
      role: "seller",
      full_name: input.fullName?.trim() || profile.full_name,
      phone: input.phone?.trim() || profile.phone,
    });

    // Buat data toko baru di database
    const createdStore = await storeService.createStore(user.id, input);

    // Perbarui state internal React
    setProfile(updatedProfile);
    setStore(createdStore);
    setStatus("user");
  };

  /**
   * Menghapus sesi login saat ini dan mengalihkan navigasi ke halaman masuk.
   */
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
    setStore(null);
    setStatus("guest");
    router.push("/login");
  };

  /**
   * Mengaktifkan/menonaktifkan God Mode (khusus pengujian developer).
   */
  const setGodMode = (enabled: boolean) => {
    if (!IS_GOD_MODE_ALLOWED) return;
    godModeStorage.set(enabled);
    setIsGodModeEnabled(enabled);
  };

  /**
   * Toggle status God Mode.
   */
  const toggleGodMode = () => {
    setGodMode(!isGodModeEnabled);
  };

  // Memoized evaluasi otorisasi gabungan agar tidak memicu render ulang yang tidak perlu
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

/**
 * Custom hook untuk mengakses state global autentikasi secara mudah 
 * dari dalam komponen klien (Client Components).
 * 
 * @returns {AuthContextType} Objek berisi user, profile, status, dan fungsi autentikasi
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
