const { Sequelize } = require('sequelize');

// const { config } = require('../config/config');
const setupModels = require('../db/models');

const conectionUrl = 'postgresql://peluqueriaweb_user:aZffbZQwqiizWrD7mYWLiSGDXlswJMDx@dpg-ct0vict2ng1s73e2pimg-a.oregon-postgres.render.com/peluqueriaweb';

const sequelize = new Sequelize(conectionUrl, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

sequelize.sync();      
setupModels(sequelize);

module.exports = sequelize;