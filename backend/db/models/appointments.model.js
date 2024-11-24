const { Model, DataTypes } = require('sequelize');

const APPOINTMENT_TB = 'citas';

class Appointment extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: APPOINTMENT_TB,
            modelName: 'Appointment',
            timestamps: false
        }
    }
}

const AppointmentSchema = {
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
        field: 'fecha'
    },
    estado: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            isIn: [['Pendiente', 'Confirmada', 'Cancelada']]
        },
        field: 'estado'
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'fechacreacion'
    }
};

module.exports = {Appointment, AppointmentSchema}