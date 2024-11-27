'use client'
import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

const SOCKET_SERVER_URL = 'http://https://peluqueriawebapi.onrender.com:5000'

export const useWebSocket = (userId) => {
    const [messages, setMessages] = useState([])
    const [connected, setConnected] = useState(false)
    const [error, setError] = useState(null)
    const socketRef = useRef(null)

    useEffect(() => {
        console.log('Iniciando conexión WebSocket...')

        socketRef.current = io(SOCKET_SERVER_URL, {
            query: { userId },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        })

        socketRef.current.on('connect', () => {
            console.log('WebSocket conectado')
            setConnected(true)
            setError(null)
        })

        socketRef.current.on('message', (message) => {
            console.log('Mensaje recibido:', message)
            setMessages(prev => [...prev, message])
        })

        socketRef.current.on('previousMessages', (previousMessages) => {
            console.log('Mensajes previos:', previousMessages)
            setMessages(previousMessages || [])
        })

        socketRef.current.on('disconnect', () => {
            console.log('WebSocket desconectado')
            setConnected(false)
        })

        socketRef.current.on('connect_error', (err) => {
            console.error('Error de conexión:', err)
            setError('Error de conexión')
            setConnected(false)
        })

        return () => {
            if (socketRef.current) {
                console.log('Limpiando conexión WebSocket')
                socketRef.current.disconnect()
                socketRef.current = null
            }
        }
    }, [userId])

    const sendMessage = (content) => {
        if (socketRef.current && connected) {
            socketRef.current.emit('sendMessage', {
                content,
                userId,
                timestamp: new Date(),
            })
        }
    }

    return {
        connected,
        messages,
        sendMessage,
        error
    }
}