"use client";
import { useChat } from "../../context/ChatContext";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState } from "react";

export function ClientChat() {
  const {
    connected,
    messages,
    userId,
    chatOpen,
    setChatOpen,
    error,
    sendMessage,
  } = useChat();
  const [message, setMessage] = useState("");
  // const { sendMessage } = useWebSocket(userId, false);

  // Filtra mensajes solo del cliente actual
  // const clientMessages = messages.filter(
  //   (msg) => msg.usuarioId === userId || msg.toUserId === userId
  // );
  const clientMessages = messages.filter(
    (msg) =>
      (msg.usuarioId === userId && msg.toUserId === "admin") ||
      (msg.toUserId === userId && msg.usuarioId.includes("admin"))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !connected) return;

    // sendMessage(message);
    // setMessage("");
    sendMessage(message.trim(), "admin"); // Especificar que el mensaje es para admin
    setMessage("");
  };

  // Si no hay userId, no mostramos el chat
  // if (!userId) return null;

  // Si hay error, mostramos un mensaje amigable
  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">
          {error === "No se encontró token de autenticación"
            ? "Por favor inicia sesión para usar el chat"
            : "Error al conectar con el chat"}
        </p>
      </div>
    );
  }

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
    //ANTES

    // <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-lg">
    //   <div className="p-4 border-b">
    //     <h2 className="text-lg font-semibold">Chat con Soporte</h2>
    //     <div
    //       className={`text-sm ${connected ? "text-green-500" : "text-red-500"}`}
    //     >
    //       {connected ? "Conectado" : "Desconectado"}
    //     </div>
    //   </div>

    //   <MessageList messages={messages} />

    //   <form onSubmit={handleSubmit} className="p-4 border-t">
    //     <div className="flex gap-2">
    //       <input
    //         type="text"
    //         value={message}
    //         onChange={(e) => setMessage(e.target.value)}
    //         placeholder="Escriba su mensaje..."
    //         className="flex-1 p-2 border rounded"
    //         disabled={!connected}
    //       />
    //       <button
    //         type="submit"
    //         disabled={!connected || !message.trim()}
    //         className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
    //       >
    //         Enviar
    //       </button>
    //     </div>
    //   </form>
    // </div>

    // NUEVO
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
      {/* <div className="flex-1 h-96 flex flex-col">
        <MessageList />
        <MessageInput />
      </div> */}
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
