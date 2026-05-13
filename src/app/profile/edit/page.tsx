"use client";

import React, { useState } from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProfilePicture } from "@/components/ui/ProfilePicture";
import { Icons } from "@/components/ui/Icons";
import { motion } from "framer-motion";

export default function EditProfilePage() {
  const [name, setName] = useState("CanTika");
  const [email, setEmail] = useState("cantika33@gmail.com");
  const [username, setUsername] = useState("cantika_tcg");
  const [phone, setPhone] = useState("08123456789");

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
            <ProfilePicture size={120} className="border-[6px] border-white shadow-soft" />
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full border-[3px] border-white shadow-soft flex items-center justify-center text-white active:scale-90 transition-all">
              <Icons.Plus size={20} />
            </button>
          </div>
          <p className="mt-4 text-[14px] font-bold text-primary">Change Avatar</p>
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
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="example@mail.com"
            type="email"
          />
          <Input 
            label="Phone Number" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="08xxxxxxxx"
          />

          <div className="pt-6">
            <Button onClick={() => console.log("Saved")}>
              Save Changes
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
