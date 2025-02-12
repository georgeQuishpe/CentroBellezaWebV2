const { User, UserSchema } = require('./user.model');

function setupModels(sequelize) {
    // Inicialización de modelos
    User.init(UserSchema, User.config(sequelize));
}

module.exports = setupModels;