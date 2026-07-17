import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

const Objeto = sequelize.define('objeto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    icono: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '📦'
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'disponible' 
    }
})

export default Objeto;