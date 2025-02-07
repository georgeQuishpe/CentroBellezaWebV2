const express = require('express');

const usersRouter = require('./users.router');
const servicesRouter = require('./services.router');
const appointmentsRouter = require('./appointments.router');
const authRouter = require('./auth.router');
const chatMessagesRouter = require('./chatMessages.router'); // Importa la nueva ruta

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/users', usersRouter);
    router.use('/services', servicesRouter);
    router.use('/appointments', appointmentsRouter);
    router.use('/auth', authRouter);
    router.use('/chat-messages', chatMessagesRouter); // Registra la nueva ruta
}

module.exports = routerApi;
