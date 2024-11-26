import { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

export function ChatWindow() {
  const { chatOpen, setChatOpen, connected } = useChat();
  const chatRef = useRef(null);

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
      className="fixed bottom-4 right-4 w-80 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col"
    >
      <ChatHeader onClose={() => setChatOpen(false)} />

      {/* Indicador de estado */}
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
