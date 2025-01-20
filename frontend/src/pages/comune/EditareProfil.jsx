import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import imagineDefault from "../../assets/profile-placeholder.svg";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const TIP = localStorage.getItem("TIP");

const EditareProfil = () => {
	const { id } = useParams();

	const [utilizator, setUtilizator] = useState({});
	const [imagineTemp, setImagineTemp] = useState(imagineDefault);
	const [imagineNoua, setImagineNoua] = useState(null);
	const [isModificat, setIsModificat] = useState(false);
	const [validari, setValidari] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUtilizator = async () => {
			try {
				const response = await fetch(
					`${VITE_API_URL}/utilizatori/profil/${id}`
				);
				const data = await response.json();

				setUtilizator(data);
				setImagineTemp(
					data.urlImagineProfil
						? `${VITE_SUPABASE_URL}/${data.urlImagineProfil}`
						: imagineDefault
				);
			} catch (err) {
				console.error("Eroare la încărcarea profilului:", err);
			}
		};
		fetchUtilizator();
	}, [id]);

	const handleSchimbare = (e) => {
		setUtilizator({ ...utilizator, [e.target.name]: e.target.value });
		setIsModificat(true);
	};

	const handleSchimbareImagine = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagineTemp(reader.result);
			};
			reader.readAsDataURL(file);

			setImagineNoua(file);
			setIsModificat(true);
		}
	};

	const handleIncarcareImagine = async () => {
		try {
			if (!imagineNoua) {
				return utilizator.urlImagineProfil;
			}

			const formData = new FormData();
			formData.append("file", imagineNoua);

			const uploadResponse = await fetch(
				`${VITE_API_URL}/uploads/incarcare-imagine`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (!uploadResponse.ok) {
				alert("Eroare la încărcarea imaginii!");
				return null;
			}

			const uploadData = await uploadResponse.json();
			return uploadData.url;
		} catch (err) {
			console.error("Eroare la încărcarea imaginii:", err);
			alert("Eroare la încărcarea imaginii!");
			return null;
		}
	};

	const handleSalvare = async () => {
		if (!isModificat) {
			alert("Nu există modificări!");
			return;
		}

		if (!validareFormular()) {
			return;
		}

		try {
			const urlImagineNoua = await handleIncarcareImagine();

			const response = await fetch(
				`${VITE_API_URL}/utilizatori/update/${id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...utilizator,
						urlImagineProfil: urlImagineNoua,
					}),
				}
			);

			if (!response.ok) {
				throw new Error("Eroare la actualizarea datelor!");
			}

			alert("Profil actualizat cu succes!");
			navigate(`/${TIP.toLowerCase()}/${id}/profil`);
		} catch (err) {
			console.error("Eroare la salvare:", err);
			alert("Eroare la actualizarea profilului!");
		}
	};

	const validareFormular = () => {
		const erori = {};

		// Nume
		if (!utilizator.nume.match(/^[a-zA-Z-]+$/)) {
			erori.nume = "Numele poate conține doar litere și cratime (-).";
		}

		// Prenume
		if (!utilizator.prenume.match(/^[a-zA-Z-\s]+$/)) {
			erori.prenume =
				"Prenumele poate conține doar litere, spații și cratime (-).";
		}

		// Email
		if (!utilizator.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			erori.email = "Email invalid!";
		}

		// Forma de învățământ
		if (utilizator.tip === "STUDENT" && !utilizator.formaInvatamant) {
			erori.formaInvatamant = "Selectează o formă de învățământ!";
		}

		// An de înmatriculare
		if (utilizator.tip === "STUDENT") {
			const an = parseInt(utilizator.anInmatriculare, 10);
			if (isNaN(an) || an < 2000 || an > 2024) {
				erori.anInmatriculare =
					"Anul trebuie să fie între 2000 și 2024!";
			}
		}

		// Titlu academic
		if (utilizator.tip === "PROFESOR" && !utilizator.titluAcademic) {
			erori.titluAcademic = "Selectează un titlu academic!";
		}

		setValidari(erori);
		return Object.keys(erori).length === 0;
	};

	return (
		<div>
			<h2>Editare profil</h2>

			<div>
				<img
					src={imagineTemp || imagineDefault}
					alt="Imagine de profil"
					style={{
						width: "150px",
						height: "150px",
						borderRadius: "50%",
					}}
				/>
				<input
					type="file"
					accept="image/*"
					onChange={handleSchimbareImagine}
				/>
			</div>

			<form>
				<label>Nume:</label>
				<input
					type="text"
					name="nume"
					value={utilizator.nume}
					onChange={handleSchimbare}
				/>
				{validari.nume && (
					<p style={{ color: "red" }}>{validari.nume}</p>
				)}

				<label>Prenume:</label>
				<input
					type="text"
					name="prenume"
					value={utilizator.prenume}
					onChange={handleSchimbare}
				/>
				{validari.prenume && (
					<p style={{ color: "red" }}>{validari.prenume}</p>
				)}

				<label>Email:</label>
				<input
					type="email"
					name="email"
					value={utilizator.email}
					onChange={handleSchimbare}
				/>
				{validari.email && (
					<p style={{ color: "red" }}>{validari.email}</p>
				)}

				{TIP === "STUDENT" && (
					<>
						<label>Forma de învățământ:</label>
						<select
							name="formaInvatamant"
							value={utilizator.formaInvatamant}
							onChange={handleSchimbare}
						>
							<option value="">
								Selectează forma de învățământ
							</option>
							<option value="IF">IF</option>
							<option value="IFR">IFR</option>
							<option value="id">id</option>
						</select>
						{validari.formaInvatamant && (
							<p style={{ color: "red" }}>
								{validari.formaInvatamant}
							</p>
						)}

						<label>An de înmnatriculare:</label>
						<input
							type="number"
							name="anInmatriculare"
							value={utilizator.anInmatriculare}
							onChange={handleSchimbare}
						/>
						{validari.anInmatriculare && (
							<p style={{ color: "red" }}>
								{validari.anInmatriculare}
							</p>
						)}
					</>
				)}

				{TIP === "PROFESOR" && (
					<>
						<label>Titlu academic:</label>
						<select
							name="titluAcademic"
							value={utilizator.titluAcademic}
							onChange={handleSchimbare}
						>
							<option value="">Selectează titlul academic</option>
							<option value="LECTOR">Lector</option>
							<option value="CONFERENTIAR">Conferențiar</option>
							<option value="PROFESOR">Profesor</option>
						</select>
						{validari.titluAcademic && (
							<p style={{ color: "red" }}>
								{validari.titluAcademic}
							</p>
						)}
					</>
				)}
			</form>

			<button onClick={() => navigate(-1)}>
				<FaArrowLeft /> Înapoi
			</button>

			<button onClick={handleSalvare}>
				<FaSave /> Salvează
			</button>
		</div>
	);
};

export default EditareProfil;
