import React from "react";
import ChatClient from "@/components/chat/ChatClient";

const DUMMY_CHATS: { id: string; name: string }[] = [];

export function generateStaticParams() {
  return DUMMY_CHATS.map((chat) => ({
    id: chat.id,
  }));
}

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  const chatInfo = DUMMY_CHATS.find(c => c.id === params.id) || { name: "Unknown User" };
  
  return <ChatClient id={params.id} name={chatInfo.name} />;
}
