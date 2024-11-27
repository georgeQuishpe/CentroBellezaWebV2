"use client";
import { useState } from "react";
import { useChat } from "../../context/ChatContext";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

export function ChatWindow() {
  // Usar estado local en lugar del contexto para el control del chat
  const [isOpen, setIsOpen] = useState(false);
  const { connected } = useChat();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600"
      >
        Chat de Soporte
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col">
      <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
        <h3 className="font-semibold">Chat de Soporte</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="px-4 py-2 bg-gray-50 border-b flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            connected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-sm text-gray-600">
          {connected ? "Conectado" : "Desconectado"}
        </span>
      </div>

      <MessageList />
      <MessageInput />
    </div>
  );
}
