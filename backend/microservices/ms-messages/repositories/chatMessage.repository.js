const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');
const { sequelize } = require('../libs/sequelize.js');

class ChatMessageRepository {
    async findByUser(userId) {
        return await models.ChatMessage.findAll({
            where: {
                [Op.or]: [{ usuarioId: userId }, { toUserId: userId }]
            },
            order: [['fechaEnvio', 'ASC']]
        });
    }

    async create(messageData) {
        return await models.ChatMessage.create(messageData);
    }

    async findById(id) {
        return await models.ChatMessage.findByPk(id);
    }

    async markAsRead(id) {
        const message = await models.ChatMessage.findByPk(id);
        if (!message) throw new Error('Mensaje no encontrado');
        return await message.update({ leido: true });
    }

    async findAllChats() {
        // const messages = await sequelize.query(`
        //     SELECT DISTINCT ON (u.id) 
        //         u.id as usuarioid, u.nombre, cm.mensaje, cm.fechaenvio
        //     FROM usuarios u
        //     LEFT JOIN chatmensajes cm ON u.id = cm.usuarioid
        //     WHERE u.rol = 'Cliente'
        //     ORDER BY u.id, cm.fechaenvio DESC NULLS LAST
        // `, { type: sequelize.QueryTypes.SELECT });

        // return messages.map(msg => ({
        //     userId: msg.usuarioid,
        //     nombre: msg.nombre || `Usuario ${msg.usuarioid}`,
        //     lastMessage: msg.mensaje || 'No hay mensajes',
        //     timestamp: msg.fechaenvio
        // }));

        // const messages = await models.sequelize.query(`
        //     SELECT DISTINCT ON (u.id) 
        //         u.id as usuarioid,
        //         u.nombre,
        //         cm.mensaje,
        //         cm.fechaenvio
        //     FROM usuarios u
        //     LEFT JOIN chatmensajes cm ON u.id = cm.usuarioid
        //     WHERE u.rol = 'Cliente'
        //     ORDER BY u.id, cm.fechaenvio DESC NULLS LAST
        // `, { type: models.sequelize.QueryTypes.SELECT });

        // return messages.map(msg => ({
        //     userId: msg.usuarioid,
        //     nombre: msg.nombre || `Usuario ${msg.usuarioid}`,
        //     lastMessage: msg.mensaje || 'No hay mensajes',
        //     timestamp: msg.fechaenvio
        // }));


        // const result = await models.ChatMessage.sequelize.query(`
        //     SELECT DISTINCT ON (cm.usuarioid) 
        //         cm.usuarioid,
        //         cm.mensaje,
        //         cm.fechaenvio
        //     FROM chatmensajes cm
        //     ORDER BY cm.usuarioid, cm.fechaenvio DESC
        // `, { type: models.ChatMessage.sequelize.QueryTypes.SELECT });

        // return result.map(msg => ({
        //     userId: msg.usuarioid,
        //     lastMessage: msg.mensaje || 'No hay mensajes',
        //     timestamp: msg.fechaenvio
        // }));

        // const result = await models.ChatMessage.sequelize.query(`
        //     SELECT DISTINCT ON (cm.usuarioid) 
        //         cm.usuarioid as "userId",
        //         cm.mensaje as "lastMessage",
        //         cm.fechaenvio as "timestamp"
        //     FROM chatmensajes cm
        //     WHERE cm.touserid = 'admin'
        //     ORDER BY cm.usuarioid, cm.fechaenvio DESC
        // `, {
        //     type: models.ChatMessage.sequelize.QueryTypes.SELECT
        // });

        // return result.map(chat => ({
        //     userId: chat.userId,
        //     lastMessage: chat.lastMessage || 'No hay mensajes',
        //     timestamp: chat.timestamp
        // }));

        const result = await models.ChatMessage.sequelize.query(`
            SELECT DISTINCT ON (cm.usuarioid) 
                cm.usuarioid as "userId",
                cm.mensaje as "lastMessage",
                cm.fechaenvio as "timestamp"
            FROM chatmensajes cm
            WHERE cm.touserid = 'admin' OR cm.usuarioid = 'admin'
            ORDER BY cm.usuarioid, cm.fechaenvio DESC
        `, {
            type: models.ChatMessage.sequelize.QueryTypes.SELECT
        });

        console.log('Chats encontrados:', result);

        return result.map(chat => ({
            userId: chat.userId,
            lastMessage: chat.lastMessage || 'No hay mensajes',
            timestamp: chat.timestamp
        }));
    }
}

module.exports = ChatMessageRepository;
