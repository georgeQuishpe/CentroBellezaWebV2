const { User, UserSchema } = require('./users.model');
const { Service, ServiceSchema } = require('./services.model');
const { Appointment, AppointmentSchema } = require('./appointments.model');

function setupModels(sequelize) {
    User.init(UserSchema, User.config(sequelize));
    Service.init(ServiceSchema, Service.config(sequelize));
    Appointment.init(AppointmentSchema, Appointment.config(sequelize));
}

module.exports = setupModels;