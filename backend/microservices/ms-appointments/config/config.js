require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT_APPOINTMENT || 5003,
    dbUser: process.env.DB_USER || 'postgres',
    dbPassword: process.env.DB_PASSWORD || 'ProyectoWenAvanzadasIIB',
    dbHost: process.env.DB_HOST_APPOINTMENT || 'db-appointments',  // Usa el nombre del servicio de la base de datos en Docker
    dbName: process.env.DB_NAME_APPOINTMENT || 'citas_db',
    dbPort: process.env.DB_PORT_APPOINTMENT || '5435',
};

module.exports = { config };
