import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { getDocument } from "pdfjs-dist";
import axios from "axios";
import supabase from "../DB/SupabaseClient.js";
import CerereFinala from "../Entities/CerereFinala.js";
import { NotoSerifBoldBase64 } from "./SemnareFont.js";

const SUPABASE_URL =
	"https://ukicmxgplbrvlanvejhu.supabase.co/storage/v1/object/public/uploads/";

async function SemnareCerere(urlPdf, urlSemnaturaProfesor, idCerereFinala) {
	try {
		const pdfResponse = await axios.get(`${SUPABASE_URL}/${urlPdf}`, {
			responseType: "arraybuffer",
		});
		const existingPdfBytes = pdfResponse.data;
		const pdfData = new Uint8Array(existingPdfBytes);
		const loadingTask = getDocument({ data: pdfData });
		const pdf = await loadingTask.promise;
		const page = await pdf.getPage(1);
		const textContent = await page.getTextContent();
		let position = null;
		textContent.items.forEach((item) => {
			if (item.str.includes("aprobare")) {
				position = item.transform;
			}
		});
		const x = position[4];
		const y = position[5];

		const pdfDoc = await PDFDocument.load(existingPdfBytes);
		pdfDoc.registerFontkit(fontkit);

		const pages = pdfDoc.getPages();
		const firstPage = pages[0];

		pdfDoc.registerFontkit(fontkit);
        const fontBytes = Buffer.from(NotoSerifBoldBase64, "base64");
        const NotoSerif = await pdfDoc.embedFont(fontBytes);

		firstPage.drawText(`${new Date().toLocaleDateString("ro-RO")}`, {
			x: x - 30,
			y: y - 25,
			size: 12,
			font: NotoSerif,
			color: rgb(0, 0, 0),
		});

		const semnaturaResponse = await axios.get(
			`${SUPABASE_URL}/${urlSemnaturaProfesor}`,
			{ responseType: "arraybuffer" }
		);
		const pngImage = await pdfDoc.embedPng(semnaturaResponse.data);

		firstPage.drawImage(pngImage, {
			x: x + 350,
			y: y - 60,
			width: 100,
			height: 50,
		});

		const pdfBytes = await pdfDoc.save();
		const numeFisier = `CerereAprobata_${Date.now()}.pdf`;
		const bucket = "uploads";
		const folder = "cereri_aprobate";

		const { data, error } = await supabase.storage
			.from(bucket)
			.upload(`${folder}/${numeFisier}`, pdfBytes, {
				contentType: "application/pdf",
			});

		if (error) {
			throw new Error(`Eroare la încărcarea PDF-ului în Supabase: ${error.message}`);
		}

		await CerereFinala.update(
			{
				urlCerereProfesor: `${folder}/${numeFisier}`,
				dataRaspunsProfesor: new Date().toISOString(),
			},
			{ where: { id: idCerereFinala } }
		);

		console.log("Cererea a fost semnată și salvată cu succes!");
	} catch (error) {
		console.error("Eroare la procesarea PDF-ului:", error);
		throw error;
	}
}

export default SemnareCerere;
