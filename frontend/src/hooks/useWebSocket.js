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

        // let token;

        if (!userId) {
            console.log('No hay userId disponible');
            return;
        }
        // Obtener el token del localStorage
        // const userData = localStorage.getItem('user');
        // const token = userData ? JSON.parse(userData).token : null;

        // if (!token) {
        //     console.error('No hay token disponible');
        //     return;
        // }


        // try {
        //     const userData = localStorage.getItem('user');
        //     if (!userData) {
        //         throw new Error('No hay datos de usuario');
        //     }
        //     const parsedData = JSON.parse(userData);
        //     token = parsedData.token;

        //     if (!token) {
        //         throw new Error('No hay token disponible');
        //     }
        // } catch (error) {
        //     console.error('Error al obtener el token:', error);
        //     setError('Error de autenticación: ' + error.message);
        //     return;
        // }

        const initializeSocket = () => {
            try {
                // Obtener token del localStorage
                const userData = localStorage.getItem('user');
                // const token = userData ? JSON.parse(userData).token : null;

                if (!userData) {
                    console.log('Esperando datos de usuario...');
                    return; // Salir silenciosamente sin error
                }

                // if (!token) {
                //     console.error('No hay token disponible');
                //     setError('Error de autenticación: Token no disponible');
                //     throw new Error('No hay token disponible');

                //     return;

                // }

                const parsedData = JSON.parse(userData);
                if (!parsedData.token) {
                    console.log('Esperando token...');
                    return; // Salir silenciosamente sin error
                }

                if (socketRef.current) {
                    socketRef.current.disconnect();
                }

                const socketConfig = {
                    // path: '/ms-messages/socket.io',
                    path: '/socket.io', // Changed from /ms-messages/socket.io

                    query: {
                        userId: isAdmin ? `admin_${userId}` : userId,
                        isAdmin: isAdmin.toString()
                    },
                    // auth: { token }, // Siempre incluir el token
                    auth: { token: parsedData.token },

                    transports: ['websocket', 'polling'],
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    timeout: 10000,
                    forceNew: true,
                    autoConnect: true
                };

                socketRef.current = io(SOCKET_SERVER_URL, socketConfig);

                // Event listeners...
                socketRef.current.on("connect", () => {
                    console.log("WebSocket conectado con ID:", socketRef.current.id);
                    setConnected(true);
                    setError(null);
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

            } catch (error) {
                console.error('Error al inicializar socket:', error);
                setError('Error de inicialización: ' + error.message);
            }

            // if (socketRef.current) {
            //     socketRef.current.disconnect();
            // }

            // const socketConfig = {
            //     path: '/ms-messages/socket.io',
            //     query: {
            //         userId: isAdmin ? `admin_${userId}` : userId,
            //         isAdmin: isAdmin.toString()
            //     },
            //     transports: ['websocket', 'polling'],
            //     reconnection: true,
            //     reconnectionAttempts: 5,
            //     reconnectionDelay: 1000,
            //     timeout: 10000,
            //     forceNew: true,
            //     autoConnect: true
            // };

            // Solo agregar auth si hay token
            // if (token) {
            //     socketConfig.auth = { token };
            // }

            // socketRef.current = io(SOCKET_SERVER_URL, socketConfig);

            // ... resto de los event listeners ...


        };


        // Limpiar cualquier conexión existente
        // if (socketRef.current) {
        //     socketRef.current.disconnect();
        // }

        // Inicializar el socket
        // socketRef.current = io(SOCKET_SERVER_URL, {
        //     path: '/ms-messages/socket.io',
        //     // query: { userId, isAdmin },
        //     query: {
        //         userId: isAdmin ? `admin_${userId}` : userId,
        //         isAdmin: isAdmin.toString()
        //     },
        //     auth: { token }, // Añadir el token aquí

        //     transports: ['websocket', 'polling'],
        //     reconnection: true,
        //     reconnectionAttempts: 5,
        //     reconnectionDelay: 1000,
        //     timeout: 10000,
        //     forceNew: true,
        //     autoConnect: true
        // });



        // try {
        //     const userData = localStorage.getItem('user');
        //     if (userData) {
        //         const parsedData = JSON.parse(userData);
        //         if (parsedData.token) {
        //             initializeSocket(parsedData.token);
        //         } else {
        //             initializeSocket();
        //         }
        //     } else {
        //         // Iniciar sin autenticación
        //         initializeSocket();
        //     }
        // } catch (error) {
        //     console.error('Error al obtener el token:', error);
        //     setError('Error de autenticación: ' + error.message);

        // }


        //     // Intentar conectar sin autenticación
        //     initializeSocket();


        // try {
        //     const userData = localStorage.getItem('user');
        //     if (!userData) {
        //         throw new Error('No hay datos de usuario');
        //     }
        //     const parsedData = JSON.parse(userData);
        //     if (!parsedData.token) {
        //         throw new Error('No hay token disponible');
        //     }
        //     initializeSocket(parsedData.token);
        // } catch (error) {
        //     console.error('Error al obtener el token:', error);
        //     setError('Error de autenticación: ' + error.message);
        // }

        // Intentar inicializar
        initializeSocket();

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