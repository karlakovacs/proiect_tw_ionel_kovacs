import express from "express";
import {
	createCerere,
	getCereri,
	getCerereById,
	deleteCerere,
	updateCerere,
} from "../DataAccess/CerereDA.js";
import Cerere from "../Entities/Cerere.js";
import Sesiune from "../Entities/Sesiune.js";
import Profesor from "../Entities/Profesor.js";
import Student from "../Entities/Student.js";
import Utilizator from "../Entities/Utilizator.js";

let router = express.Router();

router.route("/cereri").post(async (req, res) => {
	const data = req.body;
	const newObject = await createCerere(data);
	return res.status(201).json(newObject);
});

router.route("/cereri").get(async (req, res) => {
	const listObjects = await getCereri();
	return res.status(200).json(listObjects);
});

router.route("/cereri/:id").get(async (req, res) => {
	const id = req.params.id;
	const object = await getCerereById(id);
	if (!object) {
		return res.status(404).json({ message: "X" });
	}
	return res.status(200).json(object);
});

router.route("/cereri/:id").delete(async (req, res) => {
	const id = req.params.id;
	const result = await deleteCerere(id);
	if (!result) {
		return res.status(404).json({ message: "X" });
	}
	return res.status(200).json({ message: "OK" });
});

router.route("/cereri/:id").put(async (req, res) => {
	const id = req.params.id;
	const data = req.body;
	const updated = await updateCerere(id, data);
	if (!updated) {
		return res.status(404).json({ message: "X" });
	}
	return res.status(200).json(updated);
});

////////////////////////////////////////////////

router.get("/cereri/student/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const cereri = await Cerere.findAll({
			where: { idStudent: id },
			attributes: ["id", "idSesiune", "statusPreliminar"],
		});

		res.json(cereri);
	} catch (err) {
		console.error("Eroare la preluarea cererilor:", err);
		res.status(500).json({ message: "Eroare internă la server!" });
	}
});

router.get("/cereri/student/detalii/:id", async (req, res) => {
	const idStudent = req.params.id;

	try {
		const cereri = await Cerere.findAll({
			include: [
				{
					model: Sesiune,
					as: "sesiuni",
					attributes: ["id", "dataInceput", "dataSfarsit"],
					include: [
						{
							model: Profesor,
							as: "profesori",
							include: [
								{
									model: Utilizator,
									as: "utilizatori",
									attributes: [
										"id",
										"nume",
										"prenume",
										"urlImagineProfil",
									],
								},
							],
							attributes: ["titluAcademic"],
						},
					],
				},
			],
			where: { idStudent },
			attributes: ["id", "statusPreliminar", "dataTrimitereStudent"],
			order: [["dataTrimitereStudent", "DESC"]],
		});

		const prescurtareTitlu = (titlu) => {
			switch (titlu) {
				case "PROFESOR":
					return "Prof. dr.";
				case "CONFERENTIAR":
					return "Conf. dr.";
				case "LECTOR":
					return "Lect. dr.";
				default:
					return titlu;
			}
		};

		const cereriProcesate = cereri.map((cerere) => ({
			idCerere: cerere.id,
			idSesiune: cerere.sesiuni.id,
			idProfesor: cerere.sesiuni.profesori.utilizatori.id,
			profesor: `${prescurtareTitlu(
				cerere.sesiuni.profesori.titluAcademic
			)} ${cerere.sesiuni.profesori.utilizatori.nume.toUpperCase()} ${
				cerere.sesiuni.profesori.utilizatori.prenume
			}`,
			imagineProfesor:
				cerere.sesiuni.profesori.utilizatori.urlImagineProfil,
			dataInceput: cerere.sesiuni.dataInceput,
			dataSfarsit: cerere.sesiuni.dataSfarsit,
			statusPreliminar: cerere.statusPreliminar,
			dataTrimitereStudent: cerere.dataTrimitereStudent,
		}));

		res.json(cereriProcesate);
	} catch (err) {
		console.error("Eroare la obținerea cererilor:", err);
		res.status(500).json({ message: "Eroare internă la server!" });
	}
});

router.get("/cereri/sesiune/:id", async (req, res) => {
	const idSesiune = req.params.id;

	try {
		const cereri = await Cerere.findAll({
			where: { idSesiune },
			include: [
				{
					model: Student,
					as: "studenti",
					include: [
						{
							model: Utilizator,
							as: "utilizatori",
							attributes: ["nume", "prenume", "urlImagineProfil"],
						},
					],
					attributes: ["formaInvatamant", "anInmatriculare"],
				},
			],
			attributes: [
				"id",
				"idStudent",
				"statusPreliminar",
				"dataTrimitereStudent",
			],
			order: [["dataTrimitereStudent", "DESC"]],
		});

		const cereriProcesate = cereri.map((cerere) => ({
			idCerere: cerere.id,
			idStudent: cerere.idStudent,
			imagineStudent: cerere.studenti.utilizatori.urlImagineProfil,
			student: `${cerere.studenti.utilizatori.nume.toUpperCase()} ${
				cerere.studenti.utilizatori.prenume
			}`,
			formaInvatamant: cerere.studenti.formaInvatamant,
			anInmatriculare: cerere.studenti.anInmatriculare,
			statusPreliminar: cerere.statusPreliminar,
			dataTrimitereStudent: cerere.dataTrimitereStudent,
		}));

		res.json(cereriProcesate);
	} catch (err) {
		console.error("Eroare la obținerea cererilor:", err);
		res.status(500).json({ message: "Eroare internă la server!" });
	}
});

router.get(
	"/cereri/info/:idCerere/:idStudent/:idProfesor",
	async (req, res) => {
		const { idCerere, idStudent, idProfesor } = req.params;

		try {
			// Preia cererea
			const cerere = await Cerere.findOne({
				where: { id: idCerere },
				attributes: [
					"id",
					"idSesiune",
					"titluPreliminar",
					"descrierePreliminara",
					"statusPreliminar",
					"dataTrimitereStudent",
					"motivRespingere",
					"dataRaspunsProfesor",
				],
			});

			if (!cerere) {
				return res
					.status(404)
					.json({ message: "Cererea nu a fost găsită!" });
			}

			// Preia datele studentului
			const student = await Student.findOne({
				where: { id: idStudent },
				include: [
					{
						model: Utilizator,
						as: "utilizatori",
						attributes: ["nume", "prenume"],
					},
				],
				attributes: [],
			});

			if (!student) {
				return res
					.status(404)
					.json({ message: "Studentul nu a fost găsit!" });
			}

			// Preia datele profesorului
			const profesor = await Profesor.findOne({
				where: { id: idProfesor },
				include: [
					{
						model: Utilizator,
						as: "utilizatori",
						attributes: ["nume", "prenume"],
					},
				],
				attributes: [],
			});

			if (!profesor) {
				return res
					.status(404)
					.json({ message: "Profesorul nu a fost găsit!" });
			}

			// Construiește răspunsul
			const cerereProcesata = {
				idCerere: cerere.id,
				idSesiune: cerere.idSesiune,
				titluPreliminar: cerere.titluPreliminar,
				descrierePreliminara: cerere.descrierePreliminara,
				statusPreliminar: cerere.statusPreliminar,
				dataTrimitereStudent: cerere.dataTrimitereStudent,
				motivRespingere: cerere.motivRespingere,
				dataRaspunsProfesor: cerere.dataRaspunsProfesor,
				numeStudent: `${student.utilizatori.nume} ${student.utilizatori.prenume}`,
				numeProfesor: `${profesor.utilizatori.nume} ${profesor.utilizatori.prenume}`,
			};

			res.status(200).json(cerereProcesata);
		} catch (err) {
			console.error("Eroare la obținerea detaliilor cererii:", err);
			res.status(500).json({ message: "Eroare internă la server!" });
		}
	}
);

router.put("/cereri/aprobare/:idCerere", async (req, res) => {
	const { idCerere } = req.params;

	try {
		// Găsește cererea curentă
		const cerere = await Cerere.findOne({
			where: { id: idCerere },
			attributes: ["idStudent", "idSesiune"],
		});

		if (!cerere) {
			return res
				.status(404)
				.json({ message: "Cererea nu a fost găsită!" });
		}

		const { idStudent, idSesiune } = cerere;

		// Găsește sesiunea asociată cererii
		const sesiune = await Sesiune.findOne({
			where: { id: idSesiune },
			attributes: ["nrLocuriOcupate", "nrMaximLocuri"],
		});

		if (!sesiune) {
			return res
				.status(404)
				.json({ message: "Sesiunea nu a fost găsită!" });
		}

		const { nrLocuriOcupate, nrMaximLocuri } = sesiune;

		if (nrLocuriOcupate >= nrMaximLocuri) {
			return res.status(400).json({
				message: "Sesiunea este completă. Nu se mai pot aproba cereri.",
			});
		}

		// Aprobă cererea curentă
		await Cerere.update(
			{
				statusPreliminar: "APROBATA",
				dataRaspunsProfesor: new Date(),
			},
			{
				where: { id: idCerere },
			}
		);

		// Respinge toate cererile IN_ASTEPTARE ale studentului curent
		await Cerere.update(
			{
				statusPreliminar: "RESPINSA",
				dataRaspunsProfesor: new Date(),
				motivRespingere: "A fost aprobată altă cerere.",
			},
			{
				where: {
					idStudent: idStudent,
					statusPreliminar: "IN_ASTEPTARE",
				},
			}
		);

		// Incrementează numărul de locuri ocupate
		const sesiuneUpdated = await Sesiune.update(
			{
				nrLocuriOcupate: nrLocuriOcupate + 1,
			},
			{
				where: { id: idSesiune },
				returning: true,
				plain: true,
			}
		);

		const locuriOcupateNou = nrLocuriOcupate + 1;

		// Dacă locurile ocupate sunt egale cu locurile maxime, respinge cererile rămase
		if (locuriOcupateNou === nrMaximLocuri) {
			await Cerere.update(
				{
					statusPreliminar: "RESPINSA",
					dataRaspunsProfesor: new Date(),
					motivRespingere: "Numărul maxim de studenți a fost atins.",
				},
				{
					where: {
						idSesiune: idSesiune,
						statusPreliminar: "IN_ASTEPTARE",
					},
				}
			);
		}

		res.status(200).json({
			message:
				"Cererea a fost aprobată, iar numărul de locuri ocupate a fost actualizat!",
		});
	} catch (err) {
		console.error("Eroare la aprobarea cererii:", err);
		res.status(500).json({ message: "Eroare internă la server!" });
	}
});

export default router;
