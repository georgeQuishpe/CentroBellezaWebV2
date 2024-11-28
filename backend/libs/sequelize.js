const { Sequelize } = require('sequelize');
const setupModels = require('../db/models');


require('dotenv').config();

const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true, //Antes era TRUE
            rejectUnauthorized: false
        }
    },
    logging: console.log // Puedes desactivarlo si lo deseas
});

sequelize.sync({ force: false, alter: false });

setupModels(sequelize);
console.log(sequelize.models);


module.exports = { sequelize, models: sequelize.models };