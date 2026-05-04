import React from "react";
import ChatClient from "@/components/chat/ChatClient";

const DUMMY_CHATS = [
  { id: "1", name: "User1" },
  { id: "2", name: "User2" },
  { id: "3", name: "User3" },
  { id: "4", name: "CardMaster99" },
  { id: "5", name: "User4" },
  { id: "6", name: "User5" },
  { id: "7", name: "CollectorX" },
];

export function generateStaticParams() {
  return DUMMY_CHATS.map((chat) => ({
    id: chat.id,
  }));
}

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  const chatInfo = DUMMY_CHATS.find(c => c.id === params.id) || { name: "Unknown User" };
  
  return <ChatClient id={params.id} name={chatInfo.name} />;
}
