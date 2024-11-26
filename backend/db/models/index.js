const { User, UserSchema } = require('./users.model');
const { Service, ServiceSchema } = require('./services.model');
const { Appointment, AppointmentSchema } = require('./appointments.model');
const { ChatMessage, ChatMessageSchema } = require('./chatMessages.model');

function setupModels(sequelize) {
    User.init(UserSchema, User.config(sequelize));
    Service.init(ServiceSchema, Service.config(sequelize));
    Appointment.init(AppointmentSchema, Appointment.config(sequelize));
    ChatMessage.init(ChatMessageSchema, ChatMessage.config(sequelize));
}

module.exports = setupModels;