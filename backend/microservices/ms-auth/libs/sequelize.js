const { Sequelize } = require('sequelize');
const setupModels = require('../models');


require('dotenv').config();

const sequelize = new Sequelize({
    host: process.env.DB_HOST_AUTH || 'db-auth',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'ProyectoWenAvanzadasIIB',
    database: process.env.DB_NAME_AUTH || 'auth_db',
    port: process.env.DB_PORT_AUTH || '5432',
    dialect: 'postgres',
    dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    retry: {
        match: [/ECONNREFUSED/],
        max: 5 // Número de intentos de reconexión
    },
    logging: console.log
});

sequelize.sync({ force: false, alter: false });

setupModels(sequelize);
console.log(sequelize.models);


module.exports = { sequelize, models: sequelize.models };