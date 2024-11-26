const { Model, DataTypes } = require('sequelize');

const CHAT_MESSAGES_TB = 'chatmensajes';

class ChatMessage extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: CHAT_MESSAGES_TB,
            modelName: 'ChatMessage',
            timestamps: false
        }
    }
}

const ChatMessageSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        field: 'id'
    },
    usuarioId: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
            model: 'Usuarios',
            key: 'id'
        },
        field: 'usuarioid'
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'mensaje'
    },
    fechaEnvio: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'fechaenvio'
    },
    leido: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'leido'
    }
};

module.exports = { ChatMessage, ChatMessageSchema };