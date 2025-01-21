import "../../css_files/comune/NotFound.css";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div className="NotFound">
			<h1>404 - Pagina nu a fost găsită</h1>
			<p>Se pare că pagina căutată nu există.</p>
			<button onClick={() => navigate("/")}>Înapoi</button>
		</div>
	);
};

export default NotFound;
