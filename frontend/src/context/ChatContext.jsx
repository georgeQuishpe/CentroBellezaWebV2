import { createContext, useContext, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const ChatContext = createContext();

export function ChatProvider({ children, userId }) {
  const { connected, messages, sendMessage } = useWebSocket(userId);
  const [chatOpen, setChatOpen] = useState(false);

  const value = {
    connected,
    messages,
    sendMessage,
    chatOpen,
    setChatOpen,
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
