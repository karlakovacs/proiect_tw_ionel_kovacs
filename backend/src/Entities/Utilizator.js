import db from '../DB/ConfigureDB.js';
import { DataTypes } from 'sequelize';

const Utilizator = db.define('utilizatori', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nume: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prenume: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    parola: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    urlImagineProfil: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    urlSemnatura: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    idFacultate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'facultati',
            key: 'id',
        },
    },
    tip: {
        type: DataTypes.ENUM('STUDENT', 'PROFESOR'),
        allowNull: false,
    },
    dataInregistrare: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

export default Utilizator;
