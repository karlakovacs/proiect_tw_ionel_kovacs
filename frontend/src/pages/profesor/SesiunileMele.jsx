import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const SesiunileMele = () => {
    const { id } = useParams();

    const [sesiuni, setSesiuni] = useState([]);
    const [eroare, setEroare] = useState('');

    useEffect(() => {
        const fetchSesiuni = async () => {
            try {
                const response = await fetch(`${VITE_API_URL}/sesiuni/profesor/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Eroare la încărcarea sesiunilor.');
                }

                setSesiuni(data);
            } catch (err) {
                console.error('Eroare:', err);
                setEroare('Eroare la încărcarea sesiunilor.');
            }
        };

        fetchSesiuni();
    }, [id]);

    return (
        <div>
            <h2>Sesiunile mele</h2>

            {eroare && <p style={{ color: 'red' }}>{eroare}</p>}

            {sesiuni.length === 0 ? (
                <p>Nu există sesiuni disponibile.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Data de început</th>
                            <th>Data de sfârșit</th>
                            <th>Nr. maxim locuri</th>
                            <th>Nr. locuri ocupate</th>
                            <th>Descriere</th>
                            <th>Data creării</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sesiuni.map((sesiune) => {
                            const dataAzi = new Date();
                            const dataInceput = new Date(sesiune.dataInceput);
                            const dataSfarsit = new Date(sesiune.dataSfarsit);

                            const esteActiva = dataInceput <= dataAzi && dataSfarsit >= dataAzi;

                            return (
                                <tr
                                    key={sesiune.id}
                                    style={{
                                        backgroundColor: esteActiva ? 'yellow' : 'transparent',
                                    }}
                                >
                                    <td>{dataInceput.toLocaleDateString('ro-RO')}</td>
                                    <td>{dataSfarsit.toLocaleDateString('ro-RO')}</td>
                                    <td>{sesiune.nrMaximLocuri}</td>
                                    <td>{sesiune.nrLocuriOcupate}</td>
                                    <td>{sesiune.descriere}</td>
                                    <td>{new Date(sesiune.dataCreare).toLocaleDateString('ro-RO')}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SesiunileMele;
