"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { io } from 'socket.io-client';
import { jwtDecode } from "jwt-decode"; // Corregir la importación


const SOCKET_SERVER_URL = "http://localhost:5004";

export const useWebSocket = (initialUserId = null, isAdmin = false) => {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const [activeChats, setActiveChats] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userId, setUserId] = useState(initialUserId);
    const socketRef = useRef(null);
    const isMounted = useRef(true); // Bandera para evitar actualizaciones después del desmontaje
    // const jwt = require('jsonwebtoken');


    useEffect(() => {
        const token = localStorage.getItem('token');

        // Si no hay userId, no intentamos conectar
        // if (!userId) {
        //     console.error('No se proporcionó userId');
        //     setError('No hay usuario autenticado');
        //     return;
        // }


        if (!token) {
            setError('No se encontró token de autenticación');
            return;
        }

        if (!userId) {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setUserId(decoded.sub);
                } catch (error) {
                    console.error("Error decodificando token:", error);
                    setError('Error al obtener la identificación del usuario');
                    return;
                }
            } else {
                setError('No hay usuario autenticado');
                return;
            }
        }



        // const decoded = jwt_decode(token);
        // console.log('Token decodificado:', decoded);

        // Si estamos en la página de login, no mostramos error por falta de token
        // if (!token && window.location.pathname !== '/login') {
        //     console.error('No se encontró token de autenticación');
        //     setError('No se encontró token de autenticación');
        //     return;
        // }


        const refreshToken = async () => {
            try {
                const currentToken = localStorage.getItem('token');
                if (!currentToken) {
                    throw new Error('No hay token disponible');
                }

                const response = await fetch('http://localhost:5001/api/v1/auth/refresh-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentToken}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al renovar el token');
                }

                const data = await response.json();
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    return data.token;
                }
                throw new Error('No se recibió un nuevo token');
            } catch (error) {
                console.error('Error renovando token:', error);
                return null;
            }
        };


        const connectSocket = async () => {
            try {


                if (!token) {
                    setError('No se encontró token de autenticación');
                    return;
                }


                if (socketRef.current) {
                    socketRef.current.disconnect();
                }


                // Verificar si el token está expirado
                const decoded = jwtDecode(token); // Usar la función importada

                const isActuallyAdmin = decoded.rol === 'Admin';


                const currentTime = Date.now() / 1000;
                console.log('Token decodificado:', decoded);


                // Si el token está próximo a expirar o ya expiró, intentar renovarlo
                if (decoded.exp - currentTime < 300) { // 5 minutos antes de expirar
                    const newToken = await refreshToken();
                    if (!newToken) {
                        setError('Sesión expirada. Por favor, vuelva a iniciar sesión.');
                        return;
                    }
                }


                console.log('Token info:', {
                    exp: decoded.exp,
                    now: Date.now() / 1000,
                    timeLeft: decoded.exp - (Date.now() / 1000)
                });

                // Limpiar cualquier conexión existente
                // if (socketRef.current) {
                //     socketRef.current.disconnect();
                // }

                if (userId) {

                    // Inicializar el socket
                    // socketRef.current = io(SOCKET_SERVER_URL, {
                    //     path: '/ms-messages/socket.io',
                    //     // query: { userId, isAdmin },
                    //     query: {
                    //         userId: decoded.sub, // Usar el ID del token
                    //         isAdmin
                    //     },
                    //     auth: token ? { token } : undefined,
                    //     transports: ['websocket', 'polling'],
                    //     reconnection: true,
                    //     reconnectionAttempts: 5,
                    //     reconnectionDelay: 1000,
                    //     timeout: 10000
                    //     // forceNew: true,
                    //     // autoConnect: true
                    // });

                    // socketRef.current = io(SOCKET_SERVER_URL, {
                    //     path: '/ms-messages/socket.io',
                    //     query: {
                    //         userId: isAdmin ? `admin_${decoded.sub}` : decoded.sub,
                    //         isAdmin: isAdmin.toString()
                    //     },
                    //     auth: { token },
                    //     transports: ['websocket', 'polling'],
                    //     reconnection: true,
                    //     reconnectionAttempts: 5,
                    //     reconnectionDelay: 1000,
                    //     reconnectionDelayMax: 5000,
                    //     timeout: 10000,
                    //     forceNew: true
                    // });


                    // socketRef.current = io(SOCKET_SERVER_URL, {
                    //     path: '/ms-messages/socket.io',
                    //     query: {
                    //         userId: `admin_${decoded.sub}`,
                    //         isAdmin: 'true' // Asegurarse de que sea string
                    //     },
                    //     auth: { token },
                    //     transports: ['websocket', 'polling'],
                    //     reconnection: true
                    // });

                    socketRef.current = io(SOCKET_SERVER_URL, {
                        path: '/ms-messages/socket.io',
                        query: {
                            userId: isActuallyAdmin ? `admin_${decoded.sub}` : decoded.sub,
                            isAdmin: isActuallyAdmin.toString()
                        },
                        auth: { token }
                    });

                    // Listeners del socket
                    socketRef.current.on("connect", () => {
                        console.log("WebSocket conectado con ID:", socketRef.current.id);
                        setConnected(true);
                        setError(null);
                    });

                    // socketRef.current.on("message", (message) => {
                    //     console.log("Mensaje recibido:", message);
                    //     setMessages((prev) => [...prev, message]);
                    // });

                    socketRef.current.on('messages', (receivedMessages) => {
                        console.log('Mensajes recibidos:', receivedMessages);
                        setMessages(receivedMessages);
                    });

                    socketRef.current.on('message', (message) => {
                        console.log('Nuevo mensaje:', message);
                        setMessages((prevMessages) => [...prevMessages, message]);
                    });

                    // socketRef.current.on("previousMessages", (previousMessages) => {
                    //     console.log("Mensajes históricos recibidos:", previousMessages);
                    //     setMessages(previousMessages || []);
                    // });
                    socketRef.current.on("previousMessages", (previousMessages) => {
                        console.log("Mensajes históricos recibidos:", previousMessages);
                        setMessages(previousMessages || []);
                        if (isAdmin) {
                            // Para admin, necesitamos extraer los chats únicos
                            const uniqueChats = [...new Set(previousMessages.map(msg =>
                                msg.usuarioId === userId ? msg.toUserId : msg.usuarioId
                            ))].map(chatUserId => ({
                                userId: chatUserId,
                                lastMessage: previousMessages.find(msg =>
                                    msg.usuarioId === chatUserId || msg.toUserId === chatUserId
                                )?.mensaje || 'No hay mensajes'
                            }));
                            setActiveChats(uniqueChats);
                        }
                    });

                    socketRef.current.on("disconnect", () => {
                        console.log("WebSocket desconectado");
                        setConnected(false);
                    });

                    // socketRef.current.on("connect_error", (err) => {
                    //     console.error("Error de conexión:", err.message);
                    //     console.log("Error de conexión detallado:", {
                    //         error: err,
                    //         message: err.message,
                    //         description: err.description,
                    //         context: err.context
                    //     });
                    //     setError(err.message);
                    //     setConnected(false);
                    // });

                    socketRef.current.on('connect_error', (error) => {
                        console.error('Error de conexión:', error.message);
                        setError(error.message);
                        setConnected(false);
                    });

                    // socketRef.current.on("activeChats", (chats) => {
                    //     if (isAdmin) {
                    //         console.log("Chats activos recibidos:", chats);
                    //         setActiveChats(chats || []);
                    //     }
                    // });
                    socketRef.current.on('activeChats', (chats) => {
                        console.log('Chats activos recibidos:', chats);
                        // setActiveChats(chats || []);
                        if (isActuallyAdmin) {  // Agregar esta condición
                            setActiveChats(chats);  // Esto debería actualizar activeChats
                        }
                    });

                    // Cleanup al desmontar
                    return () => {
                        if (socketRef.current) {
                            console.log('Desconectando WebSocket...');
                            socketRef.current.disconnect();
                        }
                    };
                };
            } catch (err) {
                console.error('Error al inicializar WebSocket:', err);
                setError(err.message);
            }
        };

        connectSocket();


        // Configurar un intervalo para verificar y renovar el token
        const tokenCheckInterval = setInterval(async () => {
            const currentToken = localStorage.getItem('token');
            if (currentToken) {
                const decoded = jwtDecode(currentToken);
                const currentTime = Date.now() / 1000;

                if (decoded.exp - currentTime < 300) {
                    await refreshToken();
                }
            }
        }, 240000); // Verificar cada 4 minutos

        return () => {
            clearInterval(tokenCheckInterval);
            if (socketRef.current) {
                console.log('Desconectando WebSocket...');
                socketRef.current.disconnect();
            }
        };
    }, [userId, isAdmin]);



    // Función para enviar mensajes
    // En useWebSocket.js (frontend)
    // const sendMessage = (content) => {
    //     if (!content.trim() || !connected || (isAdmin && !selectedUserId)) return;

    //     const messageData = {
    //         content,
    //         userId,
    //         toUserId: isAdmin ? selectedUserId : 'admin'
    //     };

    //     socketRef.current.emit('sendMessage', messageData);
    // };

    const sendMessage = (content, toUserId = 'admin') => {
        console.log('Enviando mensaje:', { content, userId, toUserId });

        if (!socketRef.current?.connected) {
            console.error('No hay conexión con el servidor');
            return;
        }

        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);

        const messageData = {
            content,
            userId: userId,
            toUserId
        };

        socketRef.current.emit('sendMessage', messageData); // Cambiado de 'message' a 'sendMessage'

    };


    // Función para cargar mensajes de un chat específico
    const loadChatMessages = useCallback(async (chatUserId) => {
        if (!chatUserId) return;

        try {
            console.log("Cargando mensajes para usuario:", chatUserId);
            const response = await fetch(
                `http://localhost:5004/api/v1/chat-messages/${chatUserId}`
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
                const response = await fetch(`http://localhost:5004/api/v1/chat-messages/${newSelectedUserId}`);
                const messages = await response.json();
                setMessages(messages);
            } catch (error) {
                console.error('Error cargando mensajes:', error);
            }
        }
    }, [isAdmin]);

    // return {
    //     connected,
    //     messages,
    //     sendMessage,
    //     error,
    //     activeChats,
    //     selectedUserId,
    //     selectChat,
    //     loadChatMessages,
    //     socket: socketRef.current
    // };

    return {
        // messages,
        // sendMessage,
        // connected,
        // error
        messages,
        sendMessage,
        connected,
        error,
        activeChats,
        selectedUserId,
        selectChat,
        loadChatMessages
    };
};