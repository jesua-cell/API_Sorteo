import { dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";
import multer from "multer";
import path from "path";

import fs from "fs";
import {
    mainSorteo,
    getJugadores,
    addJugadores,
    deleteJugador,
    addBoletos,
    getBoletos,
    getAdmin,
    loginAdmins,
    authToken,
    postCardPub,
    getCardPub,
    getAllCardPub,
    deleteCardPub,
    updateJugador,
    updateCardPub,
    postValorVes,
    getValorVes,
    updateValores,
    UpdateEstadoPago,
    getModoSorteo,
    updateModoSorteo,
    abonarJugador,
    getComprobantes
} from '../controllers/sorteo.controllers.js';


//obtner las rutas de los archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//definir la ruta absoluta
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
const CARDPUB_DIR = path.resolve(__dirname, '../cardpub');
console.log("Ruta de uploads", UPLOADS_DIR);

//Comprobar la existencia de la carpeta
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log('Carpeta de "uploads/" creada');
} else {
    console.log('Ya existe la carpeta "/uploads"');
}

//crear carpeta para cardpub si no existe
if (!fs.existsSync(CARDPUB_DIR)) {
    fs.mkdirSync(CARDPUB_DIR, { recursive: true })
    console.log('Carpeta carpub creada');
};

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

//configuracion del multer para imagenes de carpub
const storageCardPub = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, CARDPUB_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `carpub-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    }
});


const uploadCardPub = multer({
    storage: storageCardPub,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Solo se permiten imagenes'), false);
        };
    }
})

const upload = multer({ storage });

const router = express.Router();

router.get('/', mainSorteo);

router.get('/jugadores', getJugadores);

router.post('/nuevo_jugador', upload.single('comprobante_pago'), addJugadores);

router.delete('/jugador/:id', deleteJugador);

router.post('/nuevo_boletos', addBoletos);

router.get('/boletos', getBoletos);

router.get('/admins', getAdmin);

router.post('/admin/login', loginAdmins);

router.post('/cardpub', uploadCardPub.single('imagen'), postCardPub);

router.get('/cardpub/:id/image', getCardPub);

router.get('/cardpub', getAllCardPub);

router.delete('/cardpub/:id', deleteCardPub);

router.put('/jugador/:id', updateJugador);

router.put('/cardpub/:id', uploadCardPub.single('imagen'), updateCardPub);

router.post('/valor', postValorVes);

router.get('/valor', getValorVes);

router.post('/valor', postValorVes);

router.put('/valor', updateValores);

router.put('/jugador/:id/estado_pago', UpdateEstadoPago);

router.get('/modo_sorteo', getModoSorteo);

router.put('/modo_sorteo', updateModoSorteo);

router.put('/abonar/:id', abonarJugador);

router.get('/comprobante/:id', getComprobantes);

export default router;