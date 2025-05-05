import fs from 'node:fs';
import pool from '../config/db.js';

export const mainSorteo = (req, res) => {
    res.send("Mondongo Mondongo Mondongo Mondongo Mondongo Mondongo ")
};

//GET(Jugadores)
export const getJugadores = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM jugador');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al Obtener los Datos de los Juegadores" })
    }
};



//POST(Jugadores)
export const addJugadores = async (req, res) => {

    try {
        const {
            nombres_apellidos,
            cedula,
            celular,
            pais_estado,
            referenciaPago,
            metodo_pago,
            numeros
        } = req.body;

        const comprobante_pago = req.file ? saveImage(req.file) : null;

        //Validacion
        if (!nombres_apellidos || !cedula || !celular || !numeros) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        };

        //Insertar valorres (jugador)
        const [jugadorResult] = await pool.query(
            'INSERT INTO jugador SET ?',
            {
                nombres_apellidos,
                cedula, 
                celular,
                pais_estado,
                referenciaPago,
                metodo_pago,
                comprobante_pago
            }
        );

        //Insertat boletos
        const numerosArray = JSON.parse(numeros);
        const valoresBoletos = numerosArray.map(num => [num.padStart(4, '0'), jugadorResult.insertId]);

        await pool.query(
            'INSERT INTO numeros_boletos (numero_boleto, jugador_id) VALUES ?',
            [valoresBoletos]
        );

        res.status(201).json({
            success: true,
            message: "Registro Exitoso",
            jugadorID: jugadorResult.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el envio de datos desde el servidor" })
    }
};

function saveImage(file) {
    const newPath = `./uploads${file.originalname}`;
    fs.renameSync(file.path, newPath);
    return newPath;
}


//POST(Boletos)

export const addBoletos = async (req, res) => {

    let { numero_boleto, jugador_id } = req.body;

    if (!numero_boleto || !jugador_id) {
        return res.status(400).json({ error: 'Faltan completar campos obligatorios para Boletos' });
    };

    if (!Array.isArray(numero_boleto)) {
        numero_boleto = [numero_boleto];
    };

    if (numero_boleto.length === 0) {
        return res.status(400).json({ error: "Lista Vacia" });
    };

    try {
        const values = numero_boleto.map(nb => [nb, jugador_id]);
        const [result] = await pool.query(`INSERT INTO numeros_boletos (numero_boleto, jugador_id) VALUES ?`, [
            values
        ]);
        res.status(201).json({
            message: "Numero de Boleto Registrado",
            cantidad: values.length,
            jugador_id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el Boleto' });
    }
};


//GET(Boletos)
export const getBoletos = async (req, res) => {

    try {
        const [rows] = await pool.query('SELECT numero_boleto FROM numeros_boletos');
        const usedNumbers = rows.map(row => row.numero_boleto)
        res.json(usedNumbers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al Obtener los Datos de los Boletos" })
    }
};


//Get(Admin)
export const getAdmin = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM admin');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al Obtener los Datos de los Admins" })
    }
};