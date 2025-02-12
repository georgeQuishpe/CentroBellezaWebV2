// chatMessages.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../libs/sequelize');

class ChatMessage extends Model {}

ChatMessage.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        usuarioId: {
            type: DataTypes.STRING(50),
            allowNull: false,
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
    },
    {
        sequelize,
        tableName: 'chatmensajes',
        modelName: 'ChatMessage',
        timestamps: false,
    }
);
    
module.exports = ChatMessage;