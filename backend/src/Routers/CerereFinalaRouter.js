import express from "express";
import {
	createCerereFinala,
	getCereriFinale,
	getCerereFinalaById,
	deleteCerereFinala,
	updateCerereFinala,
} from "../DataAccess/CerereFinalaDA.js";
import CerereFinala from "../Entities/CerereFinala.js";
import CreareCerere from "../PDFUtils/CreareCerere.js";
import SemnareCerere from "../PDFUtils/SemnareCerere.js";
import Cerere from '../Entities/Cerere.js';
import Student from '../Entities/Student.js';
import Sesiune from '../Entities/Sesiune.js';
import Profesor from '../Entities/Profesor.js';
import Utilizator from '../Entities/Utilizator.js';
import Facultate from '../Entities/Facultate.js';

let router = express.Router();

router.route("/cereri-finale").post(async (req, res) => {
	const data = req.body;
	const newObject = await createCerereFinala(data);
	return res.status(201).json({ idCerereFinala: newObject.id });
});

router.route("/cereri-finale").get(async (req, res) => {
	const listObjects = await getCereriFinale();
	return res.status(200).json(listObjects);
});

router.route("/cereri-finale/:id").get(async (req, res) => {
	const id = req.params.id;
	const object = await getCerereFinalaById(id);
	if (!object) {
		return res.status(404).json({ message: "X" });
	}
	return res.status(200).json(object);
});

router.route("/cereri-finale/:id").delete(async (req, res) => {
	const id = req.params.id;
	const result = await deleteCerereFinala(id);
	if (!result) {
		return res.status(404).json({ message: "X" });
	}
	return res.status(200).json({ message: "OK" });
});

router.route("/cereri-finale/:id").put(async (req, res) => {
	const id = req.params.id;
	const data = req.body;
	const updated = await updateCerereFinala(id, data);
	if (!updated) {
		return res.status(404).json({ message: "X" });
	}
	return res.status(200).json(updated);
});

/////////////////////////////////////////////////////////////

router.get("/cereri-finale/lista/:idCerere", async (req, res) => {
	const { idCerere } = req.params;

	try {
		const cereriFinale = await CerereFinala.findAll({
			where: { idCerere },
		});

		res.status(200).json(cereriFinale);
	} catch (err) {
		console.error("Eroare la obținerea cererilor finale:", err);
		res.status(500).json({ message: "Eroare internă la server!" });
	}
});

router.post('/cereri-finale/generare/:idCerereFinala', async (req, res) => {
    const { idCerereFinala } = req.params;

    try {
        const cerereFinala = await CerereFinala.findOne({
            where: { id: idCerereFinala },
            attributes: ['titluFinal'],
            include: [
                {
                    model: Cerere,
                    as: 'cereri',
                    include: [
                        {
                            model: Student,
                            as: 'studenti',
                            include: [
                                {
                                    model: Utilizator,
                                    as: 'utilizatori',
                                    attributes: ['nume', 'prenume', 'email', 'urlSemnatura'],
                                    include: [
                                        {
                                            model: Facultate,
                                            as: 'facultati',
                                            attributes: ['denumire'],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            model: Sesiune,
                            as: 'sesiuni',
                            include: [
                                {
                                    model: Profesor,
                                    as: 'profesori',
                                    include: [
                                        {
                                            model: Utilizator,
                                            as: 'utilizatori',
                                            attributes: ['nume', 'prenume'],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!cerereFinala) {
            return res.status(404).json({ message: 'Cererea finală nu a fost găsită!' });
        }

        const cerere = cerereFinala.cereri;
        const numeStudent = cerere.studenti.utilizatori.nume;
        const prenumeStudent = cerere.studenti.utilizatori.prenume;
        const emailStudent = cerere.studenti.utilizatori.email;
        const urlSemnaturaStudent = cerere.studenti.utilizatori.urlSemnatura;
        const facultate = cerere.studenti.utilizatori.facultati.denumire;
        const formaInvatamant = cerere.studenti.formaInvatamant;
        const anInmatriculare = cerere.studenti.anInmatriculare;
        const numeProfesor = cerere.sesiuni.profesori.utilizatori.nume;
        const prenumeProfesor = cerere.sesiuni.profesori.utilizatori.prenume;
        const titluAcademic = cerere.sesiuni.profesori.titluAcademic;
        const titluLucrare = cerereFinala.titluFinal;

        await CreareCerere(
            numeStudent,
            prenumeStudent,
            facultate,
            formaInvatamant,
            titluLucrare,
            titluAcademic,
            numeProfesor,
            prenumeProfesor,
            anInmatriculare,
            emailStudent,
            urlSemnaturaStudent,
            idCerereFinala
        );

        res.status(200).json({
            message: 'Cererea PDF a fost generată și salvată cu succes!',
        });
    } catch (err) {
        console.error('Eroare la generarea cererii:', err);
        res.status(500).json({ message: 'Eroare internă la server!' });
    }
});

router.post("/cereri-finale/semnare/:idCerereFinala", async (req, res) => {
    const { idCerereFinala } = req.params;

    try {
        const cerereFinala = await CerereFinala.findOne({
            where: { id: idCerereFinala },
            attributes: ["urlCerereStudent", "id", "idCerere"],
            include: [
                {
                    model: Cerere,
                    as: "cereri",
                    include: [
                        {
                            model: Sesiune, // Include sesiuni pentru a ajunge la profesori
                            as: "sesiuni",
                            include: [
                                {
                                    model: Profesor, // Include profesorii din sesiuni
                                    as: "profesori",
                                    include: [
                                        {
                                            model: Utilizator, // Include utilizatorii pentru semnătură
                                            as: "utilizatori",
                                            attributes: ["urlSemnatura"],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!cerereFinala) {
            return res.status(404).json({ message: "Cererea finală nu a fost găsită!" });
        }

        const urlCerereStudent = cerereFinala.urlCerereStudent;
        const urlSemnaturaProfesor = cerereFinala.cereri.sesiuni.profesori.utilizatori.urlSemnatura;

        const pdfUrl = await SemnareCerere(
            urlCerereStudent,
            urlSemnaturaProfesor,
            idCerereFinala
        );

        res.status(200).json({
            message: "Cererea a fost semnată cu succes!",
            pdfUrl,
        });
    } catch (error) {
        console.error("Eroare la semnarea cererii:", error);
        res.status(500).json({ message: "Eroare internă la server!" });
    }
});

export default router;
