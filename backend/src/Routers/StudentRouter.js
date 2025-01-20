import express from 'express';
import { createStudent, getStudenti, getStudentById, deleteStudent, updateStudent } from '../DataAccess/StudentDA.js';

let router = express.Router();

router.route('/studenti').post(async (req, res) => {
    const data = req.body;
    const newObject = await createStudent(data);
    return res.status(201).json(newObject);
});

router.route('/studenti').get(async (req, res) => {
    const listObjects = await getStudenti();
    return res.status(200).json(listObjects);
});

router.route('/studenti/:id').get(async (req, res) => {
    const id = req.params.id;
    const object = await getStudentById(id);
    if (!object) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json(object);
});

router.route('/studenti/:id').delete(async (req, res) => {
    const id = req.params.id;
    const result = await deleteStudent(id);
    if (!result) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json({ message: 'OK' });
});

router.route('/studenti/:id').put(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const updated = await updateStudent(id, data);
    if (!updated) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json(updated);
});

export default router;
