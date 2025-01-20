import express from 'express';
import db from '../DB/ConfigureDB.js';

let router = express.Router();

router.route('/create').get(async (req, res) => {
    try {
        await db.sync({ force: true });
        res.status(201).json({ message: 'OK' });
    } catch (err) {
        console.warn(err.stack);
        res.status(500).json({ message: 'X' });
    }
});

export default router;
