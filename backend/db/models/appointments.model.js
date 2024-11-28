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
        this.belongsTo(models.Service, { foreignKey: 'servicioId', as: 'servicio' });
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