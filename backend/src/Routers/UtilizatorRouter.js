import express from 'express';
import { createUtilizator, getUtilizatori, getUtilizatorById, deleteUtilizator, updateUtilizator, getUtilizatorByEmail } from '../DataAccess/UtilizatorDA.js';
import { createStudent, getStudentById } from '../DataAccess/StudentDA.js';
import { createProfesor, getProfesorById } from '../DataAccess/ProfesorDA.js';
import { getFacultateById } from '../DataAccess/FacultateDA.js';
import bcrypt from 'bcrypt';

let router = express.Router();

router.route('/utilizatori').post(async (req, res) => {
    const data = req.body;
    const newObject = await createUtilizator(data);
    return res.status(201).json(newObject);
});

router.route('/utilizatori').get(async (req, res) => {
    const listObjects = await getUtilizatori();
    return res.status(200).json(listObjects);
});

router.route('/utilizatori/:id').get(async (req, res) => {
    const id = req.params.id;
    const object = await getUtilizatorById(id);
    if (!object) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json(object);
});

router.route('/utilizatori/:id').delete(async (req, res) => {
    const id = req.params.id;
    const result = await deleteUtilizator(id);
    if (!result) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json({ message: 'OK' });
});

router.route('/utilizatori/:id').put(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const updated = await updateUtilizator(id, data);
    if (!updated) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json(updated);
});

/////////////////////////////////////////////////////////

router.route('/utilizatori/signup').post(async (req, res) => {
    const { nume, prenume, email, parola, idFacultate, tip, formaInvatamant, anInmatriculare, titluAcademic } = req.body;

    try {
        const utilizatorExistent = await getUtilizatorByEmail(email);
        if (utilizatorExistent) {
            return res.status(400).json({ message: 'Email-ul există deja.' });
        }

        const salt = await bcrypt.genSalt(10);
        const parolaHashed = await bcrypt.hash(parola, salt);

        const utilizatorNou = await createUtilizator({
            nume,
            prenume,
            email,
            parola: parolaHashed,
            idFacultate,
            tip,
        });

        if (tip === 'STUDENT') {
            await createStudent({
                id: utilizatorNou.id,
                formaInvatamant: formaInvatamant,
                anInmatriculare: anInmatriculare,
            });
        } else if (tip === 'PROFESOR') {
            await createProfesor({
                id: utilizatorNou.id,
                titluAcademic: titluAcademic,
            });
        }

        res.status(201).json({
            id: utilizatorNou.id,
            tip: utilizatorNou.tip,
            message: 'Utilizator înregistrat cu succes!',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Eroare la server.' });
    }
});

router.route('/utilizatori/login').post(async (req, res) => {
    const { email, parola } = req.body;

    try {
        const utilizator = await getUtilizatorByEmail(email);
        if (!utilizator) {
            return res.status(404).json({ message: 'Utilizatorul nu există.' });
        }

        const parolaValida = await bcrypt.compare(parola, utilizator.parola);
        if (!parolaValida) {
            return res.status(401).json({ message: 'Email sau parolă incorecte!' });
        }

        res.status(200).json({
            id: utilizator.id,
            tip: utilizator.tip,
            message: 'Autentificare reușită!',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Eroare la server.' });
    }
});

router.route('/utilizatori/profil/:id').get(async (req, res) => {
    try {
        const id = req.params.id;

        const utilizator = await getUtilizatorById(id);
        if (!utilizator) {
            return res.status(404).json({ message: 'Utilizatorul nu a fost găsit.' });
        }

        let facultate = null;
        if (utilizator.idFacultate) {
            const facultateDinDB = await getFacultateById(utilizator.idFacultate);
            facultate = facultateDinDB ? facultateDinDB.denumire : 'Necunoscută';
        }

        let profil = {
            nume: utilizator.nume,
            prenume: utilizator.prenume,
            email: utilizator.email,
            urlImagineProfil: utilizator.urlImagineProfil || null,
            facultate: facultate,
            tip: utilizator.tip,
            dataInregistrare: utilizator.dataInregistrare,
        };

        if (utilizator.tip === 'STUDENT') {
            const student = await getStudentById(id);
            if (student) {
                profil.formaInvatamant = student.formaInvatamant;
                profil.anInmatriculare = student.anInmatriculare;
            }
        } else if (utilizator.tip === 'PROFESOR') {
            const profesor = await getProfesorById(id);
            if (profesor) {
                profil.titluAcademic = profesor.titluAcademic;
            }
        }

        return res.status(200).json(profil);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Eroare la server.' });
    }
});

router.route('/utilizatori/update/:id').put(async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const utilizator = await getUtilizatorById(id);
        if (!utilizator) {
            return res.status(404).json({ message: 'Utilizatorul nu a fost găsit.' });
        }

        await utilizator.update({
            nume: data.nume,
            prenume: data.prenume,
            email: data.email,
            urlImagineProfil: data.urlImagineProfil,
        });

        if (utilizator.tip === 'STUDENT') {
            const student = await getStudentById(id);
            if (student) {
                await student.update({
                    formaInvatamant: data.formaInvatamant || student.formaInvatamant,
                    anInmatriculare: data.anInmatriculare || student.anInmatriculare,
                });
            }
        } else if (utilizator.tip === 'PROFESOR') {
            const profesor = await getProfesorById(id);
            if (profesor) {
                await profesor.update({
                    titluAcademic: data.titluAcademic || profesor.titluAcademic,
                });
            }
        }

        return res.status(200).json({ message: 'Profil actualizat cu succes!' });
    } catch (err) {
        console.error('Eroare la actualizarea utilizatorului:', err);
        return res.status(500).json({ message: 'Eroare internă de server.' });
    }
});

router.put('/utilizatori/schimbare-parola/:id', async (req, res) => {
    const { id } = req.params;
    const { parolaVeche, parolaNoua } = req.body;

    try {
        const utilizator = await getUtilizatorById(id);

        if (!utilizator) {
            return res.status(404).json({ message: 'Utilizatorul nu există!' });
        }

        const parolaValida = await bcrypt.compare(parolaVeche, utilizator.parola);
        if (!parolaValida) {
            return res.status(400).json({ message: 'Parola veche este incorectă!' });
        }

        const salt = await bcrypt.genSalt(10);
        const parolaHashed = await bcrypt.hash(parolaNoua, salt);
        await utilizator.update({ parola: parolaHashed });

        return res.status(200).json({ message: 'Parola a fost schimbată cu succes!' });
    } catch (err) {
        console.error('Eroare la schimbarea parolei:', err);
        return res.status(500).json({ message: 'Eroare internă de server.' });
    }
});

export default router;
