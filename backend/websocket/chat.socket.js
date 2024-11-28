const ChatMessagesService = require('../services/chatMessages.service.js');
const service = new ChatMessagesService();

module.exports = (io) => {
    const connectedUsers = new Map();
    const adminSockets = new Set();

    io.on('connection', async (socket) => {
        const userId = socket.handshake.query.userId;
        const isAdmin = socket.handshake.query.isAdmin === 'true';

        if (!userId) {
            console.error('Error: userId no está definido en la conexión WebSocket.');
            socket.emit('error', 'userId no válido.');
            return;
        }

        // Guardar el socket del usuario conectado
        connectedUsers.set(userId, socket.id);
        if (isAdmin) {
            adminSockets.add(socket.id);
        }

        try {
            // Cargar mensajes previos para el usuario conectado
            const messages = await service.findByUser(userId);
            socket.emit('previousMessages', messages);
        } catch (error) {
            console.error('Error al cargar mensajes:', error.message);
        }

        // Manejar el evento de recibir un mensaje nuevo
        socket.on('sendMessage', async (messageData) => {
            if (!messageData.userId || !messageData.content) {
                throw new Error('userId y content son requeridos');
            }

            try {
                const newMessage = await service.create({
                    usuarioId: messageData.userId,
                    mensaje: messageData.content,
                    toUserId: 'admin', // Asegúrate que siempre tenga este valor para mensajes de cliente
                    fechaEnvio: new Date()
                });

                socket.emit('message', newMessage);
                // Notificar a los admins
                adminSockets.forEach(adminSocketId => {
                    io.to(adminSocketId).emit('message', newMessage);
                });
            } catch (error) {
                console.error('Error:', error);
                socket.emit('error', { message: error.message });
            }
        });

        // Manejar la desconexión del usuario
        socket.on('disconnect', () => {
            console.log(`Usuario con ID ${userId} desconectado`);
            connectedUsers.delete(userId);
            if (isAdmin) {
                adminSockets.delete(socket.id);
            }
        });
    });
};
