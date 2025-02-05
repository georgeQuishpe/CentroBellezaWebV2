const { Appointment, AppointmentSchema } = require('./appointments.model');

function setupModels(sequelize) {
    // Inicialización de modelos
    Appointment.init(AppointmentSchema, Appointment.config(sequelize));

}

module.exports = setupModels;