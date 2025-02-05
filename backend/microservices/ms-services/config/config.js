require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT_SERVICES || 5002,
    dbUser: process.env.DB_USER || 'postgres',
    dbPassword: process.env.DB_PASSWORD || 'ProyectoWenAvanzadasIIB',
    dbHost: process.env.DB_HOST_SERVICES || 'db-services',  // Usa el nombre del servicio de la base de datos en Docker
    dbName: process.env.DB_NAME_SERVICES || 'servicios_db',
    dbPort: process.env.DB_PORT_SERVICES || '5434',
};

module.exports = { config };
