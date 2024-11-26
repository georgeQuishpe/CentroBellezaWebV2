// backend/websocket/chat.socket.js
const ChatMessagesService = require('../services/chatMessages.service');
const service = new ChatMessagesService();

module.exports = (io) => {
    // Almacenar usuarios conectados
    const connectedUsers = new Map();

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        console.log(`Usuario conectado: ${userId}`);

        // Almacenar la conexión del usuario
        connectedUsers.set(userId, socket.id);

        // Cargar mensajes anteriores
        service.findByUser(userId)
            .then(messages => {
                socket.emit('previousMessages', messages);
            })
            .catch(error => {
                console.error('Error al cargar mensajes:', error);
            });

        // Manejar mensajes nuevos
        socket.on('sendMessage', async (messageData) => {
            try {
                // Guardar mensaje en la base de datos
                const savedMessage = await service.create({
                    usuarioId: messageData.userId,
                    mensaje: messageData.content,
                    leido: false
                });

                // Emitir mensaje a todos los administradores conectados
                const admins = Array.from(connectedUsers.entries())
                    .filter(([userId]) => userId.startsWith('admin'));

                admins.forEach(([_, socketId]) => {
                    io.to(socketId).emit('message', {
                        ...savedMessage.dataValues,
                        isAdmin: false
                    });
                });

                // Confirmar recepción al remitente
                socket.emit('message', {
                    ...savedMessage.dataValues,
                    isAdmin: false
                });

            } catch (error) {
                console.error('Error al guardar mensaje:', error);
                socket.emit('error', { message: 'Error al enviar mensaje' });
            }
        });

        // Manejar mensajes de admin
        socket.on('adminMessage', async (messageData) => {
            try {
                const savedMessage = await service.create({
                    usuarioId: 'admin',
                    mensaje: messageData.content,
                    leido: false
                });

                // Enviar al usuario específico
                const userSocketId = connectedUsers.get(messageData.toUserId);
                if (userSocketId) {
                    io.to(userSocketId).emit('message', {
                        ...savedMessage.dataValues,
                        isAdmin: true
                    });
                }

                // Confirmar al admin
                socket.emit('message', {
                    ...savedMessage.dataValues,
                    isAdmin: true
                });

            } catch (error) {
                console.error('Error al enviar mensaje de admin:', error);
                socket.emit('error', { message: 'Error al enviar mensaje' });
            }
        });

        // Manejar desconexión
        socket.on('disconnect', () => {
            console.log(`Usuario desconectado: ${userId}`);
            connectedUsers.delete(userId);
        });
    });
};