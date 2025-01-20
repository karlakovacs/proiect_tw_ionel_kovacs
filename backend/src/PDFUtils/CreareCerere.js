import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "./CreareFonts.js";
import supabase from "../DB/SupabaseClient.js";
import CerereFinala from "../Entities/CerereFinala.js";

const SUPABASE_URL = "https://ukicmxgplbrvlanvejhu.supabase.co/storage/v1/object/public/uploads/";

pdfMake.vfs = pdfFonts;

pdfMake.fonts = {
	NotoSerif: {
		normal: "NotoSerif-Regular.ttf",
		bold: "NotoSerif-Bold.ttf",
	},
};

async function getPNG(urlSemnaturaStudent) {
	try {
		const response = await axios.get(
			`${SUPABASE_URL}/${urlSemnaturaStudent}`,
			{ responseType: "arraybuffer" }
		);
		return Buffer.from(response.data, "binary");
	} catch (error) {
		console.error("Eroare la preluarea PNG-ului:", error);
		throw error;
	}
}

async function CreareCerere(
	numeStudent,
	prenumeStudent,
	facultate,
	formaInvatamant,
	titluLucrare,
	titluAcademic,
	numeProfesor,
	prenumeProfesor,
	anInmatriculare,
	emailStudent,
	urlSemnaturaStudent,
	idCerereFinala
) {
	try {
		const pngSemnatura = await getPNG(urlSemnaturaStudent);

        const prescurtareTitlu = (titlu) => {
            switch (titlu) {
                case 'PROFESOR':
                    return 'Prof. dr.';
                case 'CONFERENTIAR':
                    return 'Conf. dr.';
                case 'LECTOR':
                    return 'Lect. dr.';
                default:
                    return titlu;
            }
        };

		const docDefinition = {
			content: [
				{
					columns: [
						{ text: "Aviz Decan,", alignment: "left" },
						{
							text: "Aviz Director Departament,",
							alignment: "right",
						},
					],
					margin: [0, 0, 0, 10],
				},
				{
					columns: [
						{ text: "___________", alignment: "left" },
						{ text: "___________", alignment: "right" },
					],
					margin: [0, 0, 0, 100],
				},
				{
					text: "Domnule Decan,",
					margin: [0, 0, 0, 50],
					alignment: "center",
					bold: true,
					fontSize: 14,
				},
				{
					text: [
						"Subsemnatul/a ",
						{
							text: `${numeStudent.toUpperCase()} ${prenumeStudent}`,
							bold: true,
						},
						", student/ă în cadrul ",
						{
							text: `Facultății ${facultate.replace(
								"Facultatea ",
								""
							)}`,
							bold: true,
						},
						", forma de învățământ ",
						{ text: `${formaInvatamant}`, bold: true },
						", vă rog să binevoiți a-mi aproba realizarea lucrării de disertație cu titlul ",
						{ text: `${titluLucrare}`, bold: true },
						", având drept coordonator știinţific pe dl/dna ",
						{
							text: `${prescurtareTitlu(titluAcademic)} ${numeProfesor.toUpperCase()} ${prenumeProfesor}`,
							bold: true,
						},
						". Menţionez că am fost înmatriculat/ă în programul de masterat în anul ",
						{ text: `${anInmatriculare}`, bold: true },
						" și pot fi contactat/ă la adresa de e-mail ",
						{ text: `${emailStudent}`, bold: true },
						".",
					],
					margin: [0, 0, 0, 50],
				},
				{
					columns: [
						{
							stack: [
								{ text: "Data trimitere cerere:" },
								{
									text: `${new Date().toLocaleDateString(
										"ro-RO"
									)}`,
									bold: true,
								},
							],
						},
						{
							stack: [
								{
									text: "Semnătura student:",
									alignment: "right",
								},
								{
									image:
										"data:image/png;base64," +
										pngSemnatura.toString("base64"),
									width: 100,
									height: 50,
									alignment: "right",
								},
							],
						},
					],
					margin: [0, 0, 0, 20],
				},
				{
					columns: [
						{ text: "Data aprobare coordonator:" },
						{ text: "Semnătura coordonator:", alignment: "right" },
					],
				},
				{
					text: `Domnului Decan al Facultății ${facultate.replace(
						"Facultatea ",
						""
					)}`,
					bold: true,
					margin: [0, 100, 0, 0],
					alignment: "center",
				},
			],
			defaultStyle: {
				font: "NotoSerif",
				fontSize: 12,
				lineHeight: 1.5,
				alignment: "justify",
				color: "#000000",
			},
			pageMargins: [60, 80, 60, 0],
			pageSize: "A4",
		};

		const buffer = await new Promise((resolve, reject) => {
			pdfMake.createPdf(docDefinition).getBuffer((buf) => resolve(buf));
		});

		const numeFisier = `Cerere_${Date.now()}.pdf`;
		const bucket = "uploads";
		const folder = "cereri";

		const { data, error } = await supabase.storage
			.from(bucket)
			.upload(`${folder}/${numeFisier}`, buffer, {
				contentType: "application/pdf",
			});

		if (error) {
			throw new Error(
				`Eroare la încărcarea în Supabase: ${error.message}`
			);
		}

		await CerereFinala.update(
			{
				urlCerereStudent: `${folder}/${numeFisier}`,
				dataIncarcareStudent: new Date().toISOString(),
			},
			{ where: { id: idCerereFinala } }
		);
	} catch (error) {
		console.error("Eroare la generarea cererii PDF:", error);
	}
}

export default CreareCerere;
