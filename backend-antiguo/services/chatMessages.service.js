const { models } = require('../libs/sequelize');
const { Op } = require('sequelize'); // Asegúrate de importar 
const { User } = require('../db/models/users.model'); // Importa el modelo User
const { sequelize } = require('../libs/sequelize.js');


class ChatMessagesService {
    constructor() {
        // Si necesitas acceder a los modelos en el constructor
        this.models = models;
    }

    cleanUserId(userId) {
        return typeof userId === 'string' ? userId.replace('admin_', '') : userId;
    }

    async verifyUserExists(userId) {
        const cleanId = this.cleanUserId(userId);
        const user = await models.User.findByPk(cleanId);
        return !!user;
    }


    async find(userId) {
        if (!userId) return [];

        const cleanId = this.cleanUserId(userId);

        return await models.ChatMessage.findAll({
            where: {
                [Op.or]: [
                    { usuarioId: cleanId },
                    { toUserId: cleanId },
                ],
            },
            order: [['fechaEnvio', 'ASC']],
            include: [
                {
                    model: models.User,
                    as: 'remitente',
                    attributes: ['id', 'nombre', 'email'],
                },
                {
                    model: models.User,
                    as: 'destinatario',
                    attributes: ['id', 'nombre', 'email'],
                },
            ],
        });
    }


    async create(data) {
        try {
            // Limpiar IDs antes de crear el mensaje
            const messageData = {
                usuarioId: this.cleanUserId(data.usuarioId),
                mensaje: data.mensaje,
                toUserId: data.toUserId ? this.cleanUserId(data.toUserId) : null,
                fechaEnvio: data.fechaEnvio || new Date(),
                leido: false
            };

            // Verificar que tanto el remitente como el destinatario existen
            const [senderExists, recipientExists] = await Promise.all([
                this.verifyUserExists(messageData.usuarioId),
                messageData.toUserId ? this.verifyUserExists(messageData.toUserId) : Promise.resolve(true)
            ]);

            if (!senderExists) {
                throw new Error(`Remitente ${data.usuarioId} no encontrado`);
            }

            if (messageData.toUserId && !recipientExists) {
                throw new Error(`Destinatario ${data.toUserId} no encontrado`);
            }

            // Crear el mensaje
            const message = await models.ChatMessage.create(messageData);

            // Retornar el mensaje con las relaciones cargadas
            return await models.ChatMessage.findByPk(message.id, {
                include: [
                    {
                        model: User,
                        as: "remitente",
                        attributes: ["id", "nombre", "email"]
                    },
                    {
                        model: User,
                        as: "destinatario",
                        attributes: ["id", "nombre", "email"]
                    }
                ]
            });
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    async findByUser(userId) {
        if (!userId) return [];

        const cleanId = this.cleanUserId(userId);

        return await models.ChatMessage.findAll({
            where: {
                [Op.or]: [
                    { usuarioId: cleanId },
                    { toUserId: cleanId }
                ]
            },
            order: [["fechaEnvio", "ASC"]],
            include: [
                {
                    model: User,
                    as: "remitente",
                    attributes: ["id", "nombre", "email"]
                },
                {
                    model: User,
                    as: "destinatario",
                    attributes: ["id", "nombre", "email"]
                }
            ]
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

    async findAdminUser() {
        try {
            const adminUser = await models.User.findOne({
                where: {
                    rol: 'Admin',
                    estado: true
                }
            });
            return adminUser;
        } catch (error) {
            console.error('Error al buscar admin:', error);
            throw error;
        }
    }


}

module.exports = ChatMessagesService;