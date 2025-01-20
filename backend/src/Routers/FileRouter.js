import supabase from '../DB/SupabaseClient.js';
import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/uploads/incarcare-imagine', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Niciun fișier încărcat!' });
        }

        const extensie = path.extname(req.file.originalname);
        const numeFisier = `${uuidv4()}${extensie}`;
        const bucket = 'uploads';
        const folder = 'imagini-profil';

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(`${folder}/${numeFisier}`, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false,
            });

        if (error) throw error;

        res.status(201).json({ url: `${folder}/${numeFisier}` });

    } catch (err) {
        console.error('Eroare la încărcare:', err.message);
        res.status(500).json({ message: 'Eroare internă la server!' });
    }
});

router.post('/uploads/incarcare-semnatura', async (req, res) => {
    try {
        const { semnatura } = req.body;

        if (!semnatura) {
            return res.status(400).json({ message: 'Semnătura este necesară!' });
        }

        const numeFisier = `${uuidv4()}.png`;
        const bucket = 'uploads';
        const folder = 'semnaturi';

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(`${folder}/${numeFisier}`, Buffer.from(semnatura, 'base64'), {
                contentType: 'image/png',
                upsert: false,
            });

        if (error) throw error;

        res.status(201).json({ url: `${folder}/${numeFisier}` });
    } catch (err) {
        console.error('Eroare la salvarea semnăturii:', err.message);
        res.status(500).json({ message: 'Eroare internă la salvare!' });
    }
});

router.delete('/uploads/stergere-fisier', async (req, res) => {
    try {
        const { caleFisier } = req.body;

        if (!caleFisier) {
            return res.status(400).json({ message: 'Calea fișierului este necesară!' });
        }

        const bucket = 'uploads';
        const filePath = caleFisier.replace(`${bucket}/`, '');

        const { error } = await supabase.storage.from(bucket).remove([filePath]);

        if (error) {
            console.error('Eroare la ștergere:', error.message);
            return res.status(500).json({ message: 'Eroare la ștergerea fișierului!' });
        }

        return res.status(200).json({ message: 'Fișier șters cu succes!' });

    } catch (err) {
        console.error('Eroare internă:', err);
        return res.status(500).json({ message: 'Eroare internă la ștergere!' });
    }
});

export default router;