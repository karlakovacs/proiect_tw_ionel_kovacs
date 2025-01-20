import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import InitDB from './src/DB/InitDB.js';
import FileRouter from './src/Routers/FileRouter.js';
import DBRouter from './src/Routers/DBRouter.js';
import FacultateRouter from './src/Routers/FacultateRouter.js';
import UtilizatorRouter from './src/Routers/UtilizatorRouter.js';
import StudentRouter from './src/Routers/StudentRouter.js';
import ProfesorRouter from './src/Routers/ProfesorRouter.js';
import SesiuneRouter from './src/Routers/SesiuneRouter.js';
import CerereRouter from './src/Routers/CerereRouter.js';
import CerereFinalaRouter from './src/Routers/CerereFinalaRouter.js';

env.config();

let app = express();
app.use(cors({ origin: `http://localhost:${process.env.REACT_PORT}` }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: 'application/pdf' }));

// gestionare fisiere
app.use('/api', FileRouter);

// gestionare baza de date
InitDB();
app.use('/api', DBRouter);
app.use('/api', FacultateRouter);
app.use('/api', UtilizatorRouter);
app.use('/api', StudentRouter);
app.use('/api', ProfesorRouter);
app.use('/api', SesiuneRouter);
app.use('/api', CerereRouter);
app.use('/api', CerereFinalaRouter);

let port = process.env.PORT || 8001;
app.listen(port);
console.log('API is runnning at port ' + port);
