import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectHandler = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const ID = localStorage.getItem("ID");
		const TIP = localStorage.getItem("TIP");

		if (ID && TIP) {
			navigate(`/${TIP.toLowerCase()}/${ID}`);
		} else {
			navigate("/auth");
		}
	}, [navigate]);

	return null;
};

export default RedirectHandler;
