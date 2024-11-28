// chatMessages.model.js
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
    },
    usuarioId: {
        type: DataTypes.STRING(50), // Cambiar de INTEGER a STRING
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        },
        onDelete: 'CASCADE',
        field: 'usuarioid'
    },
    toUserId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'touserid',
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    fechaEnvio: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'fechaenvio',
    },
    leido: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
};

module.exports = { ChatMessage, ChatMessageSchema };