import { Router } from 'express';
import {
    getSorteo,
    postSorteo
} from '../controllers/sorteo.controllers.js';

const router = Router();

router.get('/envio_juego', getSorteo);

router.post('/solicitar_juego', postSorteo);

export default router;