"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatClient from "@/components/chat/ChatClient";

function MessagesRoomContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId") || "";
  const sellerId = searchParams.get("sellerId") || "";
  const storeId = searchParams.get("storeId") || "";

  return (
    <ChatClient
      conversationId={conversationId || undefined}
      sellerId={sellerId || undefined}
      storeId={storeId || undefined}
    />
  );
}

export default function MessagesRoomPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <MessagesRoomContent />
    </Suspense>
  );
}
