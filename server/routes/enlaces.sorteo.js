import express from "express";
import multer from "multer";
import { 
    mainSorteo,
    getJugadores,
    addJugadores,
    addBoletos,
    getBoletos,
    getAdmin 
} from '../controllers/sorteo.controllers.js';

const upload = multer({dest: 'uploads/'});

const router = express.Router();

router.get('/', mainSorteo);

router.get('/jugadores', getJugadores);

router.post('/nuevo_jugador', upload.single('comprobante_pago'), addJugadores);

function saveImage(file) {
    const newPath = `./uploads${file.originalname}`;
    fs.renameSync(file.path, newPath);
    return newPath;
}
 
router.post('/nuevo_boletos', addBoletos);

router.get('/boletos', getBoletos);

router.get('/admins', getAdmin)

export default router;