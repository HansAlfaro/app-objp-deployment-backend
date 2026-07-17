import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

const Usuario = sequelize.define('usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'student' 
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
})

export default Usuario;
