import db from '../DB/ConfigureDB.js';
import { DataTypes } from 'sequelize';

const Sesiune = db.define('sesiuni', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idProfesor: {
        type: DataTypes.INTEGER,
        references: {
            model: 'profesori',
            key: 'id',
        },
    },
    dataInceput: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    dataSfarsit: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    nrMaximLocuri: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nrLocuriOcupate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    descriere: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    dataCreare: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

export default Sesiune;
