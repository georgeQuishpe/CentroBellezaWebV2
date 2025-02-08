"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const ChatContext = createContext(null);

// export function ChatProvider({ children, userId, isAdmin = false }) {
export function ChatProvider({ children }) {
  const [userId, setUserId] = useState(null);

  // const {
  //     connected,
  //     messages,
  //     sendMessage,
  //     error,
  //     activeChats,
  //     selectedUserId,
  //     selectChat,
  //     loadChatMessages,
  //   } = useWebSocket(userId, isAdmin);

  //   const value = {
  //     connected,
  //     messages,
  //     sendMessage,
  //     error,
  //     activeChats,
  //     selectedUserId,
  //     selectChat,
  //     loadChatMessages,
  //     userId,
  //     isAdmin,
  //   };

  // Obtener el userId del localStorage cuando el componente se monta
  useEffect(() => {
    const getUserIdFromToken = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            return decoded.sub;
          } catch (error) {
            console.error("Error decodificando token:", error);
            return null;
          }
        }
      }
      return null;
    };

    const id = getUserIdFromToken();
    setUserId(id);
  }, []);

  // Obtener el userId del localStorage si está disponible
  //   const getUserId = () => {
  //     if (typeof window !== 'undefined') {
  //         const token = localStorage.getItem('token');
  //         if (token) {
  //             try {
  //                 const decoded = JSON.parse(atob(token.split('.')[1]));
  //                 return decoded.sub;
  //             } catch (error) {
  //                 console.error('Error decodificando token:', error);
  //                 return null;
  //             }
  //         }
  //     }
  //     return null;
  // };

  // const userId = getUserId();
  const { messages, sendMessage, connected, error } = useWebSocket(userId);

  // return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        connected,
        error,
        userId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat debe usarse dentro de un ChatProvider");
  }
  return context;
}
