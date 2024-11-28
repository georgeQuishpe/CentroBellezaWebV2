"use client";
import { createContext, useContext } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const ChatContext = createContext(null);

export function ChatProvider({ children, userId, isAdmin = false }) {
  const {
    connected,
    messages,
    sendMessage,
    error,
    activeChats,
    selectedUserId,
    selectChat,
    loadChatMessages,
  } = useWebSocket(userId, isAdmin);

  const value = {
    connected,
    messages,
    sendMessage,
    error,
    activeChats,
    selectedUserId,
    selectChat,
    loadChatMessages,
    userId,
    isAdmin,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat debe usarse dentro de un ChatProvider");
  }
  return context;
}