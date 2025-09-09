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
    getComprobantes,
    updateComprobante,
    addComprobantes,
    getAllComprobantes,
    deleteComprobante,
    deleteAllJugadores,
    getJugadorVerificador
} from '../controllers/sorteo.controllers.js';
import { authToken } from "../middleware/authToken.js";


//obtner las rutas de los archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//definir la ruta absoluta
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
const CARDPUB_DIR = path.resolve(__dirname, '../cardpub');

//Comprobar la existencia de la carpeta uploads
/**
 if (!fs.existsSync(UPLOADS_DIR)) {
     fs.mkdirSync(UPLOADS_DIR, { recursive: true });
     console.log('Carpeta de "uploads/" creada');
 } else {
     console.log('Ya existe la carpeta "/uploads"');
 }
 */

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

router.use('/cardpub', express.static(CARDPUB_DIR));

router.get('/', mainSorteo);

router.get('/jugadores', getJugadores);

router.post('/nuevo_jugador', upload.single('comprobante_pago'), addJugadores);

router.delete('/jugador/:id', authToken, deleteJugador);

router.post('/nuevo_boletos', addBoletos);

router.get('/boletos', getBoletos);

router.get('/admins', getAdmin);

router.post('/admin/login', loginAdmins);

router.post('/cardpub', authToken, uploadCardPub.single('imagen'), postCardPub);

router.get('/cardpub/:id/image', getCardPub);

router.get('/cardpub', getAllCardPub);

router.delete('/cardpub/:id', authToken, deleteCardPub);

router.put('/jugador/:id', authToken, updateJugador);

router.get('/jugadorVerificador', getJugadorVerificador);

router.put('/cardpub/:id', authToken, uploadCardPub.single('imagen'), updateCardPub);

router.post('/valor', postValorVes);

router.get('/valor', getValorVes);

router.post('/valor', postValorVes);

router.put('/valor', authToken, updateValores);

router.put('/jugador/:id/estado_pago', authToken, UpdateEstadoPago);

router.get('/modo_sorteo', getModoSorteo);

router.put('/modo_sorteo', authToken, updateModoSorteo);

router.put('/abonar/:id', authToken, abonarJugador);

router.delete('/delete-comprobante/:comprobanteId', authToken, deleteComprobante);

router.get('/comprobante/:id', getComprobantes);

router.post('/comprobante/:id', authToken, upload.single('comprobante'), addComprobantes);

router.get('/comprobantes/:jugador_id', getAllComprobantes);

router.put('/comprobante/:id', upload.single('comprobante'), updateComprobante);

router.delete('/delete-all-jugadores', authToken, deleteAllJugadores);

/**
 * router.put('/jugador/:id', authToken, updateJugador);
router.delete('/jugador/:id', authToken, deleteJugador);
router.put('/abonar/:id', authToken, abonarJugador);
router.put('/jugador/:id/estado_pago', authToken, UpdateEstadoPago);
router.put('/modo_sorteo', authToken, updateModoSorteo);
router.delete('/delete-comprobante/:comprobanteId', authToken, deleteComprobante);
router.delete('/delete-all-jugadores', authToken, deleteAllJugadores);
router.post('/comprobante/:id', authToken, upload.single('comprobante'), addComprobantes);
router.put('/valor', authToken, updateValores);
 */


export default router;