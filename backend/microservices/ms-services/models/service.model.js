const { Model, DataTypes } = require('sequelize');
const sequelize = require('../libs/sequelize');

class Service extends Model {}

Service.init(
    {
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
    },
    {
        sequelize,
        tableName: 'servicios',
        modelName: 'Service',
        timestamps: false
    }
);

module.exports = Service;