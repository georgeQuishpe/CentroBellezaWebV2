const { Model, DataTypes } = require('sequelize');

class Service extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: 'servicios',
            modelName: 'Service',
            timestamps: false
        }
    }


    static associate(models) {
        this.hasMany(models.Appointment, { foreignKey: 'servicioId', as: 'citas' });
    }
}

const ServiceSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        field: 'id'
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'nombre'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'descripcion'
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'precio'
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'duracion' // En minutos
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'estado'
    }
};

module.exports = { Service, ServiceSchema }