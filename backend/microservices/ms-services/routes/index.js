const express = require('express');

const servicesRouter = require('./services.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/services', servicesRouter);
}

module.exports = routerApi;
