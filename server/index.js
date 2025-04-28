import { config } from "dotenv";
import express from 'express';
import routesSorteo from './routes/sorteo.routes.js';

const app = express();

config()

app.use(routesSorteo);

const PUERTO = process.env.PORT || 3000

app.listen(PUERTO, () => { 
    console.log(`Servidor Ejecutandose en: http://localhost:${PUERTO}`);
})
