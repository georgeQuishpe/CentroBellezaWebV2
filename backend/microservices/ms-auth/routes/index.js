const express = require('express');

const usersRouter = require('./users.routes');
const authRouter = require('./auth.routes');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/users', usersRouter);
    router.use('/auth', authRouter);
}

module.exports = routerApi;