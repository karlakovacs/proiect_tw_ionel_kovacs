import '../../css_files/comune/CereriFinale.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const TIP = localStorage.getItem("TIP");

const CereriFinale = ({ idCerere }) => {
	const [cereriFinale, setCereriFinale] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [titluFinal, setTitluFinal] = useState("");
	const [eroareTitlu, setEroareTitlu] = useState("");
    const navigate = useNavigate();

	useEffect(() => {
		const fetchCereriFinale = async () => {
			try {
				const response = await fetch(
					`${VITE_API_URL}/cereri-finale/lista/${idCerere}`
				);
				if (!response.ok)
					throw new Error("Eroare la încărcarea cererilor finale!");
				const data = await response.json();
				setCereriFinale(data);
			} catch (err) {
				console.error("Eroare:", err.message);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCereriFinale();
	}, [idCerere]);

	if (loading) {
		return <p>Se încarcă cererile finale...</p>;
	}

	if (error) {
		return <p style={{ color: "red" }}>{error}</p>;
	}

	const handleRaspuns = async (idCerereFinala, statusNou) => {
        try {
            const response = await fetch(
                `${VITE_API_URL}/cereri-finale/${idCerereFinala}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        statusFinal: statusNou,
                        dataRaspunsProfesor: new Date().toISOString(),
                    }),
                }
            );
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Eroare la actualizarea cererii!"
                );
            }

            if (statusNou === "APROBATA") {
                const semnareResponse = await fetch(
                    `${VITE_API_URL}/cereri-finale/semnare/${idCerereFinala}`,
                    {
                        method: "POST",
                    }
                );
    
                if (!semnareResponse.ok) {
                    const errorData = await semnareResponse.json();
                    throw new Error(
                        errorData.message || "Eroare la semnarea cererii!"
                    );
                }
    
                alert("Cererea a fost semnată cu succes!");
            }
    
            alert(
                `Cererea a fost ${
                    statusNou === "APROBATA" ? "aprobată" : "respinsă"
                } cu succes!`
            );
            navigate(0);
        } catch (err) {
            console.error("Eroare:", err.message);
            alert(`A apărut o eroare: ${err.message}`);
        }
    };    

	const handleAdaugaCerere = async (titluFinal) => {
		try {
			const response = await fetch(`${VITE_API_URL}/cereri-finale`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					idCerere: idCerere,
					titluFinal: titluFinal,
                    urlCerereStudent: 'placeholder',
				}),
			});

			if (!response.ok) {
				throw new Error("Eroare la adăugarea cererii finale!");
			}

			const { idCerereFinala } = await response.json();

			if (!idCerereFinala) {
				throw new Error("ID-ul cererii finale nu a fost returnat!");
			}

			const fileResponse = await fetch(
				`${VITE_API_URL}/cereri-finale/generare/${idCerereFinala}`,
				{
					method: "POST",
				}
			);

			if (!fileResponse.ok) {
				throw new Error("Eroare la generarea cererii PDF!");
			}

			alert("Cererea a fost adăugată și generată cu succes!");
			navigate(0);
		} catch (err) {
			console.error("Eroare:", err.message);
			alert("A apărut o eroare: " + err.message);
		}
	};

	const handleTrimite = () => {
		if (titluFinal.length < 10) {
			setEroareTitlu(
				"Titlul final trebuie să conțină cel puțin 10 caractere!"
			);
			return;
		}

		handleAdaugaCerere(titluFinal);
		setTitluFinal("");
		setEroareTitlu("");
	};

	return (
		<div className='CereriFinale'>
			<h2>Cereri finale</h2>

			{cereriFinale.length === 0 ? (
				<p>Nu există nicio cerere finală încă.</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>Titlu final</th>
							<th>Status final</th>
							<th>Fișier PDF student</th>
							<th>Dată încărcare student</th>
							<th>Fișier PDF profesor</th>
							<th>Dată răspuns profesor</th>
							<th>Acțiuni</th>
						</tr>
					</thead>
					<tbody>
						{cereriFinale.map((cerere) => (
							<tr key={cerere.id}>
								<td>{cerere.titluFinal}</td>
								<td>{cerere.statusFinal}</td>
								<td>
									<a
										href={`${VITE_SUPABASE_URL}/${cerere.urlCerereStudent}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										Vezi PDF
									</a>
								</td>
								<td>
									{new Date(
										cerere.dataIncarcareStudent
									).toLocaleDateString("ro-RO")}{" "}
									{new Date(
										cerere.dataIncarcareStudent
									).toLocaleTimeString("ro-RO", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</td>
								<td>
									{cerere.urlCerereProfesor ? (
										<a
											href={`${VITE_SUPABASE_URL}/${cerere.urlCerereProfesor}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											Vezi PDF
										</a>
									) : (
										"Nu există"
									)}
								</td>
								<td>
									{cerere.dataRaspunsProfesor
										? `${new Date(
												cerere.dataRaspunsProfesor
										  ).toLocaleDateString(
												"ro-RO"
										  )} ${new Date(
												cerere.dataRaspunsProfesor
										  ).toLocaleTimeString("ro-RO", {
												hour: "2-digit",
												minute: "2-digit",
										  })}`
										: "Nu există"}
								</td>
								<td>
									{TIP === "PROFESOR" &&
										cerere.statusFinal ===
											"IN_ASTEPTARE" && (
											<div>
												<button
													style={{
														marginRight: "10px",
													}}
													onClick={() =>
														handleRaspuns(
															cerere.id,
															"APROBATA"
														)
													}
												>
													Aprobați
												</button>
												<button
													onClick={() =>
														handleRaspuns(
															cerere.id,
															"RESPINSA"
														)
													}
												>
													Respingeți
												</button>
											</div>
										)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
			{TIP === "STUDENT" &&
				cereriFinale.every(
					(cerere) => cerere.statusFinal === "RESPINSA"
				) && (
					<div>
						<h3>Adaugă o cerere nouă.</h3>
						<div>
							<input
								type="text"
								placeholder="Introduceți titlul final"
								value={titluFinal}
								onChange={(e) => setTitluFinal(e.target.value)}
								style={{
									width: "100%",
									padding: "8px",
									marginBottom: "10px",
								}}
							/>
							{eroareTitlu && (
								<p style={{ color: "red" }}>{eroareTitlu}</p>
							)}
							<button onClick={handleTrimite}>Trimite</button>
						</div>
					</div>
				)}
		</div>
	);
};

export default CereriFinale;
