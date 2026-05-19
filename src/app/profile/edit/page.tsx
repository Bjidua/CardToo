"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProfilePicture } from "@/components/ui/ProfilePicture";
import { Icons } from "@/components/ui/Icons";
import { useAuth } from "@/context/AuthContext";
import { profileService } from "@/lib/services/profile";

/**
 * Halaman Sunting Profil / Edit Profile (EditProfilePage)
 * Dibungkus dengan ProtectedRoute untuk mencegah akses langsung oleh user tamu (guest).
 */
export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <EditProfileContent />
    </ProtectedRoute>
  );
}

/**
 * Komponen Konten Edit Profile (EditProfileContent)
 * Membaca user & profile saat ini dari AuthContext global.
 * Menampilkan loading spinner jika status authentikasi belum siap di-load.
 */
function EditProfileContent() {
  const { user, profile, refreshAuth } = useAuth();
  
  if (!user || !profile) {
    return (
      <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
        <StickyHeader
          title="Edit Profile"
          variant="minimal"
          size="sm"
          leftAction={<BackButton variant="primary" />}
        />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
      </div>
    );
  }

  // Memberi state key unik agar form me-reset ulang jika data profil diperbarui di sesi lain
  return (
    <EditProfileForm
      key={`${profile.id}:${profile.username}:${profile.avatar_url ?? ""}:${profile.full_name ?? ""}:${profile.phone ?? ""}`}
      userId={user.id}
      email={profile.email || user.email}
      initialName={profile.full_name || profile.username || ""}
      initialUsername={profile.username}
      initialPhone={profile.phone || ""}
      initialAvatarUrl={profile.avatar_url || null}
      fallbackUsername={profile.username}
      refreshAuth={refreshAuth}
    />
  );
}

/**
 * Form Interaktif Edit Profile (EditProfileForm)
 * Menyediakan pengeditan nama lengkap, nama pengguna (username), nomor telepon,
 * serta pemilihan berkas gambar lokal untuk dijadikan foto profil baru (avatar).
 */
function EditProfileForm({
  userId,
  email,
  initialName,
  initialUsername,
  initialPhone,
  initialAvatarUrl,
  fallbackUsername,
  refreshAuth,
}: {
  userId: string;
  email: string;
  initialName: string;
  initialUsername: string;
  initialPhone: string;
  initialAvatarUrl: string | null;
  fallbackUsername: string;
  refreshAuth: () => Promise<void>;
}) {
  // Referensi DOM ke input berkas tipe hidden
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State lokal input nama lengkap
  const [name, setName] = useState(initialName);
  
  // State lokal input username
  const [username, setUsername] = useState(initialUsername);
  
  // State lokal input HP
  const [phone, setPhone] = useState(initialPhone);
  
  // State penyimpanan file gambar biner mentah (File) yang dipilih user
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // State preview lokal URL gambar (blob) sebelum diunggah ke server
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // State status loading saat menyimpan perubahan ke database
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Pembersihan memori (Cleanup Effect)
   * Menghapus URL objek sementara (blob) yang dibuat di browser saat component unmount
   * atau saat preview avatar berubah guna mencegah memory leak.
   */
  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // Menentukan gambar avatar yang akan ditampilkan di UI (prioritaskan preview blob lokal lalu URL database)
  const displayedAvatar = useMemo(
    () => avatarPreview || initialAvatarUrl || null,
    [avatarPreview, initialAvatarUrl]
  );

  /**
   * Menyimpan data pengeditan profil beserta file avatar ke database Appwrite.
   * Setelah sukses, memanggil refreshAuth agar data otentikasi global terupdate.
   */
  const handleSave = async () => {
    try {
      setIsSaving(true); // Kunci tombol simpan
      
      // Kirim request update profil + file avatar ke backend service
      await profileService.updateProfileWithAvatar(
        userId,
        {
          username: username.trim() || fallbackUsername,
          full_name: name.trim() || null,
          phone: phone.trim() || null,
        },
        avatarFile
      );
      
      // Bebaskan URL objek sementara
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
      setAvatarPreview(null);
      setAvatarFile(null);
      
      // Sinkronisasi data sesi global di context
      await refreshAuth();
    } finally {
      setIsSaving(false); // Matikan loading tombol
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      {/* Header Halaman */}
      <StickyHeader
        title="Edit Profile"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-10 pb-32">
        {/* Form Pilihan Foto Profil / Avatar */}
        <div className="flex flex-col items-center mb-10">
          {/* Input file disembunyikan secara visual dari layar */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              setAvatarFile(file);
              
              // Buat preview URL blob lokal di browser
              setAvatarPreview((current) => {
                if (current?.startsWith("blob:")) {
                  URL.revokeObjectURL(current);
                }
                return file ? URL.createObjectURL(file) : null;
              });
            }}
          />
          {/* Bulatan Tombol Preview Foto Profil */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative active:scale-95 transition-transform"
          >
            <ProfilePicture
              src={displayedAvatar || undefined}
              size={120}
              className="border-[6px] border-white shadow-soft"
            />
            {/* Ikon plus melayang di atas avatar */}
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full border-[3px] border-white shadow-soft flex items-center justify-center text-white">
              <Icons.Plus size={20} />
            </div>
          </button>
          <p className="mt-4 text-[14px] font-bold text-primary">
            {avatarFile ? "Avatar siap disimpan" : "Unggah atau ganti avatar"}
          </p>
        </div>

        {/* Input Data Teks dengan Efek Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Input nama lengkap */}
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          {/* Input username */}
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@username"
          />
          {/* Input email dinonaktifkan (karena merupakan kredensial login utama) */}
          <Input
            label="Email Address"
            value={email}
            placeholder="example@mail.com"
            type="email"
            disabled
            className="opacity-70"
          />
          {/* Input nomor telepon */}
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xxxxxxxx"
          />

          {/* Tombol Simpan */}
          <div className="pt-6">
            <Button onClick={() => void handleSave()} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
