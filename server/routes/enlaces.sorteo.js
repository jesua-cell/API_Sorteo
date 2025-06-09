import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import {
    mainSorteo,
    getJugadores,
    addJugadores,
    addBoletos,
    getBoletos,
    getAdmin,
    loginAdmins,
    authToken
} from '../controllers/sorteo.controllers.js';

//obtner las rutas de los archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//definir la ruta absoluta
const UPLOADS_DIR = path.join(__dirname, '../uploads');
console.log("Ruta de uploads", UPLOADS_DIR);

//Comprobar la existencia de la carpeta
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log('Carpeta de "uploads/" creada');
} else {
    console.log('Ya existe la carpeta "/uploads"');
}

//Configuracion del multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName)
    }
});

const upload = multer({ storage });

const router = express.Router();

router.get('/', mainSorteo);

router.get('/jugadores', getJugadores);

router.post('/nuevo_jugador', upload.single('comprobante_pago'), addJugadores);

router.post('/nuevo_boletos', addBoletos);

router.get('/boletos', getBoletos);

router.get('/admins', getAdmin);

router.post('/admin/login', loginAdmins);

export default router;