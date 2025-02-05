require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT_AUTH || 5001,
    dbUser: process.env.DB_USER || 'postgres',
    dbPassword: process.env.DB_PASSWORD || 'ProyectoWenAvanzadasIIB',
    dbHost: process.env.DB_HOST_AUTH || 'db-auth',  // Usa el nombre del servicio de la base de datos en Docker
    dbName: process.env.DB_NAME_AUTH || 'auth_db',
    dbPort: process.env.DB_PORT_AUTH || '5433',
};

module.exports = { config };
