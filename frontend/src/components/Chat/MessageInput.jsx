"use client";
import { useState } from "react";
import { useChat } from "../../context/ChatContext";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export function MessageInput() {
  const [message, setMessage] = useState("");
  const { sendMessage, connected, selectedUserId, isAdmin } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !connected) return;

    if (isAdmin && !selectedUserId) {
      alert("Por favor selecciona un chat primero");
      return;
    }

    try {
      await sendMessage(message.trim());
      setMessage("");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={
          isAdmin && !selectedUserId
            ? "Selecciona un chat para enviar mensajes"
            : "Escribe un mensaje..."
        }
        className="flex-1 border rounded-lg px-3 py-2 text-black focus:outline-none focus:border-blue-500"
        disabled={!connected || (isAdmin && !selectedUserId)}
      />
      <button
        type="submit"
        disabled={!connected || !message.trim() || (isAdmin && !selectedUserId)}
        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        title={
          !connected
            ? "No hay conexión"
            : isAdmin && !selectedUserId
            ? "Selecciona un chat"
            : "Enviar mensaje"
        }
      >
        <PaperAirplaneIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
