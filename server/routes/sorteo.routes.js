import { Router } from 'express'
import { pool } from "../config/db.js";

const router = Router();

router.get('/', async (req, res) => {
    const [result] = await pool.query('SELECT * FROM jugador');
    console.log(result);
    res.json({ message: "Mondongo", data: result });
})

export default router;