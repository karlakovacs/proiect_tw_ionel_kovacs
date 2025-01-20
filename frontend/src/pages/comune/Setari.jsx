import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaFileSignature } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const TIP = localStorage.getItem('TIP');

const Setari = () => {
    const { id } = useParams();
    const [urlSemnatura, setUrlSemnatura] = useState(null);
    const [parolaVeche, setParolaVeche] = useState('');
    const [parolaNoua, setParolaNoua] = useState('');
    const [confirmareParola, setConfirmareParola] = useState('');
    const [parolaErrors, setParolaErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDateUtilizator = async () => {
            try {
                const response = await fetch(`${VITE_API_URL}/utilizatori/${id}`);
                const data = await response.json();
                setUrlSemnatura(data.urlSemnatura);
            } catch (err) {
                console.error('Eroare la încărcarea datelor:', err);
            }
        };
        fetchDateUtilizator();
    }, [id]);

    const validateParole = () => {
        const errors = {};

        if (parolaNoua.length < 4) {
            errors.parolaNoua = 'Parola nouă trebuie să aibă cel puțin 6 caractere!';
        }

        if (parolaNoua === parolaVeche) {
            errors.parolaNoua = 'Noua parolă nu poate fi identică cu parola veche!';
        }

        if (parolaNoua !== confirmareParola) {
            errors.confirmareParola = 'Parolele nu coincid!';
        }

        setParolaErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSchimbareParola = async () => {
        if (!validateParole()) return;

        try {
            const response = await fetch(`${VITE_API_URL}/utilizatori/schimbare-parola/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    parolaVeche: parolaVeche,
                    parolaNoua: parolaNoua,
                }),
            });

            if (response.ok) {
                alert('Parola a fost schimbată cu succes!');
                setParolaVeche('');
                setParolaNoua('');
                setConfirmareParola('');
                setParolaErrors({});
            } else {
                alert('Eroare la schimbarea parolei!');
            }
        } catch (err) {
            console.error('Eroare la schimbarea parolei:', err);
            alert('Eroare la schimbarea parolei!');
        }
    };

    const handleDelogare = () => {
        localStorage.removeItem('id');
        localStorage.removeItem('TIP');
        navigate('/auth');
    };

    return (
        <div>
            <h2>Setări</h2>

            <h3>Setare semnătură virtuală</h3>
            {!urlSemnatura ? (
                <p style={{ color: 'red' }}>Nu aveți o semnătură virtuală setată. Vă recomandăm să o adăugați.</p>
            ) : (
                <img
                    src={`${VITE_SUPABASE_URL}/${urlSemnatura}`}
                    alt="Semnătură virtuală"
                    style={{
                        width: '20vw',
                        height: '10vw',
                        border: '1px solid black',
                    }}
                />
            )}

            <button onClick={() => navigate(`/${TIP.toLowerCase()}/${id}/semnatura`)}>
                <FaFileSignature /> Setare semnătură
            </button>

            <h3>Schimbare parolă</h3>
            <form>
                <label>Parola veche:</label>
                <input type="password" value={parolaVeche} onChange={(e) => setParolaVeche(e.target.value)} required />

                <label>Parola nouă:</label>
                <input type="password" value={parolaNoua} onChange={(e) => setParolaNoua(e.target.value)} required />
                {parolaErrors.parolaNoua && <p style={{ color: 'red' }}>{parolaErrors.parolaNoua}</p>}

                <label>Confirmare parolă:</label>
                <input type="password" value={confirmareParola} onChange={(e) => setConfirmareParola(e.target.value)} required />
                {parolaErrors.confirmareParola && <p style={{ color: 'red' }}>{parolaErrors.confirmareParola}</p>}

                <button type="button" onClick={handleSchimbareParola}>
                    Schimbă parola
                </button>
            </form>

            <h3>Deconectare</h3>
            <button onClick={handleDelogare}>
                <FaSignOutAlt /> Deconectare
            </button>
        </div>
    );
};

export default Setari;
