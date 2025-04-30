import express from "express";
import { 
    mainSorteo,
    getJugadores,
    addJugadores 
} from '../controllers/sorteo.controllers.js';

const router = express.Router();

router.get('/', mainSorteo);

router.get('/jugadores', getJugadores);

router.post('/nuevo_jugador', addJugadores);

export default router;