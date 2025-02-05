const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');
const axios = require('axios');
const { sequelize } = require('../libs/sequelize.js');

class ChatMessagesService {
    constructor() {
        this.models = models;
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

        return await models.ChatMessage.findAll({
            where: {
                [Op.or]: [
                    { usuarioId: cleanId },
                    { toUserId: cleanId },
                ],
            },
            order: [['fechaEnvio', 'ASC']],
        });
    }

    async create(data) {
        try {
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

            return await models.ChatMessage.create(messageData);
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    async findByUser(userId) {
        if (!userId) return [];

        const cleanId = this.cleanUserId(userId);
        const user = await this.getUserById(cleanId);
        if (!user) return [];

        return await models.ChatMessage.findAll({
            where: {
                [Op.or]: [
                    { usuarioId: cleanId },
                    { toUserId: cleanId }
                ]
            },
            order: [["fechaEnvio", "ASC"]]
        });
    }

    async markAsRead(id) {
        try {
            const message = await models.ChatMessage.findByPk(id);
            if (!message) {
                throw new Error('Mensaje no encontrado');
            }
            return await message.update({ leido: true });
        } catch (error) {
            console.error('Error en markAsRead:', error);
            throw error;
        }
    }

    async findAllChats() {
        try {
            const messages = await sequelize.query(`
                SELECT DISTINCT ON (u.id) 
                    u.id as usuarioid,
                    u.nombre,
                    cm.mensaje,
                    cm.fechaenvio
                FROM usuarios u
                LEFT JOIN chatmensajes cm ON u.id = cm.usuarioid
                WHERE u.rol = 'Cliente'
                ORDER BY u.id, cm.fechaenvio DESC NULLS LAST
            `, {
                type: sequelize.QueryTypes.SELECT
            });

            return messages.map(msg => ({
                userId: msg.usuarioid,
                nombre: msg.nombre || `Usuario ${msg.usuarioid}`,
                lastMessage: msg.mensaje || 'No hay mensajes',
                timestamp: msg.fechaenvio
            }));
        } catch (error) {
            console.error('Error en findAllChats:', error);
            throw error;
        }
    }
}

module.exports = ChatMessagesService;
