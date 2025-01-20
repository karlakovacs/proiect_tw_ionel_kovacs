import db from '../DB/ConfigureDB.js';
import { DataTypes } from 'sequelize';

const Student = db.define('studenti', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'utilizatori',
            key: 'id',
        },
    },
    formaInvatamant: {
        type: DataTypes.ENUM('IF', 'IFR', 'ID'),
        allowNull: false,
    },
    anInmatriculare: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default Student;
