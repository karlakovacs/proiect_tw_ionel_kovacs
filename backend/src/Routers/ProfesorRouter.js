import express from 'express';
import { createProfesor, getProfesori, getProfesorById, deleteProfesor, updateProfesor } from '../DataAccess/ProfesorDA.js';

let router = express.Router();

router.route('/profesori').post(async (req, res) => {
    const data = req.body;
    const newObject = await createProfesor(data);
    return res.status(201).json(newObject);
});

router.route('/profesori').get(async (req, res) => {
    const listObjects = await getProfesori();
    return res.status(200).json(listObjects);
});

router.route('/profesori/:id').get(async (req, res) => {
    const id = req.params.id;
    const object = await getProfesorById(id);
    if (!object) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json(object);
});

router.route('/profesori/:id').delete(async (req, res) => {
    const id = req.params.id;
    const result = await deleteProfesor(id);
    if (!result) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json({ message: 'OK' });
});

router.route('/profesori/:id').put(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const updated = await updateProfesor(id, data);
    if (!updated) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json(updated);
});

export default router;
