const { models } = require('../libs/sequelize');
const { Op } = require('sequelize'); // Asegúrate de importar 
const { User } = require('../db/models/users.model'); // Importa el modelo User

class ChatMessagesService {
    constructor() {
        // Si necesitas acceder a los modelos en el constructor
        this.models = models;
    }

    async find(userId) {
        try {
            if (!userId) {
                throw new Error('El userId es undefined o null. No se puede realizar la búsqueda.');
            }

            const messages = await models.ChatMessage.findAll({
                where: {
                    [Op.or]: [
                        { usuarioId: userId },
                        { toUserId: userId },
                    ],
                },
                order: [['fechaEnvio', 'ASC']],
                include: [
                    {
                        model: User,
                        as: 'remitente',
                        attributes: ['id', 'nombre', 'email'],
                    },
                    {
                        model: User,
                        as: 'destinatario',
                        attributes: ['id', 'nombre', 'email'],
                    },
                ],
            });

            console.log('Mensajes encontrados:', messages.length);
            return messages;
        } catch (error) {
            console.error('Error en find:', error.message);
            throw error;
        }
    }



    async findByUser(userId) {
        try {
            const messages = await models.ChatMessage.findAll({
                where: {
                    [Op.or]: [
                        { usuarioId: userId },
                        { toUserId: userId }
                    ]
                },
                order: [['fechaEnvio', 'ASC']]
            });
            return messages;
        } catch (error) {
            console.error('Error en findByUser:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            return await models.ChatMessage.create(data);
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
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
}

module.exports = ChatMessagesService;