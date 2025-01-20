import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const TrimitereCerere = () => {
    const { idStudent, idSesiune } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        titluPreliminar: '',
        descrierePreliminara: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validareFormular = () => {
        const erori = [];
        if (!formData.titluPreliminar.trim()) {
            erori.push('Titlul preliminar este obligatoriu.');
        }
        if (!formData.descrierePreliminara.trim()) {
            erori.push('Descrierea preliminară este obligatorie.');
        }
        return erori;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const erori = validareFormular();
        if (erori.length > 0) {
            setError(erori.join(' '));
            return;
        }

        try {
            const response = await fetch(`${VITE_API_URL}/cereri`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idStudent,
                    idSesiune,
                    titluPreliminar: formData.titluPreliminar,
                    descrierePreliminara: formData.descrierePreliminara,
                }),
            });

            if (!response.ok) {
                throw new Error('Eroare la trimiterea cererii!');
            }

            setSuccess('Cererea a fost trimisă cu succes!');
            setTimeout(() => navigate(-1), 2000);
        } catch (err) {
            console.error('Eroare la trimiterea cererii:', err);
            setError('A apărut o problemă la trimiterea cererii!');
        }
    };

    return (
        <div>
            <h2>Trimitere cerere</h2>
            <form onSubmit={handleSubmit}>
                <label>Titlu preliminar:</label>
                <input type="text" name="titluPreliminar" value={formData.titluPreliminar} onChange={handleChange} />

                <label>Descriere preliminară:</label>
                <textarea name="descrierePreliminara" value={formData.descrierePreliminara} onChange={handleChange}></textarea>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}

                <button type="submit">Trimite cerere</button>
            </form>

            <button onClick={() => navigate(-1)}>Înapoi</button>
        </div>
    );
};

export default TrimitereCerere;
