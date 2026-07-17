import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

const Categoria = sequelize.define('categoria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'categorias'
})

export default Categoria;