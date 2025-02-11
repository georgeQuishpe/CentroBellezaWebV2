"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { jwtDecode } from "jwt-decode"; // Corregir la importación

const ChatContext = createContext(null);

// export function ChatProvider({ children, userId, isAdmin = false }) {
export function ChatProvider({
  children,
  userId: initialUserId,
  isAdmin = false,
}) {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Move useWebSocket hook to top level
  // const { messages, sendMessage, connected, error } = useWebSocket(userId);
  const {
    messages,
    sendMessage,
    connected,
    error,
    activeChats, // Agregar esto
    selectedUserId, // Agregar esto
    selectChat, // Agregar esto
    // } = useWebSocket(userId);
  } = useWebSocket(userId, isAdmin);
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
    // const getUserIdFromToken = () => {
    //   if (typeof window !== "undefined") {
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //       try {
    //         // const decoded = JSON.parse(atob(token.split(".")[1]));
    //         const decoded = jwtDecode(token);
    //         return decoded.sub;
    //       } catch (error) {
    //         console.error("Error decodificando token:", error);
    //         return null;
    //       }
    //     }
    //   }
    //   return null;
    // };

    // const id = getUserIdFromToken();
    // setUserId(id);

    if (!userId) {
      const getUserIdFromToken = () => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const decoded = jwtDecode(token);
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
    }

    // if (id) {
    //   const { messages, sendMessage, connected, error } = useWebSocket(id);
    //   setContextValue({
    //     userId: id,
    //     messages,
    //     sendMessage,
    //     connected,
    //     error,
    //   });
    // }

    setLoading(false);
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

  if (loading) {
    return null; // o un componente de carga
  }

  const contextValue = {
    userId,
    messages,
    sendMessage,
    connected,
    error,
    activeChats, // Agregar esto
    selectedUserId, // Agregar esto
    selectChat, // Agregar esto
    // isAdmin: true, // Agregar esto para el AdminChat
    isAdmin, // Usar el valor de la prop en lugar de hardcodearlo
  };

  // const userId = getUserId();

  // return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
  return (
    <ChatContext.Provider
      value={
        // messages,
        // sendMessage,
        // connected,
        // error,
        // userId,
        contextValue
      }
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
