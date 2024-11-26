import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000"; // Ajusta esto según tu configuración

export const useWebSocket = (userId) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef();

  useEffect(() => {
    // Crear conexión socket
    socketRef.current = io(SOCKET_SERVER_URL, {
      query: { userId },
    });
    
    // Conexión establecida
    socketRef.current.on("connect", () => {
      setConnected(true);
      console.log("Conectado al servidor de chat");
    });

    // Recibir mensajes
    socketRef.current.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cargar historial de mensajes
    socketRef.current.on("previousMessages", (previousMessages) => {
      setMessages(previousMessages);
    });

    // Manejar desconexión
    socketRef.current.on("disconnect", () => {
      setConnected(false);
      console.log("Desconectado del servidor de chat");
    });

    // Cleanup al desmontar
    return () => {
      socketRef.current.disconnect();
    };
  }, [userId]);

  // Función para enviar mensajes
  const sendMessage = (content) => {
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        content,
        userId,
        timestamp: new Date(),
      });
    }
  };

  return {
    connected,
    messages,
    sendMessage,
  };
};
