require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 5000,
    dbUser: 'peluqueriaweb_user',
    dbPassword: 'aZffbZQwqiizWrD7mYWLiSGDXlswJMDx',
    dbHost: 'http://dpg-ct0vict2ng1s73e2pimg-a.oregon-postgres.render.com',
    dbName: 'peluqueriaweb',
    dbPort: '5432',
}

module.exports = { config };