"use client";
import { useState } from "react";
import { useChat } from "../../context/ChatContext";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export function MessageInput() {
  const [message, setMessage] = useState("");
  const { sendMessage, connected } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && connected) {
      sendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
        disabled={!connected}
      />
      <button
        type="submit"
        disabled={!connected || !message.trim()}
        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        <PaperAirplaneIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
