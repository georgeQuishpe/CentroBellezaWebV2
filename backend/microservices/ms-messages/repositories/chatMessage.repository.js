const ChatMessage = require('../models/chatMessage.model');
const { Op } = require('sequelize');
const { sequelize } = require('../libs/sequelize');

class ChatMessageRepository {
    async findByUser(userId) {
        return await ChatMessage.findAll({
            where: {
                [Op.or]: [{ usuarioId: userId }, { toUserId: userId }]
            },
            order: [['fechaEnvio', 'ASC']]
        });
    }

    async create(messageData) {
        return await ChatMessage.create(messageData);
    }

    async findById(id) {
        return await ChatMessage.findByPk(id);
    }

    async markAsRead(id) {
        const message = await ChatMessage.findByPk(id);
        if (!message) throw new Error('Mensaje no encontrado');
        return await message.update({ leido: true });
    }

    async findAllChats() {
        const messages = await sequelize.query(`
            SELECT DISTINCT ON (u.id) 
                u.id as usuarioid, u.nombre, cm.mensaje, cm.fechaenvio
            FROM usuarios u
            LEFT JOIN chatmensajes cm ON u.id = cm.usuarioid
            WHERE u.rol = 'Cliente'
            ORDER BY u.id, cm.fechaenvio DESC NULLS LAST
        `, { type: sequelize.QueryTypes.SELECT });

        return messages.map(msg => ({
            userId: msg.usuarioid,
            nombre: msg.nombre || `Usuario ${msg.usuarioid}`,
            lastMessage: msg.mensaje || 'No hay mensajes',
            timestamp: msg.fechaenvio
        }));
    }
}

module.exports = ChatMessageRepository;
