const { User, UserSchema } = require('./users.model');
const { Service, ServiceSchema } = require('./services.model');
const { Appointment, AppointmentSchema } = require('./appointments.model');
const { ChatMessage, ChatMessageSchema } = require('./chatMessages.model');

function setupModels(sequelize) {
    // Inicialización de modelos
    User.init(UserSchema, User.config(sequelize));
    Service.init(ServiceSchema, Service.config(sequelize));
    Appointment.init(AppointmentSchema, Appointment.config(sequelize));
    ChatMessage.init(ChatMessageSchema, ChatMessage.config(sequelize));

    // Asociaciones
    User.hasMany(ChatMessage, {
        as: 'mensajesEnviados',
        foreignKey: 'usuarioId'
    });

    User.hasMany(ChatMessage, {
        as: 'mensajesRecibidos',
        foreignKey: 'toUserId'
    });

    ChatMessage.belongsTo(User, {
        as: 'remitente',
        foreignKey: 'usuarioId'
    });

    ChatMessage.belongsTo(User, {
        as: 'destinatario',
        foreignKey: 'toUserId'
    });

    // Otras asociaciones existentes
    Service.hasMany(Appointment, {
        as: 'citas',
        foreignKey: 'servicioId'
    });

    Appointment.belongsTo(Service, {
        as: 'servicio',
        foreignKey: 'servicioId'
    });

    User.hasMany(Appointment, {
        as: 'citas',
        foreignKey: 'usuarioId'
    });

    Appointment.belongsTo(User, {
        as: 'usuario',
        foreignKey: 'usuarioId'
    });
}

module.exports = setupModels;