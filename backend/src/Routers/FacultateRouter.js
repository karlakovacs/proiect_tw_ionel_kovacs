import express from 'express';
import { createFacultate, getFacultati, getFacultateById, deleteFacultate, updateFacultate } from '../DataAccess/FacultateDA.js';

let router = express.Router();

router.route('/facultati').post(async (req, res) => {
    const data = req.body;
    const newObject = await createFacultate(data);
    return res.status(201).json(newObject);
});

router.route('/facultati').get(async (req, res) => {
    const listObjects = await getFacultati();
    return res.status(200).json(listObjects);
});

router.route('/facultati/:id').get(async (req, res) => {
    const id = req.params.id;
    const object = await getFacultateById(id);
    if (!object) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json(object);
});

router.route('/facultati/:id').delete(async (req, res) => {
    const id = req.params.id;
    const result = await deleteFacultate(id);
    if (!result) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json({ message: 'OK' });
});

router.route('/facultati/:id').put(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const updated = await updateFacultate(id, data);
    if (!updated) {
        return res.status(404).json({ message: 'X' });
    }
    return res.status(200).json(updated);
});

export default router;
