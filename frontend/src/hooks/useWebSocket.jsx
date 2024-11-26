import { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

export const useWebSocket = (userId) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  // Inicialización del socket
  useEffect(() => {
    console.log("Iniciando conexión WebSocket...");

    socketRef.current = io(SOCKET_SERVER_URL, {
      query: { userId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Manejadores de eventos
    socketRef.current.on("connect", () => {
      console.log("WebSocket conectado");
      setConnected(true);
      setError(null);
    });

    socketRef.current.on("message", (message) => {
      console.log("Mensaje recibido:", message);
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("previousMessages", (previousMessages) => {
      console.log("Mensajes previos:", previousMessages);
      setMessages(previousMessages || []);
    });

    socketRef.current.on("disconnect", () => {
      console.log("WebSocket desconectado");
      setConnected(false);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Error de conexión:", err);
      setError("Error de conexión");
      setConnected(false);
    });

    // Limpieza
    return () => {
      console.log("Limpiando conexión WebSocket");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId]); // Solo depende de userId

  // Función para enviar mensajes
  const sendMessage = useCallback(
    (content) => {
      if (socketRef.current && connected) {
        socketRef.current.emit("sendMessage", {
          content,
          userId,
          timestamp: new Date(),
        });
      }
    },
    [connected, userId]
  );

  return {
    connected,
    messages,
    sendMessage,
    error,
  };
};
