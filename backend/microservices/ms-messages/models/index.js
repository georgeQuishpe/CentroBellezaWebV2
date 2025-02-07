const { ChatMessage, ChatMessageSchema } = require('./chatMessages.model');

function setupModels(sequelize) {
    // Inicialización de modelos
    ChatMessage.init(ChatMessageSchema, ChatMessage.config(sequelize));
}

module.exports = setupModels;