import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import imagineDefault from "../../assets/profile-placeholder.svg";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const Cereri = () => {
	const { id } = useParams();
	const [cereri, setCereri] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCereri = async () => {
			try {
				const response = await fetch(
					`${VITE_API_URL}/cereri/student/detalii/${id}`
				);
				if (!response.ok) {
					throw new Error("Eroare la preluarea cererilor!");
				}
				const data = await response.json();
				setCereri(data);
			} catch (err) {
				console.error("Eroare:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCereri();
	}, [id]);

	const handleVizualizareCerere = (idCerere, idSesiune, idProfesor) => {
		navigate(`/cerere/${idCerere}/${id}/${idSesiune}/${idProfesor}`);
	};

	if (loading) {
		return <p>Se încarcă cererile...</p>;
	}

	if (error) {
		return <p style={{ color: "red" }}>{error}</p>;
	}

	return (
		<div>
			<h2>Cererile mele</h2>
			{cereri.length === 0 ? (
				<p>Nu există cereri disponibile.</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>Profesor</th>
							<th>Data de început</th>
							<th>Data de sfârșit</th>
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
												cerere.imagineProfesor
													? `${VITE_SUPABASE_URL}/${cerere.imagineProfesor}`
													: imagineDefault
											}
											alt="Profil Profesor"
											style={{
												width: "40px",
												height: "40px",
												borderRadius: "50%",
												objectFit: "cover",
											}}
										/>
										<span>{cerere.profesor}</span>
									</div>
								</td>
								<td>
									{new Date(
										cerere.dataInceput
									).toLocaleDateString("ro-RO")}
								</td>
								<td>
									{new Date(
										cerere.dataSfarsit
									).toLocaleDateString("ro-RO")}
								</td>
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
											handleVizualizareCerere(
												cerere.idCerere,
												cerere.idSesiune,
												cerere.idProfesor
											)
										}
									>
										Vizualizare cerere
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

export default Cereri;
