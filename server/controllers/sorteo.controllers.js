import path from "path";
import { fileURLToPath } from "url";
import fs from 'node:fs';
import pool from '../config/db.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

//Configuracion del archivo UOLOADS_DIR:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const UPLOADS_DIR = path.resolve(__dirname, '../uploads')

dotenv.config();

export const mainSorteo = (req, res) => {
    res.send("Mondongo Mondongo Mondongo Mondongo Mondongo Mondongo ")
};

//GET(Jugadores)
export const getJugadores = async (req, res) => {
    try {
        const [jugadores] = await pool.query(`
            SELECT 
                j.*,
                MIN(nb.fecha_asignacion) AS fecha_registro
            FROM jugador j
            LEFT JOIN numeros_boletos nb ON j.id = nb.jugador_id
            GROUP BY j.id
        `);

        for (const jugador of jugadores) {
            const [boletos] = await pool.query(
                'SELECT numero_boleto FROM numeros_boletos WHERE jugador_id = ?',
                [jugador.id]
            );
            jugador.boletos = boletos.map(b => b.numero_boleto)

            if (jugador.comprobante_pago) {
                jugador.comprobante_url = `http://localhost:3000/uploads/${jugador.comprobante_pago}`
            }
        };

        res.json(jugadores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al Obtener los Datos de los Jugadores" })
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

        const comprobante_pago = req.file ? req.file.filename : null;

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

// function saveImage(file) {
//     const newPath = `./uploads${file.originalname}`;
//     fs.renameSync(file.path, newPath);
//     return newPath;
// }


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


// Get(Admin)
export const getAdmin = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM admin');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al Obtener los Datos de los Admins" })
    }
};


//Login(admins)
export const loginAdmins = async (req, res) => {
    const { username, password } = req.body;

    try {

        console.log(`Admin: ${username}`);

        //Buscar admins
        const [rows] = await pool.query(`SELECT id, nombre, contrasenia FROM admin WHERE nombre = ?`, [username]);

        console.log('Quey results', rows);

        if (rows.length === 0) {
            return res.status(401).json({ error: "Usuario no encontrado" })
        };

        const admin = rows[0];
        console.log('Admin:', admin);
        console.log('Pass hash from DB', admin.contrasenia);

        console.log(`Resultados Encontrados: ${rows.length}`);

        if (!admin) {
            return res.status(401).json({ error: "Credencial Invalida de Usuario" });
        };

        const validPassssword = await bcrypt.compare(password, admin.contrasenia);
        if (!validPassssword) {
            return res.status(401).json({ error: "Credenciales Invalidas de la Contraseña" });
        };

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '365d' }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor(Validacion JWT)" });
    }
};

//middleware de autenticacion:
export const authToken = (req, res, next) => {
    const authHeader = req.headers['autorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
};

export const deleteJugador = async (req, res) => {

    const { id } = req.params;

    try {
        const [jugadorRows] = await pool.query('SELECT comprobante_pago FROM jugador WHERE id = ?', [id]);

        if (jugadorRows.length === 0) {
            return res.status(404).json({ error: "Jugador no encontrado" });
        }

        const jugador = jugadorRows[0];

        await pool.query('DELETE FROM numeros_boletos WHERE jugador_id = ?', [id]);

        const [result] = await pool.query('DELETE FROM jugador WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Jugador no Encontrado" });
        }

        //Manejo de errores de la peticion:
        if(jugador.comprobante_pago && UPLOADS_DIR) {
            try {
                const comprobante = String(jugador.compare);
                const filePath = path.join(UPLOADS_DIR, comprobante);
            } catch (fileError) {
                console.error("Error al eliminar el archivo", fileError);
            } 
        } else if(jugador.comprobante_pago) {
            console.error("UPLOADS_DIR no existe")
        }

        res.json({success: true, message:"Jugador Eliminado"})
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al eliminar al jugador",
            details: error.message
        });
    }
}