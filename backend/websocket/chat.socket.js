const ChatMessagesService = require('../services/chatMessages.service');
const service = new ChatMessagesService();

module.exports = (io) => {
    const connectedUsers = new Map();
    const adminSockets = new Set();

    io.on('connection', async (socket) => {
        const userId = socket.handshake.query.userId;
        console.log(`Usuario conectado: ${userId}`);

        // Guardar la conexión y verificar si es admin
        connectedUsers.set(userId, socket.id);
        const isAdmin = userId.startsWith('admin_');
        if (isAdmin) {
            adminSockets.add(socket.id);
            console.log('Admin conectado:', socket.id);
        }

        console.log("Usuarios conectados:", Array.from(connectedUsers.keys()));
        console.log("Admins conectados:", Array.from(adminSockets));

        // Cargar mensajes anteriores
        try {
            const messages = await service.find(); // Cargar todos los mensajes para admin
            console.log('Cargando mensajes previos:', messages);
            socket.emit('previousMessages', messages);
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
            socket.emit('previousMessages', []);
        }

        // Manejar mensajes nuevos
        socket.on("sendMessage", async (data) => {
            const { content, userId, toUserId } = data;

            try {
                // Guardar el mensaje en la base de datos
                const savedMessage = await service.create({
                    usuarioId: userId,
                    mensaje: content,
                    leido: false,
                    fechaEnvio: new Date(),
                });

                // Si el mensaje proviene de un admin, envíalo al cliente correspondiente
                if (userId.startsWith("admin_") && toUserId) {
                    const clientSocketId = connectedUsers.get(toUserId);
                    if (clientSocketId) {
                        io.to(clientSocketId).emit("message", savedMessage);
                    } else {
                        console.error("Cliente no conectado:", toUserId);
                    }
                }

                // Si el mensaje proviene de un cliente, notifícalo a todos los admins
                if (!userId.startsWith("admin_")) {
                    adminSockets.forEach((adminSocketId) => {
                        io.to(adminSocketId).emit("message", savedMessage);
                    });
                }

                // Enviar confirmación al remitente
                socket.emit("message", savedMessage);
            } catch (error) {
                console.error("Error al enviar mensaje:", error);
                socket.emit("error", { message: "Error al procesar el mensaje" });
            }
        });

        // Manejar desconexión
        socket.on('disconnect', () => {
            console.log(`Usuario desconectado: ${userId}`);
            if (isAdmin) {
                adminSockets.delete(socket.id);
                console.log('Admin desconectado:', socket.id);
            }
            connectedUsers.delete(userId);
            console.log('Usuarios conectados:', connectedUsers.size);
            console.log('Admins conectados:', adminSockets.size);
        });

        // Manejar errores
        socket.on('error', (error) => {
            console.error('Error de socket:', error);
        });
    });
};