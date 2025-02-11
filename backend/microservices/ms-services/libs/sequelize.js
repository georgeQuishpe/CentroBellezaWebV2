const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    host: process.env.DB_HOST_SERVICES || 'db-services',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'ProyectoWenAvanzadasIIB',
    database: process.env.DB_NAME_SERVICES || 'servicios_db',
    port: process.env.DB_PORT_SERVICES || '5432',
    dialect: 'postgres',
    dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
    },
    retry: {
        match: [/ECONNREFUSED/],
        max: 5 // Número de intentos de reconexión
    },
    logging: console.log
});

module.exports = sequelize;