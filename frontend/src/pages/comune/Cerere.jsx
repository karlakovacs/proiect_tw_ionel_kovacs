import "../../css_files/comune/Cerere.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CereriFinale from "./CereriFinale";
import { FaCheck, FaArrowLeft } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Cerere = () => {
	const { idCerere, idStudent, idSesiune, idProfesor } = useParams();
	const navigate = useNavigate();

	const [cerere, setCerere] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [motivRespingere, setMotivRespingere] = useState("");
	const [validareMotiv, setValidareMotiv] = useState("");
	const [mesajSucces, setMesajSucces] = useState("");

	const ID = parseInt(localStorage.getItem("ID"), 0);
	const TIP = localStorage.getItem("TIP");

	useEffect(() => {
		const getCerereData = async () => {
			try {
				const cerereResponse = await fetch(
					`${VITE_API_URL}/cereri/info/${idCerere}/${idStudent}/${idProfesor}`
				);
				if (!cerereResponse.ok) throw new Error("Cererea nu există!");
				const cerereData = await cerereResponse.json();

				const sesiuneResponse = await fetch(
					`${VITE_API_URL}/sesiuni/${idSesiune}`
				);
				if (!sesiuneResponse.ok) throw new Error("Sesiunea nu există!");
				const sesiuneData = await sesiuneResponse.json();

				const esteStudent =
					TIP === "STUDENT" &&
					ID === parseInt(idStudent, 0) &&
					cerereData.idSesiune === parseInt(idSesiune, 0);
				const esteProfesor =
					TIP === "PROFESOR" &&
					ID === parseInt(idProfesor, 0) &&
					sesiuneData.idProfesor === parseInt(idProfesor, 0);
				if (!esteStudent && !esteProfesor)
					throw new Error("Acces interzis!");

				setCerere(cerereData);
			} catch (err) {
				console.error("Eroare verificare acces:", err.message);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		getCerereData();
	}, [idCerere, idStudent, idSesiune, idProfesor, TIP, ID]);

	const handleAproba = async () => {
		try {
			const response = await fetch(
				`${VITE_API_URL}/cereri/aprobare/${idCerere}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						statusPreliminar: "APROBATA",
						dataRaspunsProfesor: new Date(),
					}),
				}
			);

			if (!response.ok) throw new Error("Eroare la aprobarea cererii!");

			setMesajSucces("Cererea a fost aprobată cu succes!");
			setTimeout(() => navigate(-1), 2000);
		} catch (err) {
			console.error("Eroare:", err.message);
			setError(err.message);
		}
	};

	const handleRespinge = async () => {
		if (motivRespingere.length < 10) {
			setValidareMotiv(
				"Motivul trebuie să conțină cel puțin 10 caractere!"
			);
			return;
		}

		try {
			const response = await fetch(`${VITE_API_URL}/cereri/${idCerere}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					statusPreliminar: "RESPINSA",
					motivRespingere: motivRespingere,
					dataRaspunsProfesor: new Date(),
				}),
			});

			if (!response.ok) throw new Error("Eroare la respingerea cererii!");

			setMesajSucces("Cererea a fost respinsă cu succes!");
			setTimeout(() => navigate(-1), 2000);
		} catch (err) {
			console.error("Eroare:", err.message);
			setError(err.message);
		}
	};

	if (loading) {
		return <p>Se încarcă cererea...</p>;
	}

	if (error) {
		return (
			<div>
				<p style={{ color: "red" }}>{error}</p>
				<button onClick={() => navigate(-1)}>Înapoi</button>
			</div>
		);
	}

	return (
		<div className="Cerere">
			<h2>Detalii cerere</h2>
			{mesajSucces && <p style={{ color: "green" }}>{mesajSucces}</p>}
			<p>
				<strong>Nume student:</strong> {cerere.numeStudent}
			</p>
			<p>
				<strong>Nume profesor:</strong> {cerere.numeProfesor}
			</p>
			<p>
				<strong>Titlu preliminar:</strong> {cerere.titluPreliminar}
			</p>
			<p>
				<strong>Descriere preliminară:</strong>{" "}
				{cerere.descrierePreliminara}
			</p>
			<p>
				<strong>Status:</strong> {cerere.statusPreliminar}
			</p>
			<p>
				<strong>Data trimiterii:</strong>{" "}
				{new Date(cerere.dataTrimitereStudent).toLocaleDateString(
					"ro-RO"
				)}{" "}
				{new Date(cerere.dataTrimitereStudent).toLocaleTimeString(
					"ro-RO",
					{
						hour: "2-digit",
						minute: "2-digit",
					}
				)}
			</p>
			{cerere.statusPreliminar === "RESPINSA" &&
				cerere.motivRespingere && (
					<p>
						<strong>Motiv respingere:</strong>{" "}
						{cerere.motivRespingere}
					</p>
				)}
			{cerere.dataRaspunsProfesor && (
				<p>
					<strong>Data răspuns profesor:</strong>{" "}
					{new Date(cerere.dataRaspunsProfesor).toLocaleDateString(
						"ro-RO"
					)}{" "}
					{new Date(cerere.dataRaspunsProfesor).toLocaleTimeString(
						"ro-RO",
						{
							hour: "2-digit",
							minute: "2-digit",
						}
					)}
				</p>
			)}

			{TIP === "PROFESOR" &&
				cerere.statusPreliminar === "IN_ASTEPTARE" && (
					<div>
						<button
							className="buton-aprobare"
							onClick={handleAproba}
						>
							<FaCheck />
						</button>
						<button
							className="buton-respingere"
							onClick={handleRespinge}
						>
							<FaXmark />
						</button>
						<div style={{ marginTop: "10px" }}>
							<textarea
								placeholder="Introduceți motivul respingerii..."
								value={motivRespingere}
								onChange={(e) =>
									setMotivRespingere(e.target.value)
								}
								rows="3"
								style={{ width: "100%" }}
							/>
							{validareMotiv && (
								<p style={{ color: "red" }}>{validareMotiv}</p>
							)}
						</div>
					</div>
				)}

			{cerere.statusPreliminar === "APROBATA" && (
				<CereriFinale idCerere={idCerere} />
			)}
			<button className="inapoi" onClick={() => navigate(-1)}>
				<FaArrowLeft /> Înapoi
			</button>
		</div>
	);
};

export default Cerere;
