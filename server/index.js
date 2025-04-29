import { config } from "dotenv";
import express from 'express';

const app = express();

config()

const PUERTO = process.env.PORT || 3000

app.listen(PUERTO, () => { 
    console.log(`Servidor Ejecutandose en: http://localhost:${PUERTO}`);
})
