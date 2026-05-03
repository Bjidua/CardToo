"use client";

import React from "react";
import { MessageCard } from "@/components/ui/MessageCard";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MessagesPage() {
  const dummyMessages = [
    { id: 1, name: "User1", msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", time: "5 min", unread: 1 },
    { id: 2, name: "User2", msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", time: "12 min", unread: 1 },
    { id: 3, name: "User3", msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", time: "1 hour", unread: 0 },
    { id: 4, name: "CardMaster99", msg: "Ready for trade? I have the Pikachu VMAX you're looking for!", time: "2 hours", unread: 3 },
    { id: 5, name: "User4", msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", time: "Yesterday", unread: 0 },
    { id: 6, name: "User5", msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", time: "Yesterday", unread: 0 },
    { id: 7, name: "CollectorX", msg: "Is the Charizard still available?", time: "2 days ago", unread: 0 },
    { id: 8, name: "TrainerRed", msg: "Good game!", time: "3 days ago", unread: 0 },
    { id: 9, name: "PokeFan", msg: "Nice collection!", time: "4 days ago", unread: 0 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  } as const;

  return (
    <main className="flex-1 flex flex-col min-h-screen relative pb-40">
      
      {/* FIXED GRADIENT BACKGROUND - Supaya tetap konsisten saat scroll */}
      <div className="fixed inset-0 bg-linear-to-b from-white to-[#F6DFFF] z-0 pointer-events-none" />

      {/* STICKY HEADER AREA */}
      <div className="sticky top-0 z-40 w-full h-[140px] flex items-end justify-center pb-4 overflow-hidden">
        {/* Background Logo inside Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-[-45%] left-[-12%] w-[110%] h-[150%] pointer-events-none z-0"
        >
          <Image 
            src="/assets/BackgroundLogo.svg" 
            alt="Header Background" 
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Premium Blur Background */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md border-b border-black/5 pointer-events-none z-[-1]" />
        
        {/* Bottom Fade Mask */}
        <div className="absolute bottom-[-60px] left-0 right-0 h-[60px] bg-linear-to-b from-white/30 to-transparent pointer-events-none" />

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative z-10 text-[24px] font-bold text-black tracking-tight"
        >
          Messages
        </motion.h1>
      </div>


      {/* Message List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-20 flex flex-col items-center gap-4 px-6 pt-6"
      >
        {dummyMessages.map((chat) => (
          <motion.div key={chat.id} variants={itemVariants} className="w-full flex justify-center">
            <MessageCard
              userName={chat.name}
              message={chat.msg}
              time={chat.time}
              unreadCount={chat.unread}
            />
          </motion.div>
        ))}
      </motion.div>

    </main>
  );
}
