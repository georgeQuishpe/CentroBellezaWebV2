const { Model, DataTypes } = require('sequelize');

class Appointment extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: 'citas',
            modelName: 'Appointment',
            timestamps: false
        }
    }

    static associate(models) {
        // Asociación con Usuario
        this.belongsTo(models.User, {
            as: 'usuario',
            foreignKey: 'usuarioId'
        });
        // Asociación con Servicio
        this.belongsTo(models.Service, {
            as: 'servicio',
            foreignKey: 'servicioId'
        });
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
};

module.exports = { Appointment, AppointmentSchema }