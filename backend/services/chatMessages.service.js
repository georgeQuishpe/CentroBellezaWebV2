const { models } = require('../libs/sequelize');
const { Op } = require('sequelize'); // Asegúrate de importar 

class ChatMessagesService {
    constructor() { }

    async find() {
        const messages = await models.ChatMessage.findAll({
            order: [['fechaEnvio', 'ASC']]
        });
        return messages;
    }
    async findByUser(userId) {
        try {
            console.log('Buscando mensajes para usuario:', userId);
            const messages = await models.ChatMessage.findAll({
                where: {
                    [Op.or]: [
                        { usuarioId: userId },
                        { toUserId: userId } // Asegúrate de que `toUserId` existe en tu esquema
                    ]
                },
                order: [['fechaEnvio', 'ASC']],
                raw: true // Esto devuelve objetos JSON planos
            });
            console.log('Mensajes encontrados:', messages.length);
            return messages;
        } catch (error) {
            console.error('Error en findByUser:', error);
            throw error;
        }
    }

    async create(data) {
        const newMessage = await models.ChatMessage.create(data);
        return newMessage;
    }

    async markAsRead(id) {
        const message = await models.ChatMessage.findByPk(id);
        if (!message) {
            throw new Error('Mensaje no encontrado');
        }
        return await message.update({ leido: true });
    }
}

module.exports = ChatMessagesService;