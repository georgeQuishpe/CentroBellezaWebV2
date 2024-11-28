"use client";
import { useState } from "react";
import { useChat } from "../../context/ChatContext";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export function MessageInput() {
  const [message, setMessage] = useState("");
  const { sendMessage, connected, selectedUserId, isAdmin } = useChat();
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !connected || isSending) return;
    if (isAdmin && !selectedUserId) {
      alert("Selecciona un chat primero");
      return;
    }

    try {
      setIsSending(true);
      await sendMessage(message.trim());
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar mensaje");
    } finally {
      setIsSending(false);
    }
  };

  const isDisabled =
    !connected || !message.trim() || (isAdmin && !selectedUserId) || isSending;

  return (
    <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={
          isAdmin && !selectedUserId
            ? "Selecciona un chat"
            : "Escribe un mensaje..."
        }
        className="flex-1 border rounded-lg px-3 py-2 text-black focus:outline-none focus:border-blue-500"
        disabled={!connected || (isAdmin && !selectedUserId)}
      />
      <button
        type="submit"
        disabled={isDisabled}
        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        <PaperAirplaneIcon
          className={`h-5 w-5 ${isSending ? "animate-spin" : ""}`}
        />
      </button>
    </form>
  );
}