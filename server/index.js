import { config } from "dotenv";
import express from 'express';
import cors from 'cors';
import sorteoRoutes from './routes/enlaces.sorteo.js';
import path from "path";
import { fileURLToPath } from "url";

const app = express();

//Configuracion de Express
config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cors
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUERTO = process.env.PORT || 3000

// Rutas
app.use('/api', sorteoRoutes)

//Subir imagenes
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))

app.listen(PUERTO, () => {
    console.log(`Servidor Ejecutandose en: http://localhost:${PUERTO}`);
})

/**
 * TODO: Configurar las rutas de la API
 * TODO: Configurar los metodos GET,POST,DELETE etc...
 * TODO: Enlazar el Client con el Server con AXIOS
 * TODO: Configurar los metodos de cada funcoin en cada ruta
 */