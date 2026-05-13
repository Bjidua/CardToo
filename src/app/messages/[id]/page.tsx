import React from "react";
import ChatClient from "@/components/chat/ChatClient";

const DUMMY_CHATS = [
  { id: "placeholder", name: "User" }
];

export function generateStaticParams() {
  return DUMMY_CHATS.map((chat) => ({
    id: chat.id,
  }));
}

export default async function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const chatInfo = DUMMY_CHATS.find(c => c.id === resolvedParams.id) || { name: "Unknown User" };
  
  return <ChatClient id={resolvedParams.id} name={chatInfo.name} />;
}
