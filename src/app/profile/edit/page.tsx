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

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <EditProfileContent />
    </ProtectedRoute>
  );
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialName);
  const [username, setUsername] = useState(initialUsername);
  const [phone, setPhone] = useState(initialPhone);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const displayedAvatar = useMemo(
    () => avatarPreview || initialAvatarUrl || null,
    [avatarPreview, initialAvatarUrl]
  );

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await profileService.updateProfileWithAvatar(
        userId,
        {
          username: username.trim() || fallbackUsername,
          full_name: name.trim() || null,
          phone: phone.trim() || null,
        },
        avatarFile
      );
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
      setAvatarPreview(null);
      setAvatarFile(null);
      await refreshAuth();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-accent-soft">
      <StickyHeader
        title="Edit Profile"
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />}
      />

      <main className="flex-1 px-6 pt-10 pb-32">
        <div className="flex flex-col items-center mb-10">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              setAvatarFile(file);
              setAvatarPreview((current) => {
                if (current?.startsWith("blob:")) {
                  URL.revokeObjectURL(current);
                }
                return file ? URL.createObjectURL(file) : null;
              });
            }}
          />
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
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full border-[3px] border-white shadow-soft flex items-center justify-center text-white">
              <Icons.Plus size={20} />
            </div>
          </button>
          <p className="mt-4 text-[14px] font-bold text-primary">
            {avatarFile ? "Avatar siap disimpan" : "Unggah atau ganti avatar"}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@username"
          />
          <Input
            label="Email Address"
            value={email}
            placeholder="example@mail.com"
            type="email"
            disabled
            className="opacity-70"
          />
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xxxxxxxx"
          />

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
