const { Model, DataTypes } = require('sequelize');
const sequelize = require('../libs/sequelize');

class Appointment extends Model { }

Appointment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            field: 'id'
        },
        usuarioId: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: 'Usuarios', // Nombre de la tabla de referencia
                key: 'id'
            },
            onDelete: 'CASCADE',
            field: 'usuarioid'
        },
        servicioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Servicios', // Nombre de la tabla de referencia
                key: 'id'
            },
            onDelete: 'CASCADE',
            field: 'servicioid'
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true,
                isFuture(value) {
                    if (value < new Date()) {
                        throw new Error('La fecha de la cita debe ser futura');
                    }
                }
            }
        },
        estado: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                isIn: [['Pendiente', 'Confirmada', 'Completada', 'Cancelada']]
            },
            defaultValue: 'Pendiente'
        },
        fechaCreacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            field: 'fechacreacion'
        }
    },
    {
        sequelize,
        modelName: 'Appointment',
        tableName: 'citas',
        timestamps: false
    }
);

module.exports = Appointment;