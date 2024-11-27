"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

export const useWebSocket = (userId, isAdmin = false) => {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const [activeChats, setActiveChats] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        console.log("Iniciando conexión WebSocket...", { userId, isAdmin });

        socketRef.current = io(SOCKET_SERVER_URL, {
            query: { userId, isAdmin },
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current.on("connect", () => {
            console.log("WebSocket conectado");
            setConnected(true);
        });

        socketRef.current.on("message", (message) => {
            console.log("Mensaje recibido:", message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socketRef.current.on('previousMessages', (previousMessages) => {
            console.log("Mensajes históricos recibidos:", previousMessages);
            if (isAdmin) {
                // Agrupar mensajes por usuario para los chats activos
                const chatsByUser = previousMessages.reduce((acc, msg) => {
                    if (!msg.usuarioId.startsWith('admin_')) {
                        if (!acc[msg.usuarioId]) {
                            acc[msg.usuarioId] = {
                                userId: msg.usuarioId,
                                nombre: `Usuario ${msg.usuarioId}`,
                                lastMessage: msg.mensaje,
                                timestamp: msg.fechaEnvio
                            };
                        } else if (new Date(msg.fechaEnvio) > new Date(acc[msg.usuarioId].timestamp)) {
                            acc[msg.usuarioId].lastMessage = msg.mensaje;
                            acc[msg.usuarioId].timestamp = msg.fechaEnvio;
                        }
                    }
                    return acc;
                }, {});
                setActiveChats(Object.values(chatsByUser));
            }
            setMessages(previousMessages || []);
        });

        socketRef.current.on("disconnect", () => {
            console.log("WebSocket desconectado");
            setConnected(false);
        });

        socketRef.current.on("error", (error) => {
            console.error("Error de WebSocket:", error);
            setError(error.message);
        });

        return () => {
            if (socketRef.current) {
                console.log("Limpiando conexión WebSocket");
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [userId, isAdmin]);

    const sendMessage = (content) => {
        if (!content.trim() || !connected) {
            console.warn("No se puede enviar mensaje - conexión no disponible");
            setError("No hay conexión disponible");
            return;
        }

        const messageData = {
            content,
            userId,
            timestamp: new Date().toISOString(),
        };

        if (isAdmin && selectedUserId) {
            messageData.toUserId = selectedUserId;
        } else if (!isAdmin) {
            messageData.toUserId = 'admin';
        }

        console.log("Enviando mensaje:", messageData);
        socketRef.current.emit("sendMessage", messageData);
    };

    const loadChatMessages = useCallback(async (chatUserId) => {
        if (!chatUserId) return;

        try {
            console.log("Cargando mensajes para usuario:", chatUserId);
            const response = await fetch(`http://localhost:5000/api/v1/chat-messages/${chatUserId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Mensajes cargados:", data);
            setMessages(data);
        } catch (error) {
            console.error("Error al cargar mensajes:", error);
            setMessages([]);
        }
    }, []);



    const selectChat = useCallback(async (newSelectedUserId) => {
        console.log("Seleccionando chat:", newSelectedUserId);
        setSelectedUserId(newSelectedUserId);
        if (isAdmin && newSelectedUserId) {
            await loadChatMessages(newSelectedUserId);
        }
    }, [isAdmin, loadChatMessages]);


    return {
        connected,
        messages,
        sendMessage,
        error,
        activeChats,
        selectedUserId,
        selectChat,
        loadChatMessages // Exportamos la función
    };
};