const { Appointment, AppointmentSchema } = require('./appointments.model');

function setupModels(sequelize) {
    // Inicialización de modelos
    Appointment.init(AppointmentSchema, Appointment.config(sequelize));

    // Configurar las asociaciones
    Appointment.associate(sequelize.models);
}

module.exports = setupModels;