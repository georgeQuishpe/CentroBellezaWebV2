"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5004";

export const useWebSocket = (userId, isAdmin = false) => {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const [activeChats, setActiveChats] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const socketRef = useRef(null);
    const isMounted = useRef(true); // Bandera para evitar actualizaciones después del desmontaje

    useEffect(() => {
        // Limpiar cualquier conexión existente
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        // Inicializar el socket
        socketRef.current = io(SOCKET_SERVER_URL, {
            path: '/ms-messages/socket.io',
            query: { userId, isAdmin },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
            forceNew: true,
            autoConnect: true
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
            setMessages(previousMessages || []);
        });

        socketRef.current.on("disconnect", () => {
            console.log("WebSocket desconectado");
            setConnected(false);
        });

        socketRef.current.on("connect_error", (err) => {
            console.error("Error de conexión:", err.message);
            console.log("Error de conexión detallado:", {
                error: err,
                message: err.message,
                description: err.description,
                context: err.context
            });
            setError(err.message);
        });

        socketRef.current.on("activeChats", (chats) => {
            if (isAdmin) {
                console.log("Chats activos recibidos:", chats);
                setActiveChats(chats || []);
            }
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
    // En useWebSocket.js (frontend)
    const sendMessage = (content) => {
        if (!content.trim() || !connected || (isAdmin && !selectedUserId)) return;

        const messageData = {
            content,
            userId,
            toUserId: isAdmin ? selectedUserId : 'admin'
        };

        socketRef.current.emit('sendMessage', messageData);
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
    const selectChat = useCallback(async (newSelectedUserId) => {
        setSelectedUserId(newSelectedUserId);
        if (isAdmin && newSelectedUserId) {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/chat-messages/${newSelectedUserId}`);
                const messages = await response.json();
                setMessages(messages);
            } catch (error) {
                console.error('Error cargando mensajes:', error);
            }
        }
    }, [isAdmin]);

    return {
        connected,
        messages,
        sendMessage,
        error,
        activeChats,
        selectedUserId,
        selectChat,
        loadChatMessages,
        socket: socketRef.current
    };
};