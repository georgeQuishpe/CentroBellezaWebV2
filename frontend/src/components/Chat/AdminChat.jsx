"use client";
import { useState, useEffect } from "react";
import { useChat } from "../../context/ChatContext";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

export function AdminChat() {
  const {
    activeChats,
    selectChat,
    selectedUserId,
    messages,
    connected,
    userId,
    isAdmin, // Agregar aquí
  } = useChat();

  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChatSelect = async (chatUserId) => {
    selectChat(chatUserId);
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/chat-messages?userId=${chatUserId}`
      );
      const chatMessages = await response.json();
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Agrupar mensajes por usuario y contar no leídos
  useEffect(() => {
    const counts = messages.reduce((acc, message) => {
      if (!message.leido && message.usuarioId !== userId) {
        acc[message.usuarioId] = (acc[message.usuarioId] || 0) + 1;
      }
      return acc;
    }, {});
    setUnreadCounts(counts);
  }, [messages, userId]);

  // Filtrar los chats activos según el término de búsqueda
  const filteredChats = activeChats?.filter((chat) =>
    chat.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar mensajes para el chat seleccionado
  const filteredMessages = isAdmin
    ? messages.filter(
        (msg) =>
          msg.usuarioId === selectedUserId || msg.toUserId === selectedUserId
      )
    : messages;

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Lista de chats */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Buscar chat..."
            className="w-full p-2 rounded-lg border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {filteredChats?.map((chat) => (
            <div
              key={chat.userId}
              onClick={() => handleChatSelect(chat.userId)}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${
                selectedUserId === chat.userId ? "bg-blue-50" : ""
              }`}
            >
              <div className="font-medium">{chat.userId}</div>
              <div className="text-sm text-gray-500">{chat.lastMessage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 flex flex-col">
        {selectedUserId ? (
          <>
            <div className="p-4 border-b bg-white">
              <div className="font-medium">Chat con {selectedUserId}</div>
              <div className="text-sm text-gray-500">
                {connected ? "En línea" : "Desconectado"}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <MessageList />
            </div>
            <MessageInput />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Selecciona un chat para comenzar
          </div>
        )}
      </div>
    </div>
  );
}
