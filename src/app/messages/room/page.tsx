"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatClient from "@/components/chat/ChatClient";

/**
 * Komponen Konten Ruang Obrolan (MessagesRoomContent)
 * Mengambil parameter query URL untuk inisialisasi percakapan chat.
 * Parameter yang didukung:
 * - `conversationId`: ID percakapan aktif yang sudah ada
 * - `sellerId`: ID pengguna penjual untuk memulai percakapan baru
 * - `storeId`: ID toko untuk memuat informasi context nama toko penjual
 */
function MessagesRoomContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId") || "";
  const sellerId = searchParams.get("sellerId") || "";
  const storeId = searchParams.get("storeId") || "";

  // Merender component ChatClient utama yang berisi logic realtime messaging
  return (
    <ChatClient
      conversationId={conversationId || undefined}
      sellerId={sellerId || undefined}
      storeId={storeId || undefined}
    />
  );
}

/**
 * Halaman Ruang Obrolan / Chat Room (MessagesRoomPage)
 * Mengamankan pemrosesan asinkron useSearchParams dengan React Suspense.
 */
export default function MessagesRoomPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-surface-tint" />}>
      <MessagesRoomContent />
    </Suspense>
  );
}
