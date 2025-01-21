import "../../css_files/student/Sesiuni.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import imagineDefault from "../../assets/profile-placeholder.svg";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const Sesiuni = () => {
	const { id } = useParams();

	const [sesiuni, setSesiuni] = useState([]);
	const [cereri, setCereri] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [idFacultate, setIdFacultate] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchFacultate = async () => {
			try {
				const response = await fetch(
					`${VITE_API_URL}/utilizatori/${id}`
				);
				if (!response.ok) {
					throw new Error(
						"Eroare la obținerea datelor utilizatorului!"
					);
				}

				const data = await response.json();
				setIdFacultate(data.idFacultate);
			} catch (err) {
				console.error("Eroare:", err);
				setError(err.message);
			}
		};

		fetchFacultate();
	}, [id]);

	useEffect(() => {
		if (!idFacultate) return;

		const fetchSesiuni = async () => {
			try {
				const response = await fetch(
					`${VITE_API_URL}/sesiuni/filtrare/${idFacultate}`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
					}
				);

				if (!response.ok) {
					throw new Error("Eroare la preluarea sesiunilor!");
				}

				const data = await response.json();
				setSesiuni(data);
			} catch (err) {
				console.error("Eroare:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchSesiuni();
	}, [idFacultate]);

	useEffect(() => {
		const fetchCereri = async () => {
			try {
				const response = await fetch(
					`${VITE_API_URL}/cereri/student/${id}`
				);
				if (!response.ok) {
					throw new Error("Eroare la preluarea cererilor!");
				}

				const data = await response.json();
				setCereri(data);
			} catch (err) {
				console.error("Eroare:", err);
				setError(err.message);
			}
		};

		if (sesiuni.length > 0) {
			fetchCereri();
		}
	}, [id, sesiuni]);

	const handleTrimiteCerere = (idSesiune) => {
		navigate(`/student/${id}/trimitere-cerere/${id}/${idSesiune}`);
	};

	const handleVizualizareCerere = (idCerere, idSesiune, idProfesor) => {
		navigate(`/cerere/${idCerere}/${id}/${idSesiune}/${idProfesor}`);
	};

	const existaCerere = (idSesiune) => {
		return cereri.find((cerere) => cerere.idSesiune === idSesiune);
	};

	const areCerereAprobata = () => {
		return cereri.some((cerere) => cerere.statusPreliminar === "APROBATA");
	};

	if (loading) {
		return <p>Se încarcă sesiunile...</p>;
	}

	if (error) {
		return <p style={{ color: "red" }}>{error}</p>;
	}

	return (
		<div className="Sesiuni">
			<h2>Sesiuni de înscriere</h2>
			{sesiuni.length === 0 ? (
				<p>Nu există sesiuni disponibile.</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>Profesor</th>
							<th>Data de început</th>
							<th>Data de sfârșit</th>
							<th>Nr. maxim locuri</th>
							<th>Nr. locuri ocupate</th>
							<th>Descriere</th>
							<th>Acțiuni</th>
						</tr>
					</thead>
					<tbody>
						{sesiuni.map((sesiune) => {
							const cerereExistenta = existaCerere(sesiune.id);
							const cerereAprobata = areCerereAprobata();

							return (
								<tr key={sesiune.id}>
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
													sesiune.imagineProfesor
														? `${VITE_SUPABASE_URL}/${sesiune.imagineProfesor}`
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
											<span>{sesiune.profesor}</span>
										</div>
									</td>
									<td>
										{new Date(
											sesiune.dataInceput
										).toLocaleDateString("ro-RO")}
									</td>
									<td>
										{new Date(
											sesiune.dataSfarsit
										).toLocaleDateString("ro-RO")}
									</td>
									<td>{sesiune.nrMaximLocuri}</td>
									<td>{sesiune.nrLocuriOcupate}</td>
									<td>{sesiune.descriere}</td>
									<td>
										{cerereExistenta ? (
											<button
												onClick={() =>
													handleVizualizareCerere(
														cerereExistenta.id,
														sesiune.id,
														sesiune.idProfesor
													)
												}
											>
												Vizualizare cerere
											</button>
										) : cerereAprobata ? (
											<span>
												Nu poți trimite cereri
												suplimentare
											</span>
										) : (
											<button
												onClick={() =>
													handleTrimiteCerere(
														sesiune.id
													)
												}
											>
												Trimite cerere
											</button>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default Sesiuni;
