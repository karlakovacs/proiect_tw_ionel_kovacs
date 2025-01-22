import "../../css_files/comune/NotFound.css";
import { useNavigate } from "react-router-dom";
import imagine404 from "../../assets/404.svg";

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div className="NotFound">
			<img src={imagine404} alt="Imagine 404" />
			<br />
			<button onClick={() => navigate("/")}>Înapoi</button>
		</div>
	);
};

export default NotFound;
