import db from '../DB/ConfigureDB.js';
import { DataTypes } from 'sequelize';

const Facultate = db.define('facultati', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    denumire: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
});

export default Facultate;
