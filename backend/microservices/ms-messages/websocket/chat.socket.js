const ChatMessagesService = require('../services/chatMessages.service.js');
const service = new ChatMessagesService();

module.exports = (io) => {
    const connectedUsers = new Map();
    const adminSockets = new Set();

    setInterval(() => {
        console.log('Usuarios conectados:', connectedUsers.size);
        console.log('Admins conectados:', adminSockets.size);
    }, 30000);

    io.on('connection', async (socket) => {
        const userId = socket.handshake.query.userId;
        const isAdmin = socket.handshake.query.isAdmin === 'true';

        console.log(`Nueva conexión - Usuario ID: ${userId}, Admin: ${isAdmin}`);

        if (!userId) {
            console.log('Conexión rechazada: userId no válido');
            socket.emit('error', 'userId no válido.');
            return;
        }

        // Extraer el ID real para administradores
        const actualUserId = isAdmin ? userId.replace('admin_', '') : userId;

        if (connectedUsers.has(userId)) {
            console.log(`Reconexión del usuario ${userId}`);
            const oldSocketId = connectedUsers.get(userId);
            io.sockets.sockets.get(oldSocketId)?.disconnect();
        }

        connectedUsers.set(userId, socket.id);
        if (isAdmin) {
            adminSockets.add(socket.id);
            try {
                const chats = await service.findAllChats();
                socket.emit('activeChats', chats);
                console.log(`Chats enviados al admin ${actualUserId}`);
            } catch (error) {
                console.error('Error al cargar chats:', error);
                socket.emit('error', 'Error al cargar chats activos');
            }
        }

        try {
            const messages = await service.findByUser(actualUserId);
            socket.emit('previousMessages', messages);
            console.log(`Mensajes previos enviados al usuario ${actualUserId}`);
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
        }

        socket.on('sendMessage', async (messageData) => {
            try {
                console.log('Mensaje recibido:', messageData);

                // Si el mensaje es para un admin, buscar un admin en la base de datos
                let actualToUserId = messageData.toUserId;
                if (messageData.toUserId === 'admin') {
                    const adminUser = await service.findAdminUser(); // Necesitamos añadir este método
                    if (!adminUser) {
                        throw new Error('No se encontró un administrador disponible');
                    }
                    actualToUserId = adminUser.id;
                }

                const newMessage = await service.create({
                    usuarioId: messageData.userId,
                    mensaje: messageData.content,
                    toUserId: actualToUserId,
                    fechaEnvio: new Date()
                });

                // Notificar al remitente
                socket.emit('message', newMessage);
                console.log(`Mensaje enviado al remitente ${messageData.userId}`);

                // Notificar al destinatario
                if (isAdmin) {
                    const clientSocket = connectedUsers.get(messageData.toUserId);
                    if (clientSocket) {
                        io.to(clientSocket).emit('message', newMessage);
                        console.log(`Mensaje enviado al cliente ${messageData.toUserId}`);
                    }
                } else {
                    // Notificar a todos los admins
                    Array.from(adminSockets).forEach(adminSocketId => {
                        io.to(adminSocketId).emit('message', newMessage);
                    });
                    console.log('Mensaje enviado a todos los admins');
                }
            } catch (error) {
                console.error('Error al enviar mensaje:', error);
                socket.emit('error', { message: error.message });
            }
        });

        socket.on('disconnect', () => {
            console.log(`Desconexión - Usuario ID: ${userId}, Admin: ${isAdmin}`);
            connectedUsers.delete(userId);
            if (isAdmin) {
                adminSockets.delete(socket.id);
            }
        });

        socket.on('error', (error) => {
            console.error(`Error en socket ${socket.id}:`, error);
        });
    });
};