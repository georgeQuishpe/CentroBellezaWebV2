"use client";
import { useChat } from "../../context/ChatContext";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

export function ClientChat() {
  const { connected, messages, userId, chatOpen, setChatOpen } = useChat();

  // Filtrar mensajes relevantes para este cliente
  const filteredMessages = messages.filter(
    (message) =>
      message.usuarioId === userId ||
      message.toUserId === userId ||
      message.usuarioId.startsWith("admin_")
  );

  console.log("Chat Cliente - userId:", userId);
  console.log("Chat Cliente - mensajes filtrados:", filteredMessages);

  if (!chatOpen) {
    return (
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
      {/* Encabezado */}
      <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
        <div>
          <div className="font-medium">Chat de Soporte</div>
          <div className="text-sm flex items-center">
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                connected ? "bg-green-400" : "bg-red-400"
              }`}
            />
            {connected ? "Conectado" : "Desconectado"}
          </div>
        </div>
        <button
          onClick={() => setChatOpen(false)}
          className="text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {/* Área de chat */}
      <div className="flex-1 h-96 flex flex-col">
        <MessageList />
        <MessageInput />
      </div>

      {/* Indicador de estado de conexión */}
      {!connected && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-sm">
          Intentando reconectar...
        </div>
      )}
    </div>
  );
}
