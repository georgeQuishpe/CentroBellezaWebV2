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
    const isMounted = useRef(true); // Bandera para evitar actualizaciones después del desmontaje

    useEffect(() => {
        // Inicializar el socket
        socketRef.current = io(SOCKET_SERVER_URL, {
            query: { userId, isAdmin },
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
        });

        // Listeners del socket
        socketRef.current.on("connect", () => {
            console.log("WebSocket conectado con ID:", socketRef.current.id);
            setConnected(true);
            setError(null);
        });

        socketRef.current.on("message", (message) => {
            console.log("Mensaje recibido:", message);
            setMessages((prev) => [...prev, message]);
        });

        socketRef.current.on("previousMessages", (previousMessages) => {
            console.log("Mensajes históricos recibidos:", previousMessages);
            if (isAdmin && Array.isArray(previousMessages)) {
                // Agrupar mensajes por usuario
                const chatsByUser = previousMessages.reduce((acc, msg) => {
                    if (!msg.usuarioId.startsWith('admin_')) {
                        if (!acc[msg.usuarioId]) {
                            acc[msg.usuarioId] = {
                                userId: msg.usuarioId,
                                nombre: `Usuario ${msg.usuarioId}`,
                                lastMessage: msg.mensaje,
                                timestamp: msg.fechaEnvio
                            };
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

        socketRef.current.on("connect_error", (err) => {
            console.error("Error de conexión:", err.message);
            setError(err.message);
        });

        // Cleanup al desmontar
        return () => {
            console.log("Desconectando WebSocket...");
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [userId, isAdmin]);


    // Función para enviar mensajes
    const sendMessage = (content) => {
        if (!content.trim() || !connected) return;

        const messageData = {
            content,
            userId,
            timestamp: new Date().toISOString()
        };

        if (isAdmin) {
            if (!selectedUserId) {
                console.warn("Debe seleccionar un usuario para enviar mensaje");
                return;
            }
            messageData.toUserId = selectedUserId;
        } else {
            messageData.toUserId = "admin";
        }

        console.log("Enviando mensaje:", messageData);
        socketRef.current.emit("sendMessage", messageData);
    };


    // Función para cargar mensajes de un chat específico
    const loadChatMessages = useCallback(async (chatUserId) => {
        if (!chatUserId) return;

        try {
            console.log("Cargando mensajes para usuario:", chatUserId);
            const response = await fetch(
                `http://localhost:5000/api/v1/chat-messages/${chatUserId}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Mensajes cargados:", data);
            if (isMounted.current) {
                setMessages(data);
            }
        } catch (err) {
            console.error("Error al cargar mensajes:", err);
            if (isMounted.current) {
                setMessages([]);
            }
        }
    }, []);

    // Función para seleccionar un chat
    const selectChat = useCallback(
        async (newSelectedUserId) => {
            console.log("Seleccionando chat:", newSelectedUserId);
            setSelectedUserId(newSelectedUserId);
            if (isAdmin && newSelectedUserId) {
                await loadChatMessages(newSelectedUserId);
            }
        },
        [isAdmin, loadChatMessages]
    );

    return {
        connected,
        messages,
        sendMessage,
        error,
        activeChats,
        selectedUserId,
        selectChat,
        loadChatMessages,
    };
};
