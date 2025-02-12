const express = require('express');

const chatMessagesRouter = require('./chatMessages.routes');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/chat-messages', chatMessagesRouter);
}

module.exports = routerApi;