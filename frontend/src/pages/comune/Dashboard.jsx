import "../../css_files/comune/Dashboard.css";
import { Outlet, NavLink } from "react-router-dom";
import { FaUser, FaCog } from "react-icons/fa";

const ID = localStorage.getItem("ID");
const TIP = localStorage.getItem("TIP");

const Dashboard = () => {
	const tip = TIP.toLowerCase();

	const meniuri = {
		student: [
			{ path: `/student/${ID}/sesiuni`, label: "Sesiuni de înscriere" },
			{ path: `/student/${ID}/cereri`, label: "Cererile mele" },
		],
		profesor: [
			{
				path: `/profesor/${ID}/cereri-sesiune-curenta`,
				label: "Cererile din sesiunea curentă",
			},
			{ path: `/profesor/${ID}/sesiunile-mele`, label: "Sesiunile mele" },
			{ path: `/profesor/${ID}/creare-sesiune`, label: "Creare sesiune" },
		],
	};

	return (
		<div className="Dashboard">
			<header>
				<h1>Dashboard</h1>
				<nav>
					{meniuri[tip].map((meniu, index) => (
						<NavLink
							key={index}
							to={meniu.path}
							className={({ isActive }) =>
								isActive ? "nav-link active" : "nav-link"
							}
						>
							{meniu.label}
						</NavLink>
					))}

					<NavLink
						to={`/${tip}/${ID}/profil`}
						className={({ isActive }) =>
							isActive ? "nav-link active" : "nav-link"
						}
					>
						<FaUser title="Profil" />
					</NavLink>
					<NavLink
						to={`/${tip}/${ID}/setari`}
						className={({ isActive }) =>
							isActive ? "nav-link active" : "nav-link"
						}
					>
						<FaCog title="Setări" />
					</NavLink>
				</nav>
			</header>

			<main>
				<Outlet />
			</main>

			<footer>
				<p>&copy; 2025</p>
			</footer>
		</div>
	);
};

export default Dashboard;
