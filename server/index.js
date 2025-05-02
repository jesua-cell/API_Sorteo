import { config } from "dotenv";
import express from 'express';
import cors from 'cors';
import sorteoRoutes from './routes/enlaces.sorteo.js';

const app = express();

//Configuracion de Express
config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cors
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));

const PUERTO = process.env.PORT || 3000

// Rutas
app.use('/', sorteoRoutes)

app.listen(PUERTO, () => {
    console.log(`Servidor Ejecutandose en: http://localhost:${PUERTO}`);
})

/**
 * TODO: Configurar las rutas de la API
 * TODO: Configurar los metodos GET,POST,DELETE etc...
 * TODO: Enlazar el Client con el Server con AXIOS
 * TODO: Configurar los metodos de cada funcoin en cada ruta
 */