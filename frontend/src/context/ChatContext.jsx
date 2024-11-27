"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const ChatContext = createContext({
  messages: [],
  activeChats: [],
  connected: false,
  sendMessage: () => {},
  selectChat: () => {},
  selectedUserId: null,
  chatOpen: false,
  setChatOpen: () => {},
  isAdmin: false,
});

export function ChatProvider({ children, userId, isAdmin = false }) {
  const {
    connected,
    messages,
    sendMessage,
    error,
    activeChats,
    selectedUserId,
    selectChat,
    loadChatMessages, // Asegúrate de obtenerlo del useWebSocket
  } = useWebSocket(userId, isAdmin);

  const value = {
    connected,
    messages,
    sendMessage,
    error,
    activeChats,
    selectedUserId,
    selectChat,
    loadChatMessages,  // Inclúyelo en el value
    userId,
    isAdmin
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
