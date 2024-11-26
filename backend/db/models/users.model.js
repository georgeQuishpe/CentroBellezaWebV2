const { Model, DataTypes } = require('sequelize');

const USER_TB = 'usuarios';

class User extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: USER_TB,
            modelName: 'User',
            timestamps: false
        }
    }
}

const UserSchema = {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
        field: 'id'
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
        field: 'email'
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password'
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'nombre'
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'telefono'
    },
    rol: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['Admin', 'Cliente']]
        },
        field: 'rol'
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'fecharegistro'
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'estado'
    },
    verificationCode: {
        type: DataTypes.STRING(10), // Código de longitud máxima 10
        allowNull: true, // Puede ser nulo si no está en uso
        field: 'verification_code' // Nombre del campo en la base de datos
    },

};


module.exports = { User, UserSchema }