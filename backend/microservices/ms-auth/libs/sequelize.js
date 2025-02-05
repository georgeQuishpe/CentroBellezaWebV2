const { Sequelize } = require('sequelize');
const setupModels = require('../models');


require('dotenv').config();

const sequelize = new Sequelize({
    host: process.env.DB_HOST_AUTH,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_AUTH,
    port: process.env.DB_PORT_AUTH,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true, //Antes era TRUE
            rejectUnauthorized: false
        }
    },
    logging: console.log, // Puedes desactivarlo si lo deseas
    define: {
        timestamps: false, // O true si deseas createdAt y updatedAt
        freezeTableName: true // Evita que Sequelize pluralice los nombres de las tablas
    }
});

sequelize.sync({ force: false, alter: false });

setupModels(sequelize);
console.log(sequelize.models);


module.exports = { sequelize, models: sequelize.models };