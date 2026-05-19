"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

/** Tipe dukungan bahasa di CardToo (Indonesia & Inggris) */
export type AppLanguage = "id" | "en";

// Key LocalStorage untuk menyimpan preferensi bahasa pengguna agar persisten
const LANGUAGE_STORAGE_KEY = "cardtoo-language";

// Representasi tipe data kamus kata (dictionary) untuk terjemahan teks
type Dictionary = Record<string, string>;

// Kamus kata (Dictionary) dua bahasa untuk kebutuhan lokalisasi antarmuka pengguna
const dictionaries: Record<AppLanguage, Dictionary> = {
  id: {
    language: "Bahasa",
    indonesia: "Indonesia",
    english: "English",
    settings: "Pengaturan",
    account_security: "Akun & Keamanan",
    edit_profile: "Edit Profil",
    my_address: "Alamat Saya",
    bank_card: "Rekening Bank / Kartu",
    security_password: "Keamanan & Password",
    app_settings: "Pengaturan",
    notification: "Notifikasi",
    help_info: "Bantuan & Info",
    help_center: "Pusat Bantuan",
    privacy_policy: "Kebijakan Privasi",
    about_cardtoo: "Tentang CardToo",
    logout: "Logout",
    language_saved_note:
      "Preferensi bahasa disimpan di perangkat ini agar tampilan tetap konsisten saat kamu membuka CardToo kembali.",
    home: "Home",
    message: "Pesan",
    collection: "Koleksi",
    profile: "Profil",
    collections: "Koleksi",
    search_collections: "Cari koleksi...",
    add: "Tambah",
    create_new_collection: "Buat Koleksi Baru",
    collection_name_helper: "Beri nama folder untuk mengelompokkan kartu kesayanganmu.",
    collection_name_placeholder: "Nama Koleksi (misal: Pokemon Rare)",
    cancel: "Batal",
    save: "Simpan",
    saving: "Menyimpan...",
    collection_not_found: "Koleksi \"{query}\" tidak ditemukan",
    login_manage_collections: "Login untuk Mengelola Koleksi",
    login_manage_collections_desc:
      "Simpan dan kelompokkan kartu impian Anda ke dalam koleksi pribadi dengan masuk ke akun Anda.",
    messages: "Pesan",
    search_messages_or_store: "Cari pesan atau toko...",
    all: "Semua",
    unread: "Belum Dibaca",
    archive: "Arsip",
    no_messages_found: "Tidak ada pesan ditemukan",
    login_start_chat: "Login untuk Mulai Obrolan",
    login_start_chat_desc:
      "Masuk atau daftar sekarang untuk bernegosiasi harga dan bertanya langsung ke penjual.",
    my_order: "Pesanan Saya",
    order_history: "Riwayat Pesanan",
    unpaid: "Belum bayar",
    packed: "Dikemas",
    shipped: "Dikirim",
    review: "Penilaian",
    my_favorite: "Favorit Saya",
    seller_dashboard: "Dashboard Seller",
    register_as_seller: "Daftar sebagai Seller",
    setting: "Pengaturan",
  },
  en: {
    language: "Language",
    indonesia: "Indonesian",
    english: "English",
    settings: "Settings",
    account_security: "Account & Security",
    edit_profile: "Edit Profile",
    my_address: "My Address",
    bank_card: "Bank Account / Card",
    security_password: "Security & Password",
    app_settings: "Preferences",
    notification: "Notifications",
    help_info: "Help & Info",
    help_center: "Help Center",
    privacy_policy: "Privacy Policy",
    about_cardtoo: "About CardToo",
    logout: "Log out",
    language_saved_note:
      "Your language preference is saved on this device so CardToo stays consistent next time.",
    home: "Home",
    message: "Message",
    collection: "Collection",
    profile: "Profile",
    collections: "Collections",
    search_collections: "Search collections...",
    add: "Add",
    create_new_collection: "Create New Collection",
    collection_name_helper: "Name a folder to group your favorite cards.",
    collection_name_placeholder: "Collection Name (e.g.: Pokemon Rare)",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving...",
    collection_not_found: "Collection \"{query}\" was not found",
    login_manage_collections: "Log in to Manage Collections",
    login_manage_collections_desc:
      "Save and organize your dream cards into personal collections by signing in.",
    messages: "Messages",
    search_messages_or_store: "Search messages or stores...",
    all: "All",
    unread: "Unread",
    archive: "Archive",
    no_messages_found: "No messages found",
    login_start_chat: "Log in to Start Chat",
    login_start_chat_desc:
      "Sign in or register now to negotiate prices and ask sellers directly.",
    my_order: "My Order",
    order_history: "Order History",
    unpaid: "Unpaid",
    packed: "Packed",
    shipped: "Shipped",
    review: "Review",
    my_favorite: "My Favorite",
    seller_dashboard: "Seller Dashboard",
    register_as_seller: "Register as Seller",
    setting: "Setting",
  },
};

/**
 * Struktur objek nilai yang akan dilempar oleh LanguageContext ke seluruh aplikasi.
 */
type LanguageContextValue = {
  /** Bahasa yang saat ini sedang aktif dipilih pengguna */
  language: AppLanguage;
  /** Fungsi untuk mengganti preferensi bahasa */
  setLanguage: (language: AppLanguage) => void;
  /**
   * Fungsi helper untuk menerjemahkan (translate) key bahasa menjadi teks yang sesungguhnya.
   * @param key String identifier dari dictionary (contoh: "home", "logout")
   * @returns Teks yang sudah diterjemahkan berdasarkan bahasa yang aktif
   */
  t: (key: string) => string;
};

// Inisialisasi Context bahasa dengan nilai awal undefined
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/**
 * Komponen pembungkus (Provider) utama untuk fungsionalitas Multi-bahasa (i18n lokal).
 * Akan otomatis membaca dari LocalStorage (jika ada) saat aplikasi pertama dimuat.
 */
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // State untuk menyimpan bahasa aktif. Dibaca pertama kali secara malas (lazy initialization) dari LocalStorage
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    // Jalankan pengecekan window untuk menghindari kegagalan Server-Side Rendering (SSR)
    if (typeof window === "undefined") return "id";
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === "en" || stored === "id" ? stored : "id";
  });

  /**
   * Mengubah status preferensi bahasa aktif saat ini dan menyimpannya secara persisten ke LocalStorage.
   * @param nextLanguage Kode bahasa baru ("id" | "en")
   */
  const setLanguage = (nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    }
  };

  // Menggunakan useMemo agar objek value tidak dimuat ulang secara sia-sia jika state bahasa tidak berubah
  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      // Jika key tidak ditemukan di kamus terjemahan, kembalikan key mentah sebagai fallback
      t: (key: string) => dictionaries[language][key] || key,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

/**
 * Custom hook untuk mengakses nilai bahasa dan fungsi terjemahannya (translate `t()`).
 * Wajib dipanggil dari dalam komponen yang berada di bawah `<LanguageProvider>`.
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
