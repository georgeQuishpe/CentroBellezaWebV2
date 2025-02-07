const axios = require('axios');
const ChatMessageRepository = require('../repositories/chatMessage.repository');

class ChatMessagesService {
    constructor() {
        this.repository = new ChatMessageRepository();
    }

    cleanUserId(userId) {
        return typeof userId === 'string' ? userId.replace('admin_', '') : userId;
    }

    async getUserById(userId) {
        try {
            const response = await axios.get(`http://host.docker.internal:5001/api/v1/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener el usuario:', error.message);
            return null;
        }
    }

    async verifyUserExists(userId) {
        const cleanId = this.cleanUserId(userId);
        const user = await this.getUserById(cleanId);
        return !!user;
    }

    async find(userId) {
        if (!userId) return [];
        const cleanId = this.cleanUserId(userId);
        const user = await this.getUserById(cleanId);
        if (!user) return [];
        return await this.repository.findByUser(cleanId);
    }

    async create(data) {
        const messageData = {
            usuarioId: this.cleanUserId(data.usuarioId),
            mensaje: data.mensaje,
            toUserId: data.toUserId ? this.cleanUserId(data.toUserId) : null,
            fechaEnvio: data.fechaEnvio || new Date(),
            leido: false
        };

        const [senderExists, recipientExists] = await Promise.all([
            this.verifyUserExists(messageData.usuarioId),
            messageData.toUserId ? this.verifyUserExists(messageData.toUserId) : Promise.resolve(true)
        ]);

        if (!senderExists || (messageData.toUserId && !recipientExists)) {
            throw new Error(`Usuario no encontrado`);
        }

        return await this.repository.create(messageData);
    }

    async markAsRead(id) {
        return await this.repository.markAsRead(id);
    }

    async findAllChats() {
        return await this.repository.findAllChats();
    }
}

module.exports = ChatMessagesService;
