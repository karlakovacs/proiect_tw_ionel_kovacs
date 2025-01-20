import db from '../DB/ConfigureDB.js';
import { DataTypes } from 'sequelize';

const Profesor = db.define('profesori', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'utilizatori',
            key: 'id',
        },
    },
    titluAcademic: {
        type: DataTypes.ENUM('LECTOR', 'CONFERENTIAR', 'PROFESOR'),
        allowNull: false,
    },
});

export default Profesor;
