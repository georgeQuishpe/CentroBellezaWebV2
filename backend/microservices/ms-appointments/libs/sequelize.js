const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    host: process.env.DB_HOST_APPOINTMENT || 'db-appointments',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'ProyectoWenAvanzadasIIB',
    database: process.env.DB_NAME_APPOINTMENT || 'citas_db',
    port: process.env.DB_PORT_APPOINTMENT || '5432',
    dialect: 'postgres',
    dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
    },
    retry: {
        match: [/ECONNREFUSED/],
        max: 5
    },
    logging: console.log
});

module.exports = sequelize;