"use client";

import React from "react";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { BackButton } from "@/components/ui/BackButton";
import { NotificationCard } from "@/components/ui/NotificationCard";
import { motion } from "framer-motion";

const NOTIFICATIONS_DATA = [
  {
    group: "Today",
    items: [
      {
        id: "1",
        title: "Order Confirmed",
        description: "New order confirmed on your shop",
        time: "34mins",
        label: "TIME SENSITIVE",
      },
      {
        id: "2",
        title: "Order Confirmed",
        description: "New order confirmed on your shop",
        time: "34mins",
        label: "TIME SENSITIVE",
      },
    ],
  },
  {
    group: "Yesterday",
    items: [
      {
        id: "3",
        title: "Order Confirmed",
        description: "New order confirmed on your shop",
        time: "34mins",
        label: "TIME SENSITIVE",
      },
      {
        id: "4",
        title: "Order Confirmed",
        description: "New order confirmed on your shop",
        time: "34mins",
        label: "TIME SENSITIVE",
      },
    ],
  },
  {
    group: "1 Week ago",
    items: [
      {
        id: "5",
        title: "Order Confirmed",
        description: "New order confirmed on your shop",
        time: "34mins",
        label: "TIME SENSITIVE",
      },
      {
        id: "6",
        title: "Order Confirmed",
        description: "New order confirmed on your shop",
        time: "34mins",
        label: "TIME SENSITIVE",
      },
    ],
  },
];

export default function NotificationsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-surface-tint to-[#F6DFFF]">
      <StickyHeader 
        title="Notification" 
        variant="minimal"
        size="sm"
        leftAction={<BackButton variant="primary" />} 
      />

      <main className="flex-1 px-6 pt-6 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8"
        >
          {NOTIFICATIONS_DATA.map((group) => (
            <div key={group.group} className="flex flex-col gap-4">
              <h2 className="text-base font-normal text-black ml-1">
                {group.group}
              </h2>
              <div className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <NotificationCard
                      title={item.title}
                      description={item.description}
                      time={item.time}
                      label={item.label}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
