import express from "express";
import cors from "cors";
import env from "dotenv";
import InitDB from "./src/DB/InitDB.js";
import FileRouter from "./src/Routers/FileRouter.js";
import DBRouter from "./src/Routers/DBRouter.js";
import FacultateRouter from "./src/Routers/FacultateRouter.js";
import UtilizatorRouter from "./src/Routers/UtilizatorRouter.js";
import StudentRouter from "./src/Routers/StudentRouter.js";
import ProfesorRouter from "./src/Routers/ProfesorRouter.js";
import SesiuneRouter from "./src/Routers/SesiuneRouter.js";
import CerereRouter from "./src/Routers/CerereRouter.js";
import CerereFinalaRouter from "./src/Routers/CerereFinalaRouter.js";

env.config();

let app = express();
app.use(
	cors({
		origin: process.env.REACT_URL,
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: "application/pdf" }));

// gestionare fisiere
app.use(FileRouter);

// gestionare baza de date
InitDB();
app.use(DBRouter);
app.use(FacultateRouter);
app.use(UtilizatorRouter);
app.use(StudentRouter);
app.use(ProfesorRouter);
app.use(SesiuneRouter);
app.use(CerereRouter);
app.use(CerereFinalaRouter);

let port = process.env.PORT || 8001;
app.listen(port, () => {
    console.log("API is running on port " + port);
});

export default app;