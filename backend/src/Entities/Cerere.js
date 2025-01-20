import db from '../DB/ConfigureDB.js';
import { DataTypes } from 'sequelize';

const Cerere = db.define('cereri', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idStudent: {
        type: DataTypes.INTEGER,
        references: {
            model: 'studenti',
            key: 'id',
        },
    },
    idSesiune: {
        type: DataTypes.INTEGER,
        references: {
            model: 'sesiuni',
            key: 'id',
        },
    },
    titluPreliminar: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    descrierePreliminara: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    statusPreliminar: {
        type: DataTypes.ENUM('IN_ASTEPTARE', 'APROBATA', 'RESPINSA', 'RETRASA'),
        defaultValue: 'IN_ASTEPTARE',
        allowNull: false,
    },
    dataTrimitereStudent: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    motivRespingere: {
        type: DataTypes.TEXT,
        allowNull: true, // completat doar daca cererea este respinsa
    },
    dataRaspunsProfesor: {
        type: DataTypes.DATE,
        allowNull: true, // actualizat doar daca profesorul raspunde la cerere
    },
});

export default Cerere;
