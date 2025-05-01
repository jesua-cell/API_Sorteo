import express from "express";
import { 
    mainSorteo,
    getJugadores,
    addJugadores,
    addBoletos,
    getBoletos,
    getAdmin 
} from '../controllers/sorteo.controllers.js';

const router = express.Router();

router.get('/', mainSorteo);

router.get('/jugadores', getJugadores);

router.post('/nuevo_jugador', addJugadores);

router.post('/nuevo_boletos', addBoletos);

router.get('/boletos', getBoletos);

router.get('/admins', getAdmin)

export default router;