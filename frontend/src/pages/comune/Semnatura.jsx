import "../../css_files/comune/Semnatura.css";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SignaturePad from "react-signature-pad-wrapper";
import { FaUndo, FaSave, FaArrowLeft } from "react-icons/fa";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const TIP = localStorage.getItem("TIP");

const Semnatura = () => {
	const { id } = useParams();
	const signatureRef = useRef(null);
	const navigate = useNavigate();

	const handleUndo = () => {
		if (signatureRef.current) {
			const data = signatureRef.current.toData();
			if (data.length > 0) {
				signatureRef.current.fromData(data.slice(0, -1));
			}
		}
	};

	const handleSave = async () => {
		if (signatureRef.current && !signatureRef.current.isEmpty()) {
			try {
				const dataURL = signatureRef.current.toDataURL("image/png");
				const base64Data = dataURL.split(",")[1];

				const saveResponse = await fetch(
					`${VITE_API_URL}/uploads/incarcare-semnatura`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ semnatura: base64Data }),
					}
				);

				if (!saveResponse.ok) {
					throw new Error("Eroare la încărcarea semnăturii!");
				}

				const { url } = await saveResponse.json();

				const updateResponse = await fetch(
					`${VITE_API_URL}/utilizatori/${id}`,
					{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ urlSemnatura: url }),
					}
				);

				if (!updateResponse.ok) {
					throw new Error("Eroare la actualizare!");
				}

				alert("Semnătura salvată cu succes!");
				navigate(`/${TIP.toLowerCase()}/${id}/setari`);
			} catch (err) {
				console.error("Eroare:", err);
				alert("Eroare la salvarea semnăturii!");
			}
		} else {
			alert("Semnătura este goală!");
		}
	};

	return (
		<div className="Semnatura">
			<h2>Semnătura virtuală</h2>
			<SignaturePad
				ref={signatureRef}
				options={{ minWidth: 1, maxWidth: 3, penColor: "black" }}
				className="SignaturePad"
			/>

			<div className="butoane">
				<button className="inapoi" onClick={() => navigate(-1)}>
					<FaArrowLeft /> Înapoi
				</button>
				<button onClick={handleUndo}>
					<FaUndo /> Șterge
				</button>
				<button onClick={handleSave}>
					<FaSave /> Salvează
				</button>
			</div>
		</div>
	);
};

export default Semnatura;
