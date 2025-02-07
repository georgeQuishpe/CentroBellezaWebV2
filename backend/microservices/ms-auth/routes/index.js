const express = require('express');

const usersRouter = require('./users.router');
const authRouter = require('./auth.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/users', usersRouter);
    router.use('/auth', authRouter);
}

module.exports = routerApi;
