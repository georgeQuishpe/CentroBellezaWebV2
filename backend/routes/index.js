const express = require('express');

const usersRouter = require('./users.router');
const servicesRouter = require('./services.router');
const appointmentsRouter = require('./appointments.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/users', usersRouter);
    router.use('/services', servicesRouter);
    router.use('/appointments', appointmentsRouter);
}

module.exports = routerApi;