import '../../css_files/comune/Auth.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const VITE_API_URL = import.meta.env.VITE_API_URL;

const Auth = () => {
	const [isSignUp, setIsSignUp] = useState(false);
	const [facultati, setFacultati] = useState([]);
	const [formData, setFormData] = useState({
		email: "",
		parola: "",
		nume: "",
		prenume: "",
		idFacultate: "",
		tip: "",
		formaInvatamant: "",
		anInmatriculare: "",
		titluAcademic: "",
	});
	const [validari, setValidari] = useState({});

	const navigate = useNavigate();

	const [eroareAuth, setEroareAuth] = useState("");

	useEffect(() => {
		const fetchFacultati = async () => {
			try {
				const response = await fetch(`${VITE_API_URL}/facultati`);
				const data = await response.json();
				setFacultati(data);
			} catch (err) {
				console.error("Eroare la încărcarea facultăților:", err);
			}
		};
		fetchFacultati();
	}, []);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const validareFormular = () => {
		const erori = {};

		// Nume
		if (!formData.nume.match(/^[a-zA-Z-]+$/)) {
			erori.nume = "Numele poate conține doar litere și cratime (-).";
		}

		// Prenume
		if (!formData.prenume.match(/^[a-zA-Z-\s]+$/)) {
			erori.prenume =
				"Prenumele poate conține doar litere, spații și cratime (-).";
		}

		// Facultate
		if (!formData.idFacultate) {
			erori.idFacultate = "Selectează facultatea!";
		}

		// Email
		if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			erori.email = "Email invalid!";
		}

		// Parola
		if (formData.parola.length < 4) {
			erori.parola = "Parola trebuie să aibă cel puțin 4 caractere!";
		}

		// Tip
		if (!formData.tip) {
			erori.tip = "Selectează un tip!";
		}

		// Forma de învățământ
		if (formData.tip === "STUDENT" && !formData.formaInvatamant) {
			erori.formaInvatamant = "Selectează o formă de învățământ!";
		}

		// An de înmatriculare
		if (formData.tip === "STUDENT") {
			const an = parseInt(formData.anInmatriculare, 10);
			if (isNaN(an) || an < 2000 || an > 2024) {
				erori.anInmatriculare =
					"Anul trebuie să fie între 2000 și 2024!";
			}
		}

		// Titlu academic
		if (formData.tip === "PROFESOR" && !formData.titluAcademic) {
			erori.titluAcademic = "Selectează un titlu academic!";
		}

		setValidari(erori);
		return Object.keys(erori).length === 0;
	};

	const handleLogin = async (e) => {
		e.preventDefault();

		const erori = {};
		if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			erori.email = "Email invalid!";
		}
		if (formData.parola.length < 4) {
			erori.parola = "Parola trebuie să aibă cel puțin 4 caractere!";
		}

		setValidari(erori);
		if (Object.keys(erori).length > 0) return;

		try {
			const response = await fetch(`${VITE_API_URL}/utilizatori/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: formData.email,
					parola: formData.parola,
				}),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.message || "Login eșuat");

			localStorage.setItem("ID", data.id);
			localStorage.setItem("TIP", data.tip);

			setTimeout(() => {
				navigate(`/${data.tip.toLowerCase()}/${data.id}`);
			}, 1000);
		} catch (err) {
			setEroareAuth(err.message);
		}
	};

	const handleSignUp = async (e) => {
		e.preventDefault();

		if (!validareFormular()) {
			return;
		}

		try {
			const body = {
				nume: formData.nume,
				prenume: formData.prenume,
				email: formData.email,
				parola: formData.parola,
				idFacultate: formData.idFacultate,
				tip: formData.tip,
			};

			if (formData.tip === "STUDENT") {
				body.formaInvatamant = formData.formaInvatamant;
				body.anInmatriculare = formData.anInmatriculare;
			} else if (formData.tip === "PROFESOR") {
				body.titluAcademic = formData.titluAcademic;
			}

			const response = await fetch(`${VITE_API_URL}/utilizatori/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			const data = await response.json();
			if (!response.ok)
				throw new Error(data.message || "Înregistrare eșuată");

			localStorage.setItem("ID", data.id);
			localStorage.setItem("TIP", data.tip);

			setTimeout(() => {
				navigate(`/${data.tip.toLowerCase()}/${data.id}`);
			}, 1000);
		} catch (err) {
			setEroareAuth(err.message);
		}
	};

	return (
		<div className="Auth">
			<h2>{isSignUp ? "Sign Up" : "Login"}</h2>
			{eroareAuth && <p style={{ color: "red" }}>{eroareAuth}</p>}
			<form onSubmit={isSignUp ? handleSignUp : handleLogin}>
				{/* FORMULAR PENTRU SIGN UP */}
				{isSignUp && (
					<>
						<label>Nume:</label>
						<input
							type="text"
							name="nume"
							value={formData.nume}
							onChange={handleChange}
						/>
						{validari.nume && (
							<p style={{ color: "red" }}>{validari.nume}</p>
						)}

						<label>Prenume:</label>
						<input
							type="text"
							name="prenume"
							value={formData.prenume}
							onChange={handleChange}
						/>
						{validari.prenume && (
							<p style={{ color: "red" }}>{validari.prenume}</p>
						)}

						<label>Facultate:</label>
						<select
							name="idFacultate"
							value={formData.idFacultate}
							onChange={handleChange}
						>
							<option value="">Selectează facultatea</option>
							{facultati.map((facultate) => (
								<option key={facultate.id} value={facultate.id}>
									{facultate.denumire}
								</option>
							))}
						</select>
						{validari.idFacultate && (
							<p style={{ color: "red" }}>
								{validari.idFacultate}
							</p>
						)}

						<label>Email:</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
						/>
						{validari.email && (
							<p style={{ color: "red" }}>{validari.email}</p>
						)}

						<label>Parola:</label>
						<input
							type="password"
							name="parola"
							value={formData.parola}
							onChange={handleChange}
						/>
						{validari.parola && (
							<p style={{ color: "red" }}>{validari.parola}</p>
						)}

						<label>Tip:</label>
						<select
							name="tip"
							value={formData.tip}
							onChange={handleChange}
						>
							<option value="">Selectează tipul</option>
							<option value="STUDENT">Student</option>
							<option value="PROFESOR">Profesor</option>
						</select>
						{validari.tip && (
							<p style={{ color: "red" }}>{validari.tip}</p>
						)}

						{formData.tip === "STUDENT" && (
							<>
								<label>Forma de învățământ:</label>
								<select
									name="formaInvatamant"
									value={formData.formaInvatamant}
									onChange={handleChange}
								>
									<option value="">
										Selectează forma de învățământ
									</option>
									<option value="IF">IF</option>
									<option value="IFR">IFR</option>
									<option value="ID">ID</option>
								</select>
								{validari.formaInvatamant && (
									<p style={{ color: "red" }}>
										{validari.formaInvatamant}
									</p>
								)}

								<label>An de înmatriculare:</label>
								<input
									type="number"
									name="anInmatriculare"
									value={formData.anInmatriculare}
									onChange={handleChange}
								/>
								{validari.anInmatriculare && (
									<p style={{ color: "red" }}>
										{validari.anInmatriculare}
									</p>
								)}
							</>
						)}

						{formData.tip === "PROFESOR" && (
							<>
								<label>Titlu academic:</label>
								<select
									name="titluAcademic"
									value={formData.titluAcademic}
									onChange={handleChange}
								>
									<option value="">
										Selectează titlul academic
									</option>
									<option value="LECTOR">Lector</option>
									<option value="CONFERENTIAR">
										Conferențiar
									</option>
									<option value="PROFESOR">Profesor</option>
								</select>
								{validari.titluAcademic && (
									<p style={{ color: "red" }}>
										{validari.titluAcademic}
									</p>
								)}
							</>
						)}
					</>
				)}

				{/* FORMULAR PENTRU LOGIN */}
				{!isSignUp && (
					<>
						<label>Email:</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
						{validari.email && (
							<p style={{ color: "red" }}>{validari.email}</p>
						)}

						<label>Parola:</label>
						<input
							type="password"
							name="parola"
							value={formData.parola}
							onChange={handleChange}
							required
						/>
						{validari.parola && (
							<p style={{ color: "red" }}>{validari.parola}</p>
						)}
					</>
				)}

				<button type="submit">
					{isSignUp ? "Înregistrează-te" : "Autentifică-te"}
				</button>
			</form>

			<button onClick={() => setIsSignUp(!isSignUp)}>
				{isSignUp ? "Ai deja cont? Login" : "Nu ai cont? Sign Up"}
			</button>
		</div>
	);
};

export default Auth;
