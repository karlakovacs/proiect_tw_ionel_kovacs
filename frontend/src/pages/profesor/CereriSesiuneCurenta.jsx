import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import imagineDefault from "../../assets/profile-placeholder.svg";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const CereriSesiuneCurenta = () => {
	const { id } = useParams();

	const navigate = useNavigate();
	const [cereri, setCereri] = useState([]);
	const [sesiuneActiva, setSesiuneActiva] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchSesiuneCurenta = async () => {
			try {
				const response = await fetch(
					`${VITE_API_URL}/sesiuni/sesiune-curenta/${id}`
				);
				if (!response.ok) {
					if (response.status === 404) {
						setSesiuneActiva(null);
					} else {
						throw new Error(
							"Eroare la obținerea sesiunii curente!"
						);
					}
				} else {
					const sesiune = await response.json();
					setSesiuneActiva(sesiune);
				}
			} catch (err) {
				console.error("Eroare:", err.message);
				setError(err.message);
			}
		};

		fetchSesiuneCurenta();
	}, [id]);

	useEffect(() => {
		if (!sesiuneActiva) {
			setLoading(false);
			return;
		}

		const fetchCereri = async () => {
			try {
				console.log("Sesiune activa:", sesiuneActiva);
				const response = await fetch(
					`${VITE_API_URL}/cereri/sesiune/${sesiuneActiva.idSesiune}`
				);
				if (!response.ok)
					throw new Error("Eroare la obținerea cererilor!");

				const data = await response.json();
				setCereri(data);
			} catch (err) {
				console.error("Eroare:", err.message);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCereri();
	}, [sesiuneActiva]);

	const handleRaspundereCerere = (idCerere, idStudent) => {
		navigate(
			`/cerere/${idCerere}/${idStudent}/${sesiuneActiva.idSesiune}/${id}`
		);
	};

	if (loading) {
		return <p>Se încarcă datele...</p>;
	}

	if (error) {
		return <p style={{ color: "red" }}>{error}</p>;
	}

	if (!sesiuneActiva) {
		return <p>Nu aveți o sesiune curentă activă.</p>;
	}

	return (
		<div>
			<h2>Cererile din sesiunea curentă</h2>
			{cereri.length === 0 ? (
				<p>Nu există cereri disponibile.</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>Student</th>
							<th>Forma învățământ</th>
							<th>An înmatriculare</th>
							<th>Data trimiterii</th>
							<th>Status preliminar</th>
							<th>Detalii</th>
						</tr>
					</thead>
					<tbody>
						{cereri.map((cerere) => (
							<tr
								key={cerere.idCerere}
								className={`${
									cerere.statusPreliminar === "RESPINSA"
										? "respinsa"
										: cerere.statusPreliminar ===
										  "IN_ASTEPTARE"
										? "in-asteptare"
										: "aprobata"
								}`}
							>
								<td>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "10px",
										}}
									>
										<img
											src={
												cerere.imagineStudent
													? `${VITE_SUPABASE_URL}/${cerere.imagineStudent}`
													: imagineDefault
											}
											alt="Profil Student"
											style={{
												width: "40px",
												height: "40px",
												borderRadius: "50%",
												objectFit: "cover",
											}}
										/>
										<span>{cerere.student}</span>
									</div>
								</td>
								<td>{cerere.formaInvatamant}</td>
								<td>{cerere.anInmatriculare}</td>
								<td>
									{new Date(
										cerere.dataTrimitereStudent
									).toLocaleDateString("ro-RO")}{" "}
									{new Date(
										cerere.dataTrimitereStudent
									).toLocaleTimeString("ro-RO", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</td>
								<td>{cerere.statusPreliminar}</td>
								<td>
									<button
										onClick={() =>
											handleRaspundereCerere(
												cerere.idCerere,
												cerere.idStudent
											)
										}
									>
										{cerere.statusPreliminar ===
										"IN_ASTEPTARE"
											? "Răspundere cerere"
											: "Vizualizare cerere"}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default CereriSesiuneCurenta;
