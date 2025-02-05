const express = require('express');

const appointmentsRouter = require('./appointments.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/appointments', appointmentsRouter);
}

module.exports = routerApi;
