import { useState, useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import { ChatHeader } from "./ChatHeader.jsx";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { XMarkIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

export function ChatWindow() {
  const { chatOpen, setChatOpen, connected } = useChat();
  const chatRef = useRef(null);

  // Cerrar chat al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setChatOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setChatOpen]);

  if (!chatOpen) {
    return (
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors"
      >
        <ChatBubbleLeftIcon className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div
      ref={chatRef}
      className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col"
    >
      <ChatHeader onClose={() => setChatOpen(false)} />
      <MessageList />
      <MessageInput />

      {/* Indicador de conexión */}
      <div
        className={`absolute top-12 right-2 h-2 w-2 rounded-full ${
          connected ? "bg-green-500" : "bg-red-500"
        }`}
      />
    </div>
  );
}
