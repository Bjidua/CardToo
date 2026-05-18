"use client";

import React, { useState } from "react";
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
  const [name, setName] = useState(profile?.full_name || profile?.username || "");
  const [email] = useState(profile?.email || user?.email || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user || !profile) return;

    try {
      setIsSaving(true);
      await profileService.updateProfile(user.id, {
        username: username.trim() || profile.username,
        full_name: name.trim() || null,
        phone: phone.trim() || null,
      });
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
          <div className="relative">
            <ProfilePicture
              src={profile?.avatar_url || undefined}
              size={120}
              className="border-[6px] border-white shadow-soft"
            />
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full border-[3px] border-white shadow-soft flex items-center justify-center text-white">
              <Icons.Plus size={20} />
            </div>
          </div>
          <p className="mt-4 text-[14px] font-bold text-primary">Avatar akan menyusul</p>
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
