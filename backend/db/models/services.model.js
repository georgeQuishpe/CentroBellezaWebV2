const { Model, DataTypes } = require('sequelize');

const SERVICE_TB = 'servicios';

class Service extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: SERVICE_TB,
            modelName: 'Service',
            timestamps: false
        }
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

module.exports = {Service, ServiceSchema}