import { useState } from "react";
import { ChatProvider } from "../context/ChatContext";
import { ChatWindow } from "../components/Chat/ChatWindow";

export function ChatTest() {
  const [userId] = useState("1701234567"); // ID de usuario de prueba

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Prueba del Chat</h1>

      <div className="bg-white rounded-lg p-4 shadow mb-4">
        <p>Usuario ID: {userId}</p>
      </div>

      <ChatProvider userId={userId}>
        <ChatWindow />
      </ChatProvider>
    </div>
  );
}
