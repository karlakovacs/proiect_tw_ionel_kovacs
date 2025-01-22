import "../../css_files/comune/Acasa.css";
import welcome from "../../assets/welcome.svg";

const Acasa = () => {
	return (
		<div className="Acasa">
			<h2>Bun venit!</h2>
            <img src={welcome} alt="Welcome" />
		</div>
	);
};

export default Acasa;
