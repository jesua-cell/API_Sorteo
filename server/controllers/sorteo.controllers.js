import path from "path";
import { fileURLToPath } from "url";
import fs from 'node:fs';
import pool from '../config/db.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import { error } from "node:console";

//Configuracion del archivo UOLOADS_DIR:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const UPLOADS_DIR = path.resolve(__dirname, '../uploads')

dotenv.config();

export const mainSorteo = async (req, res) => {
    res.send('Mondogo')
}

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

        res.json({
            token,
            nombre: admin.nombre
        });
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
        if (jugador.comprobante_pago && UPLOADS_DIR) {
            try {
                const comprobante = String(jugador.compare);
                const filePath = path.join(UPLOADS_DIR, comprobante);
            } catch (fileError) {
                console.error("Error al eliminar el archivo", fileError);
            }
        } else if (jugador.comprobante_pago) {
            console.error("UPLOADS_DIR no existe")
        }

        res.json({ success: true, message: "Jugador Eliminado" })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al eliminar al jugador",
            details: error.message
        });
    }
}

//Editar Jugador
export const updateJugador = async (req, res) => {
    const { id } = req.params;
    const {
        nombres_apellidos,
        cedula,
        celular,
        pais_estado,
        metodo_pago,
        referenciaPago,
        boletos
    } = req.body;

    //convertir boletos en Arrays
    let boletosArray = [];
    if (typeof boletos === 'string') {
        boletosArray = boletos
            .split(",")
            .map(b => b.trim())
            .filter(b => b !== '')
            .map(b => b.padStart(4, '0'))
    } else if (Array.isArray(boletos)) {
        boletosArray = [...boletos];
    };

    boletosArray = boletosArray.map(b => String(b).padStart(4, '0'));

    //Transaccion
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        //Actualizacion de valores
        await connection.query(
            `UPDATE jugador SET 
                nombres_apellidos = ?,
                cedula = ?,
                celular = ?,
                pais_estado = ?,
                metodo_pago = ?,
                referenciaPago = ?
                WHERE id = ?`,
            [nombres_apellidos, cedula, celular, pais_estado, metodo_pago, referenciaPago, id]
        );

        //Eliminar Boletos existentes
        // await connection.query(
        //     'DELETE FROM numeros_boletos WHERE jugador_id = ?',
        //     [id] 
        // );

        //Insertar nuevos boletos si hay
        // if (boletosArray.length > 0) {
        //     const valoresBoletos = boletosArray.map(num => [num.padStart(4, '0'), id]);
        //     await connection.query(
        //         'INSERT INTO numeros_boletos (numero_boleto, jugador_id) VALUES ?',
        //         [valoresBoletos]
        //     );
        // }

        if (boletosArray.length > 0) {
            //obtener los boletos de la BD
            const [currentBoletos] = await connection.query(
                'SELECT numero_boleto FROM numeros_boletos WHERE jugador_id = ?',
                [id]
            );

            const currentSet = new Set(currentBoletos.map(b => b.numero_boleto));
            const newSet = new Set(boletosArray);

            //Eliminar boletos que no esten en el nuevo set
            const toDelete = [...currentSet].filter(num => !newSet.has(num));
            if (toDelete.length > 0) {
                await connection.query(
                    'DELETE FROM numeros_boletos WHERE jugador_id = ? AND numero_boleto IN (?)',
                    [id, toDelete]
                );
            };

            const toInsert = boletosArray.filter(num => !currentSet.has(num));
            if (toInsert.length > 0) {
                const valoresBoletos = toInsert.map(num => [num, id]);
                await connection.query(
                    'INSERT INTO numeros_boletos (numero_boleto, jugador_id) VALUES ?',
                    [valoresBoletos]
                )
            };
        };

        await connection.commit();

        res.json({
            success: true,
            message: 'Jugador Actualizado'
        });

    } catch (error) {
        await connection.rollback();
        console.error("Error en la actualizacion del jugadir", error);
        res.status(500).json({
            error: 'Errror en la actualizacion del jugador',
            details: error.message,
            sql: error.sql
        })
        throw error;
    } finally {
        connection.release();
    }

};


export const postCardPub = async (req, res) => {
    try {
        const { titulo_p, subtitulo_p, descripcion_p } = req.body;
        const imagen_pub = req.file;
        console.log('Imagen recibida:', req.file);

        if (!titulo_p || !subtitulo_p || !descripcion_p || !imagen_pub.path) {
            return res.status(404).json({ error: 'Error en los campos del CardPub' });
        };

        const imageBuffer = fs.readFileSync(imagen_pub.path);

        const [result] = await pool.query(
            'INSERT INTO card_pub (titulo_p, subtitulo_p, descripcion_p, imagen_pub) VALUES (?, ?, ?, ?)',
            [titulo_p, subtitulo_p, descripcion_p, imageBuffer]
        );

        res.status(201).json({
            success: true,
            message: 'Publicacion Guardada',
            id: result.insertId,
        });

    } catch (error) {
        console.error("Error en peticion del CardPub", error);
        res.status(500).json({ error: 'Error al guardar la publicacion' });
    }
};

export const getCardPub = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            'SELECT titulo_p, subtitulo_p, descripcion_p, imagen_pub FROM card_pub WHERE id = ?',
            [id]
        );

        if (!rows.length === 0 || !rows[0].imagen_pub) {
            return res.status(404).json({ error: 'Imagen no encontrada' });
        };

        const cardData = rows[0];

        // const imageBuffer = rows[0].imagen_pub;
        const imageBase64 = rows[0].imagen_pub.toString('base64');

        res.json({
            titulo_p: cardData.titulo_p,
            subtitulo_p: cardData.subtitulo_p,
            descripcion_p: cardData.descripcion_p,
            imagen_pub: imageBase64
        });

    } catch (error) {
        console.error('Error al obtener la imagen');
        res.status(500).json({ error: "Error al obneneter la imagen" });
    }
}

export const getAllCardPub = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id ,titulo_p, subtitulo_p, descripcion_p, imagen_pub FROM card_pub'
        );

        const cards = rows.map(card => {

            let imageBase64 = null;
            if (card.imagen_pub) {
                const buffer = Buffer.from(card.imagen_pub);
                imageBase64 = buffer.toString('base64')
            };

            return {
                id: card.id,
                titulo_p: card.titulo_p,
                subtitulo_p: card.subtitulo_p,
                descripcion_p: card.descripcion_p,
                imagen_pub: imageBase64
            };
        });

        res.json(cards);

    } catch (error) {
        console.error('Error al obtener las publicaciones', error);
        res.status(500).json({ error: 'Error al obtener las publicaciones' })
    }
}

export const deleteCardPub = async (req, res) => {
    const { id } = req.params;

    try {
        const [checkResult] = await pool.query(
            'SELECT * FROM card_pub WHERE id = ?',
            [id]
        );

        if (checkResult.length === 0) {
            return res.status(404).json({ error: 'No se encontraron publicaciones' })
        };

        await pool.query(
            'DELETE FROM card_pub WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Publicacion Eliminada'
        })

    } catch (error) {
        console.error('Error al eliminar publicacion', error);
        res.status(500).json({ error: 'Error al eliminar la publicaicon' })
    }
};

export const updateCardPub = async (req, res) => {
    const { id } = req.params;

    const {
        titulo_p,
        subtitulo_p,
        descripcion_p
    } = req.body;

    const file = req.file;

    try {
        let updateFields = {
            titulo_p,
            subtitulo_p,
            descripcion_p
        };

        //Si se subio una imagen; cambiarla
        if (file) {
            const imageBuffer = fs.readFileSync(file.path);
            updateFields.imagen_pub = imageBuffer;
            fs.unlinkSync(file.path);
        };

        const [result] = await pool.query(
            'UPDATE card_pub SET ? WHERE id = ?',
            [updateFields, id]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({ error: 'Publicacion no encontrada' });
        };

        res.json({
            success: true,
            message: 'Publicacion Actualizada'
        });

    } catch (error) {
        console.error('Error al Actualizar', error);
        res.status(500).json({ error: 'Error al actualizae' });
    }
};

export const postValorVes = async (req, res) => {

    const { valor } = req.body;

    if (valor === undefined) {
        return res.status(400).json({ error: 'Valor Requerido' })
    };

    try {
        
        await pool.query('INSERT INTO valor_ves (valor) VALUES (?)', [valor]);

        res.json({
            message: 'Valor Recibido',
            valor_recibido: valor
        });

    } catch (error) {
        console.error('Error en la obtencion del valor del VES');
        res.status(500).json({error: 'Error en la obtencion del valor del VES'})
    }

};

export const getValorVes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT valor FROM valor_ves ORDER BY id DESC LIMIT 1');

        if(rows.length === 0){
            return res.status(404).json({error: 'No hay valores regitrados'})
        };

        res.json({valor: rows[0].valor});

    } catch (error) {
        res.status(500).json({error: 'Error en la obtencion del valor del VES'})
    }
};