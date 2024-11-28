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
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: 'usuarios', // En minúsculas para PostgreSQL
            key: 'id'
        },
        onDelete: 'CASCADE',
        field: 'usuarioid',
    },
    toUserId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        references: {
            model: 'usuarios', // También referencia a usuarios
            key: 'id'
        },
        onDelete: 'SET NULL',
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
