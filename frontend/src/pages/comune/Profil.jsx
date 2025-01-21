import "../../css_files/comune/Profil.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import imagineDefault from "../../assets/profile-placeholder.svg";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const TIP = localStorage.getItem("TIP");

const Profil = () => {
	const { id } = useParams();

	const [utilizator, setUtilizator] = useState(null);

	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await fetch(
					`${VITE_API_URL}/utilizatori/profil/${id}`
				);

				const data = await response.json();
				setUtilizator(data);
				setLoading(false);
			} catch (err) {
				console.error("Eroare la încărcarea profilului:", err);
				setLoading(false);
			}
		};

		fetchUserData();
	}, [id]);

	if (loading) {
		return <p>Se încarcă...</p>;
	}

	return (
		<div className="Profil">
			<h2>Profilul utilizatorului</h2>

			<img
				src={
					utilizator.urlImagineProfil
						? `${VITE_SUPABASE_URL}/${utilizator.urlImagineProfil}`
						: imagineDefault
				}
				alt="Profil"
				style={{
					width: "100px",
					height: "100px",
					borderRadius: "50%",
					objectFit: "cover",
				}}
			/>

			<p>
				<strong>Nume:</strong> {utilizator.nume}
			</p>
			<p>
				<strong>Prenume:</strong> {utilizator.prenume}
			</p>
			<p>
				<strong>Email:</strong> {utilizator.email}
			</p>
			<p>
				<strong>Facultate:</strong> {utilizator.facultate}
			</p>
			<p>
				<strong>Tip:</strong> {utilizator.tip}
			</p>
			<p>
				<strong>Data înregistrării:</strong>{" "}
				{new Date(utilizator.dataInregistrare).toLocaleDateString(
					"ro-RO"
				)}
			</p>

			{utilizator.tip === "STUDENT" && (
				<>
					<p>
						<strong>Forma de învățământ:</strong>{" "}
						{utilizator.formaInvatamant}
					</p>
					<p>
						<strong>An de înmnatriculare:</strong>{" "}
						{utilizator.anInmatriculare}
					</p>
				</>
			)}

			{utilizator.tip === "PROFESOR" && (
				<p>
					<strong>Titlu academic:</strong> {utilizator.titluAcademic}
				</p>
			)}

			<button
				onClick={() =>
					navigate(`/${TIP.toLowerCase()}/${id}/editare-profil`)
				}
			>
				<FaPencilAlt /> Editează profilul
			</button>
		</div>
	);
};

export default Profil;
