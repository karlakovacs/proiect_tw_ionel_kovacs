import "../../css_files/profesor/CreareSesiune.css";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave } from "react-icons/fa";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const CreareSesiune = () => {
	const { id } = useParams();

	const [formData, setFormData] = useState({
		dataInceput: "",
		dataSfarsit: "",
		nrMaximLocuri: "",
		descriere: "",
	});

	const [validari, setValidari] = useState({});
	const [eroare, setEroare] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const validareFormular = () => {
		const erori = {};

		if (!formData.dataInceput) {
			erori.dataInceput = "Selectează data de început!";
		} else {
			const azi = new Date();
			azi.setHours(0, 0, 0, 0);

			const dataInceput = new Date(formData.dataInceput);
			dataInceput.setHours(0, 0, 0, 0);

			if (dataInceput < azi) {
				erori.dataInceput =
					"Data de început trebuie să fie după data de astăzi!";
			}
		}

		if (!formData.dataSfarsit) {
			erori.dataSfarsit = "Selectează data de sfârșit!";
		} else if (
			new Date(formData.dataInceput) >= new Date(formData.dataSfarsit)
		) {
			erori.dataSfarsit =
				"Data de sfârșit trebuie să fie după data de început!";
		}

		const nrMaxim = parseInt(formData.nrMaximLocuri, 10);
		if (isNaN(nrMaxim) || nrMaxim <= 0) {
			erori.nrMaximLocuri =
				"Numărul maxim de locuri trebuie să fie un număr pozitiv!";
		}

		if (!formData.descriere.trim()) {
			erori.descriere = "Descrierea nu poate fi goală!";
		} else if (formData.descriere.length < 10) {
			erori.descriere =
				"Descrierea trebuie să aibă cel puțin 10 caractere!";
		}

		setValidari(erori);
		return Object.keys(erori).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validareFormular()) {
			return;
		}

		try {
			console.log(
				new Date(formData.dataInceput).setHours(0, 0, 0, 0),
				new Date(formData.dataSfarsit).setHours(23, 59, 59, 999)
			);

			const response = await fetch(`${VITE_API_URL}/sesiuni/creare`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					idProfesor: id,
					dataInceput: new Date(formData.dataInceput).setHours(
						0,
						0,
						0,
						0
					),
					dataSfarsit: new Date(formData.dataSfarsit).setHours(
						23,
						59,
						59,
						999
					),
					nrMaximLocuri: parseInt(formData.nrMaximLocuri, 10),
					descriere: formData.descriere,
				}),
			});

			if (!response.ok) {
				throw new Error("Crearea sesiunii a eșuat!");
			}

			alert("Sesiunea a fost creată cu succes!");
			navigate(`/profesor/${id}/sesiunile-mele`);
		} catch (err) {
			console.error("Eroare la crearea sesiunii:", err);
			setEroare("Eroare la crearea sesiunii!");
		}
	};

	return (
		<div className="CreareSesiune">
			<h2>Creare sesiune</h2>
			{eroare && <p style={{ color: "red" }}>{eroare}</p>}
			<form onSubmit={handleSubmit}>
				<label>Data de început:</label>
				<input
					type="date"
					name="dataInceput"
					value={formData.dataInceput}
					onChange={handleChange}
				/>
				{validari.dataInceput && (
					<p style={{ color: "red" }}>{validari.dataInceput}</p>
				)}

				<br />

				<label>Data de sfârșit:</label>
				<input
					type="date"
					name="dataSfarsit"
					value={formData.dataSfarsit}
					onChange={handleChange}
				/>
				{validari.dataSfarsit && (
					<p style={{ color: "red" }}>{validari.dataSfarsit}</p>
				)}

				<br />

				<label>Număr maxim de locuri:</label>
				<input
					type="number"
					name="nrMaximLocuri"
					value={formData.nrMaximLocuri}
					onChange={handleChange}
				/>
				{validari.nrMaximLocuri && (
					<p style={{ color: "red" }}>{validari.nrMaximLocuri}</p>
				)}

				<br />

				<label>Descriere:</label>
				<textarea
					name="descriere"
					value={formData.descriere}
					onChange={handleChange}
				/>
				{validari.descriere && (
					<p style={{ color: "red" }}>{validari.descriere}</p>
				)}

				<br />

				<button type="submit">
					<FaSave /> Creează sesiunea
				</button>
			</form>
		</div>
	);
};

export default CreareSesiune;
