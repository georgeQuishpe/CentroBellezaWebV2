const { User, UserSchema } = require('./users.model');

function setupModels(sequelize) {
    // Inicialización de modelos
    User.init(UserSchema, User.config(sequelize));
}

module.exports = setupModels;