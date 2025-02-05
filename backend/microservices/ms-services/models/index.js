const { Service, ServiceSchema } = require('./services.model');

function setupModels(sequelize) {
    // Inicialización de modelos
    Service.init(ServiceSchema, Service.config(sequelize));
}

module.exports = setupModels;