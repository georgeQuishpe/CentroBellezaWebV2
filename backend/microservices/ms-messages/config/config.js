require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT_MESSAGES || 5004,
    dbUser: process.env.DB_USER || 'postgres',
    dbPassword: process.env.DB_PASSWORD || 'ProyectoWenAvanzadasIIB',
    dbHost: process.env.DB_HOST_MESSAGES || 'db-messages',  // Usa el nombre del servicio de la base de datos en Docker
    dbName: process.env.DB_NAME_MESSAGES || 'chat_db',
    dbPort: process.env.DB_PORT_MESSAGES || '5436',
};

module.exports = { config };
