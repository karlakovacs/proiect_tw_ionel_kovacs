import express from 'express';
import { Op } from 'sequelize';
import db from '../DB/ConfigureDB.js';
import { createSesiune, getSesiuni, getSesiuneById, deleteSesiune, updateSesiune } from '../DataAccess/SesiuneDA.js';
import Sesiune from '../Entities/Sesiune.js';
import Profesor from '../Entities/Profesor.js';
import Utilizator from '../Entities/Utilizator.js';
import Facultate from '../Entities/Facultate.js';
import moment from "moment-timezone";

let router = express.Router();

router.route('/sesiuni').post(async (req, res) => {
    const data = req.body;
    const newObject = await createSesiune(data);
    return res.status(201).json(newObject);
});

router.route('/sesiuni').get(async (req, res) => {
    const listObjects = await getSesiuni();
    return res.status(200).json(listObjects);
});

router.route('/sesiuni/:id').get(async (req, res) => {
    const id = req.params.id;
    const object = await getSesiuneById(id);
    if (!object) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json(object);
});

router.route('/sesiuni/:id').delete(async (req, res) => {
    const id = req.params.id;
    const result = await deleteSesiune(id);
    if (!result) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json({ message: 'OK' });
});

router.route('/sesiuni/:id').put(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const updated = await updateSesiune(id, data);
    if (!updated) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json(updated);
});

/////////////////////////////////////////////////////

router.post('/sesiuni/creare', async (req, res) => {
    const { idProfesor, dataInceput, dataSfarsit, nrMaximLocuri, descriere } = req.body;

    try {
        const dataCurenta = moment().tz("Europe/Bucharest").startOf("day").toDate();
        const dataStart = moment.utc(dataInceput).tz("Europe/Bucharest").startOf("day").toDate();
        const dataEnd = moment.utc(dataSfarsit).tz("Europe/Bucharest").endOf("day").toDate();

        // Validare 1: Data de start trebuie să fie în viitor sau astăzi
        if (dataStart < dataCurenta) {
            return res.status(400).json({ message: 'Data de început trebuie să fie cel puțin astăzi!' });
        }

        // Validare 2: Data de sfârșit trebuie să fie după data de start
        if (dataEnd <= dataStart) {
            return res.status(400).json({ message: 'Data de sfârșit trebuie să fie după data de început!' });
        }

        const suprapunere = await Sesiune.findOne({
            where: {
                idProfesor: idProfesor,
                [Op.or]: [
                    {
                        dataInceput: {
                            [Op.between]: [dataStart, dataEnd],
                        },
                    },
                    {
                        dataSfarsit: {
                            [Op.between]: [dataStart, dataEnd],
                        },
                    },
                    {
                        [Op.and]: [
                            { dataInceput: { [Op.lte]: dataStart } }, 
                            { dataSfarsit: { [Op.gte]: dataEnd } }
                        ],
                    },
                ],
            },
        });

        if (suprapunere) {
            return res.status(400).json({ message: 'Există deja o sesiune care se suprapune!' });
        }

        const sesiuneNoua = await Sesiune.create({
            idProfesor,
            dataInceput: dataStart, 
            dataSfarsit: dataEnd, 
            nrMaximLocuri,
            descriere,
        });

        res.status(201).json(sesiuneNoua);
    } catch (err) {
        console.error('Eroare la crearea sesiunii:', err);
        res.status(500).json({ message: 'Eroare internă la server!' });
    }
});


router.get('/sesiuni/profesor/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sesiuni = await Sesiune.findAll({
            where: { idProfesor: id },
            order: [['dataCreare', 'DESC']],
        });

        res.status(200).json(sesiuni);
    } catch (err) {
        console.error('Eroare la obținerea sesiunilor:', err);
        res.status(500).json({ message: 'Eroare internă la server!' });
    }
});

router.get('/sesiuni/sesiune-curenta/:idProfesor', async (req, res) => {
    const { idProfesor } = req.params;

    try {
        // Obține sesiunea curentă a profesorului
        const sesiuneCurenta = await Sesiune.findOne({
            where: {
                idProfesor,
                dataInceput: { [Op.lte]: new Date() }, // dataInceput <= azi
                dataSfarsit: { [Op.gte]: new Date() }, // dataSfarsit >= azi
            },
            attributes: ['id'], // Returnează doar ID-ul
        });

        // Verifică dacă există o sesiune activă
        if (!sesiuneCurenta) {
            return res.status(404).json({ message: 'Nu există o sesiune activă!' });
        }

        res.status(200).json({ idSesiune: sesiuneCurenta.id });
    } catch (err) {
        console.error('Eroare la obținerea sesiunii curente:', err);
        res.status(500).json({ message: 'Eroare internă la server!' });
    }
});

router.post('/sesiuni/filtrare/:id', async (req, res) => {
    const idFacultate = req.params.id;

    try {
        const facultateExistenta = await Facultate.findByPk(idFacultate);
        if (!facultateExistenta) {
            return res.status(404).json({ message: 'Facultatea nu există!' });
        }

        const sesiuni = await Sesiune.findAll({
            include: [
                {
                    model: Profesor,
                    as: 'profesori',
                    include: [
                        {
                            model: Utilizator,
                            as: 'utilizatori',
                            attributes: ['nume', 'prenume', 'urlImagineProfil', 'idFacultate'],
                        },
                    ],
                    attributes: ['titluAcademic'],
                },
            ],
            where: {
                dataInceput: { [Op.lte]: new Date() }, // dataInceput <= azi
                dataSfarsit: { [Op.gte]: new Date() }, // dataSfarsit >= azi
                nrLocuriOcupate: { [Op.lt]: db.col('nrMaximLocuri') }, // locuri ocupate < locuri maxime
            },
            order: [['dataSfarsit', 'ASC']],
            attributes: ['id', 'idProfesor', 'dataInceput', 'dataSfarsit', 'nrMaximLocuri', 'nrLocuriOcupate', 'descriere'],
        });

        const prescurtareTitlu = (titlu) => {
            switch (titlu) {
                case 'PROFESOR':
                    return 'Prof. dr.';
                case 'CONFERENTIAR':
                    return 'Conf. dr.';
                case 'LECTOR':
                    return 'Lect. dr.';
                default:
                    return titlu;
            }
        };

        const sesiuniProcesate = sesiuni
            .filter((sesiune) => {
                const utilizator = sesiune.profesori?.utilizatori;
                return utilizator && utilizator.idFacultate === parseInt(idFacultate, 10);
            })
            .map((sesiune) => {
                const utilizator = sesiune.profesori.utilizatori;
                return {
                    id: sesiune.id,
                    idProfesor: sesiune.idProfesor,
                    imagineProfesor: utilizator.urlImagineProfil,
                    profesor: `${prescurtareTitlu(sesiune.profesori.titluAcademic)} ${utilizator.nume.toUpperCase()} ${utilizator.prenume}`,
                    dataInceput: sesiune.dataInceput,
                    dataSfarsit: sesiune.dataSfarsit,
                    nrMaximLocuri: sesiune.nrMaximLocuri,
                    nrLocuriOcupate: sesiune.nrLocuriOcupate,
                    descriere: sesiune.descriere,
                };
            });

        res.json(sesiuniProcesate);
    } catch (err) {
        console.error('Eroare la filtrarea sesiunilor:', err);
        res.status(500).json({ message: 'Eroare internă la server!' });
    }
});

export default router;
