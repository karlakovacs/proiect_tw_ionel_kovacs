import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RedirectHandler from "./pages/comune/RedirectHandler";
import Auth from "./pages/comune/Auth";
import Dashboard from "./pages/comune/Dashboard";
import Sesiuni from "./pages/student/Sesiuni";
import Cereri from "./pages/student/Cereri";
import CereriSesiuneCurenta from "./pages/profesor/CereriSesiuneCurenta";
import SesiunileMele from "./pages/profesor/SesiunileMele";
import CreareSesiune from "./pages/profesor/CreareSesiune";
import Acasa from "./pages/comune/Acasa";
import Profil from "./pages/comune/Profil";
import EditareProfil from "./pages/comune/EditareProfil";
import Setari from "./pages/comune/Setari";
import Semnatura from "./pages/comune/Semnatura";
import TrimitereCerere from "./pages/student/TrimitereCerere";
import Cerere from "./pages/comune/Cerere";
import NotFound from "./pages/comune/NotFound";

const App = () => {
	return (
		<Router>
			<Routes>
				{/* Autentificare */}
				<Route path="/" element={<RedirectHandler />} />
				<Route path="/auth" element={<Auth />} />

				{/* Student */}
				<Route path="/student/:id" element={<Dashboard />}>
					<Route index element={<Acasa />} />
					<Route path="sesiuni" element={<Sesiuni />} />
					<Route path="cereri" element={<Cereri />} />
					<Route
						path="trimitere-cerere/:idStudent/:idSesiune"
						element={<TrimitereCerere />}
					/>

					<Route path="profil" element={<Profil />} />
					<Route path="editare-profil" element={<EditareProfil />} />
					<Route path="setari" element={<Setari />} />
					<Route path="semnatura" element={<Semnatura />} />
				</Route>

				{/* Profesor */}
				<Route path="/profesor/:id" element={<Dashboard />}>
					<Route index element={<Acasa />} />
					<Route
						path="cereri-sesiune-curenta"
						element={<CereriSesiuneCurenta />}
					/>
					<Route path="sesiunile-mele" element={<SesiunileMele />} />
					<Route path="creare-sesiune" element={<CreareSesiune />} />

					<Route path="profil" element={<Profil />} />
					<Route path="editare-profil" element={<EditareProfil />} />
					<Route path="setari" element={<Setari />} />
					<Route path="semnatura" element={<Semnatura />} />
				</Route>

				<Route
					path="/cerere/:idCerere/:idStudent/:idSesiune/:idProfesor"
					element={<Cerere />}
				></Route>

				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
};

export default App;
