import { useState, useEffect } from "react";
import { ChatProvider } from "../context/ChatContext";
import { ChatWindow } from "../components/Chat/ChatWindow";

export function AdminChat() {
  const [activeChats, setActiveChats] = useState([]);
  const adminId = "admin_1";

  useEffect(() => {
    // Simular carga de chats activos
    setActiveChats([
      { userId: "1701234567", name: "Ana Garcia" },
      { userId: "1702345678", name: "Luis Fernandez" },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Chat - Administrador</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lista de chats activos */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">Chats Activos</h2>
          <div className="space-y-2">
            {activeChats.map((chat) => (
              <div
                key={chat.userId}
                className="p-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                <p className="font-medium">{chat.name}</p>
                <p className="text-sm text-gray-500">ID: {chat.userId}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ventana de chat */}
        <div className="relative h-[600px]">
          <ChatProvider userId={adminId}>
            <ChatWindow />
          </ChatProvider>
        </div>
      </div>
    </div>
  );
}
