import env from "dotenv";
import Facultate from "../Entities/Facultate.js";
import Utilizator from "../Entities/Utilizator.js";
import Student from "../Entities/Student.js";
import Profesor from "../Entities/Profesor.js";
import Sesiune from "../Entities/Sesiune.js";
import Cerere from "../Entities/Cerere.js";
import CerereFinala from "../Entities/CerereFinala.js";

env.config();

function configureForeignKeys() {
	// facultati + utilizatori
	Facultate.hasMany(Utilizator, {
		foreignKey: "idFacultate",
		onDelete: "CASCADE",
	});
	Utilizator.belongsTo(Facultate, {
		foreignKey: "idFacultate",
		onDelete: "CASCADE",
	});

	// utilizatori + studenti
	Utilizator.hasOne(Student, { foreignKey: "id", onDelete: "CASCADE" });
	Student.belongsTo(Utilizator, { foreignKey: "id", onDelete: "CASCADE" });

	// utilizatori + profesori
	Utilizator.hasOne(Profesor, { foreignKey: "id", onDelete: "CASCADE" });
	Profesor.belongsTo(Utilizator, { foreignKey: "id", onDelete: "CASCADE" });

	// profesori + sesiuni
	Profesor.hasMany(Sesiune, {
		foreignKey: "idProfesor",
		onDelete: "CASCADE",
	});
	Sesiune.belongsTo(Profesor, {
		foreignKey: "idProfesor",
		onDelete: "CASCADE",
	});

	// studenti + cereri
	Student.hasMany(Cerere, { foreignKey: "idStudent", onDelete: "CASCADE" });
	Cerere.belongsTo(Student, { foreignKey: "idStudent", onDelete: "CASCADE" });

	// sesiuni + cereri
	Sesiune.hasMany(Cerere, { foreignKey: "idSesiune", onDelete: "CASCADE" });
	Cerere.belongsTo(Sesiune, { foreignKey: "idSesiune", onDelete: "CASCADE" });

	// cereri + cereri_finale
	Cerere.hasMany(CerereFinala, {
		as: "cereriFinale",
		foreignKey: "idCerere",
		onDelete: "CASCADE",
	});
	CerereFinala.belongsTo(Cerere, {
		as: "cereri",
		foreignKey: "idCerere",
		onDelete: "CASCADE",
	});
}

function InitDB() {
	configureForeignKeys();
}

export default InitDB;
