import db from '../DB/ConfigureDB.js';
import { DataTypes } from 'sequelize';

const CerereFinala = db.define('cereri_finale', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idCerere: {
        type: DataTypes.INTEGER,
        references: {
            model: 'cereri',
            key: 'id',
        },
    },
    titluFinal: {
        type: DataTypes.TEXT,
    },
    statusFinal: {
        type: DataTypes.ENUM('IN_ASTEPTARE', 'APROBATA', 'RESPINSA'),
        defaultValue: 'IN_ASTEPTARE',
        allowNull: false,
    },
    urlCerereStudent: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    dataIncarcareStudent: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    urlCerereProfesor: {
        type: DataTypes.TEXT,
        allowNull: true, // completat doar daca cererea este aprobata
    },
    dataRaspunsProfesor: {
        type: DataTypes.DATE,
        allowNull: true, // actualizat doar daca profesorul raspunde la cerere
    },
});

export default CerereFinala;
