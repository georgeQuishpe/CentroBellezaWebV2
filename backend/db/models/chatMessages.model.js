const { Model, DataTypes } = require('sequelize');

const CHAT_MESSAGES_TB = 'chatmensajes';

class ChatMessage extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: CHAT_MESSAGES_TB,
            modelName: 'ChatMessage',
            timestamps: false,
        };
    }
}

const ChatMessageSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        field: 'id',
    },
    usuarioId: {
        type: DataTypes.STRING(50), // Aumenta el tamaño máximo
        allowNull: false,
        references: {
            model: 'Usuarios',
            key: 'id',
        },
        field: 'usuarioid',
    },
    toUserId: {
        type: DataTypes.STRING(50), // Nuevo campo para destinatario
        allowNull: true, // Opcional
        field: 'touserid',
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'mensaje',
    },
    fechaEnvio: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'fechaenvio',
    },
    leido: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'leido',
    },
};

module.exports = { ChatMessage, ChatMessageSchema };
