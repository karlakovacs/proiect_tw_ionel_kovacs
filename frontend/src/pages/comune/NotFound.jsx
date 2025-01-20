import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>404 - Pagina nu a fost găsită</h1>
            <p>Se pare că pagina căutată nu există.</p>
            <button onClick={() => navigate('/')}>Înapoi</button>
        </div>
    );
};

export default NotFound;
