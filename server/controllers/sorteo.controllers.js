import path from "path";
import { fileURLToPath } from "url";
import fs from 'node:fs';
import pool from '../config/db.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

//Configuracion directorios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
const CARDPUB_DIR = path.resolve(__dirname, '../cardpub');

dotenv.config();

export const mainSorteo = async (req, res) => {
    res.send('Mondogo')
}

//GET(Jugadores)
export const getJugadores = async (req, res) => {
    try {

        // Lectura de Parametros
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5; //# Cantidad de elementos indicada (n)
        const offset = (page - 1) * limit;
        const searchTerm = req.query.search || '';

        // Obtener el modo actual del modo del sorteo (100 o 1000)
        const [modoResult] = await pool.query('SELECT modo FROM configuracion_sorteo LIMIT 1');

        const modo = modoResult[0]?.modo || '1000'; // normalizar el numero: 0 → '00', 7 → '007'
        
        // Funcion para normalizar terminos de busquedad(numericos)
        const normalizeSearchTerm = (term, modo) => {
            if (!isNaN(term)) {
                const num = parseInt(term);

                // Manejar caso especial para 0 en modo 100
                if (modo === '100') {
                    if (num === 0) return '00';
                    if (num <= 99) return String(num).padStart(2, '0');
                    return String(num).padStart(3, '0');
                } else {
                    return String(num).padStart(3, '0');
                }
            }
            return term;
        };

        const normalizedSearchTerm = searchTerm ? normalizeSearchTerm(searchTerm.trim(), modo) : '';

        // Consulta Principal:
        let query = `
            SELECT 
                j.*,
                (SELECT GROUP_CONCAT(numero_boleto) FROM numeros_boletos WHERE jugador_id = j.id) AS boletos,
                (SELECT MIN(fecha_asignacion) FROM numeros_boletos WHERE jugador_id = j.id) AS fecha_registro
            FROM jugador j
        `;

        const params = [];

        // Filtro de Busquedad(con la configuracion de la normalizacion):
        if (normalizedSearchTerm) {
            query += `
            WHERE EXISTS (
                SELECT 1 
                FROM (
                    SELECT id AS jugador_id, nombres_apellidos, celular, cedula, pais_estado, metodo_pago, referenciaPago
                    FROM jugador
                    WHERE 
                        nombres_apellidos LIKE ? OR
                        celular LIKE ? OR
                        cedula LIKE ? OR
                        pais_estado LIKE ? OR
                        metodo_pago LIKE ? OR
                        referenciaPago LIKE ?
                    
                    UNION ALL
                    
                    SELECT jugador_id, NULL, NULL, NULL, NULL, NULL, NULL
                    FROM numeros_boletos
                    WHERE numero_boleto LIKE ?
                ) AS filtered
                WHERE filtered.jugador_id = j.id
            )
            `;

            const searchPattern = `%${normalizedSearchTerm}%`;

            for (let i = 0; i < 6; i++) {
                params.push(searchPattern);
            };
            params.push(searchPattern);
        };

        // Paginacion:
        query += ` ORDER BY j.id DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        // Obtener jugadores con la configuracion del modo y el filtrado
        const [jugadores] = await pool.query(query, params);

        // Procesamientos de Resultados: Convertir boletos a Arreglos:
        const poreccedJugadores = jugadores.map(jugador => ({
            ...jugador,
            boletos: jugador.boletos ? jugador.boletos.split(',') : []
        }));

        // Consulta para el total de registos:
        let countQuery = `
            SELECT COUNT(DISTINCT j.id) as total 
            FROM jugador j
        `;

        const countParams = [];

        if (normalizedSearchTerm) {
            countQuery += `
            WHERE EXISTS (
                SELECT 1 
                FROM (
                    SELECT id AS jugador_id
                    FROM jugador
                    WHERE 
                        nombres_apellidos LIKE ? OR
                        celular LIKE ? OR
                        cedula LIKE ? OR
                        pais_estado LIKE ? OR
                        metodo_pago LIKE ? OR
                        referenciaPago LIKE ?
                    
                    UNION ALL
                    
                    SELECT jugador_id
                    FROM numeros_boletos
                    WHERE numero_boleto LIKE ?
                ) AS filtered
                WHERE filtered.jugador_id = j.id
            )
            `;

            const searchPattern = `%${normalizedSearchTerm}%`;
            for (let i = 0; i < 6; i++) countParams.push(searchPattern);
            countParams.push(searchPattern);
        };

        const [totalRows] = await pool.query(countQuery, countParams);
        const total = totalRows[0].total;

        // Respuesta al Client:
        res.json({
            jugadores: poreccedJugadores,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });

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
            numeros,
            monto_total
        } = req.body;


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
                monto_total
            }
        );

        //Insertar comprobante si existe
        if (req.file) {
            const fileName = `${Date.now()}-${req.file.originalname}`;
            const filePath = path.join(UPLOADS_DIR, fileName);

            fs.renameSync(req.file.path, filePath);

            await pool.query(
                'INSERT INTO comprobantes (jugador_id, ruta_archivo) VALUES (?, ?)',
                [jugadorResult.insertId, fileName]
            );
        };

        //Insertat boletos
        const numerosArray = JSON.parse(numeros);
        const jugadorId = jugadorResult.insertId;

        const valoresBoletos = numerosArray.map(num => {
            const numInt = parseInt(num);
            const numeroBoleto = isNaN(numInt)
                ? num.padStart(3, '0')
                : String(numInt).padStart(3, '0');

            return [numeroBoleto, jugadorId]
        });

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
        res.status(500).json({
            error: "Error en el envio de datos desde el servidor",
            details: error.message
        })
    }
};

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
        const [modoResult] = await pool.query('SELECT modo FROM configuracion_sorteo LIMIT 1');
        const modo = modoResult[0]?.modo || '1000';

        const [rows] = await pool.query('SELECT numero_boleto FROM numeros_boletos');

        const usedNumbers = rows.map(row => {
            const num = parseInt(row.numero_boleto);
            const normalized = isNaN(num) ? row.numero_boleto : String(num);

            if (modo === '100') {
                if (num === 0) return '00';
                if (num <= 99) return String(num).padStart(2, '0');
                return normalized.padStart(3, '0');
            };

            return normalized.padStart(3, '0');
        });

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

// //middleware de autenticacion:
// export const authToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) return res.sendStatus(401);

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user;
//         next();
//     })
// };

export const deleteJugador = async (req, res) => {

    const { id } = req.params;

    try {

        // Obtener los comprobantes del jugador
        const [comprobantes] = await pool.query('SELECT ruta_archivo FROM comprobantes WHERE jugador_id = ?', [id]);

        //eliminar comprobantes
        await pool.query('DELETE FROM comprobantes WHERE jugador_id = ?', [id]);

        //eliminar puestos
        await pool.query('DELETE FROM numeros_boletos WHERE jugador_id = ?', [id]);

        //eliminar jugador
        const [result] = await pool.query('DELETE FROM jugador WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Jugador no Encontrado" });
        };

        // Eliminar archivos fisicos:
        comprobantes.forEach(comprobante => {
            if(comprobante.ruta_archivo) {
                const filePath = path.join(UPLOADS_DIR, comprobante.ruta_archivo);
                if(fs.existsSync(filePath)){
                    fs.unlinkSync(filePath);
                };
            };
        });

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
        boletos,
        monto_total,
        estado_pago,
        monto_abonado
    } = req.body;

    //convertir boletos en Arrays
    let boletosArray = [];
    if (typeof boletos === 'string') {
        boletosArray = boletos
            .split(",")
            .map(b => b.trim())
            .filter(b => b !== '')
            .map(b => {
                return b.padStart(3, '0');
            });
    } else if (Array.isArray(boletos)) {
        boletosArray = [...boletos];
    };

    boletosArray = boletosArray.map(b => String(b).padStart(3, '0'));

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
                referenciaPago = ?,
                monto_total = ?,
                estado_pago = ?,
                monto_abonado = ?
                WHERE id = ?`,
            [
                nombres_apellidos,
                cedula,
                celular,
                pais_estado,
                metodo_pago,
                referenciaPago,
                monto_total,
                estado_pago,
                monto_abonado,
                id
            ]
        );

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

                const valoresBoletos = numerosArray.map(num => {
                    const numInt = parseInt(num);
                    return [
                        isNaN(numInt) ? num.padStart(3, '0') : String(numInt).padStart(3, '0')
                    ];
                });

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

export const getJugadorVerificador = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT j.*, 
                   GROUP_CONCAT(nb.numero_boleto) AS boletos
            FROM jugador j
            LEFT JOIN numeros_boletos nb ON j.id = nb.jugador_id
            GROUP BY j.id
            `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los jugadores en el Verificador", error });
    };
};

export const postCardPub = async (req, res) => {
    try {

        const {
            titulo_p,
            subtitulo_p,
            descripcion_p,
            fecha_juego
        } = req.body;
        const imagen_pub = req.file;
        console.log('Imagen recibida:', req.file);

        // Validacion:
        if (!titulo_p || !subtitulo_p || !descripcion_p || !imagen_pub.path || !fecha_juego) {
            return res.status(404).json({ error: 'Error en los campos del CardPub' });
        };

        const fileName = `cardpub-${Date.now()}-${imagen_pub.originalname}`;
        const filePath = path.join(CARDPUB_DIR, fileName);

        fs.renameSync(imagen_pub.path, filePath);

        const [result] = await pool.query(
            'INSERT INTO card_pub (titulo_p, subtitulo_p, descripcion_p, ruta_archivo, fecha_juego) VALUES (?, ?, ?, ?, ?)',
            [titulo_p, subtitulo_p, descripcion_p, fileName, fecha_juego]
        );

        //Obtener el registro recien insertado 
        const [newValuesCard] = await pool.query(
            'SELECT id, titulo_p, subtitulo_p, descripcion_p, ruta_archivo, fecha_juego FROM card_pub WHERE id = ?',
            [result.insertId]
        );

        if (newValuesCard === 0) {
            return res.status(500).json({ error: 'Error al obtener las publicacion recien subida' });
        };

        //Retorno de datos del back al front
        res.status(201).json({
            success: true,
            message: 'Publicacion Guardada',
            id: result.insertId,
            titulo_p: titulo_p,
            subtitulo_p: subtitulo_p,
            descripcion_p: descripcion_p,
            imagen_pub: fileName,
            fecha_juego: fecha_juego
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
            'SELECT titulo_p, subtitulo_p, descripcion_p, ruta_archivo FROM card_pub WHERE id = ?',
            [id]
        );

        if (!rows.length === 0 || !rows[0].ruta_archivo) {
            return res.status(404).json({ error: 'Imagen no encontrada' });
        };

        const cardData = rows[0];

        res.json({
            titulo_p: cardData.titulo_p,
            subtitulo_p: cardData.subtitulo_p,
            descripcion_p: cardData.descripcion_p,
            imagen_pub: cardData.ruta_archivo
        });

    } catch (error) {
        console.error('Error al obtener la imagen');
        res.status(500).json({ error: "Error al obneneter la imagen" });
    }
}

export const getAllCardPub = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id ,titulo_p, subtitulo_p, descripcion_p, ruta_archivo, fecha_juego FROM card_pub'
        );

        const cards = rows.map(card => {

            return {
                id: card.id,
                titulo_p: card.titulo_p,
                subtitulo_p: card.subtitulo_p,
                descripcion_p: card.descripcion_p,
                imagen_pub: card.ruta_archivo,
                fecha_juego: card.fecha_juego
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

        // Obtener la ruta del archivos
        const [checkResult] = await pool.query(
            'SELECT ruta_archivo FROM card_pub WHERE id = ?',
            [id]
        );

        if (checkResult.length === 0) {
            return res.status(404).json({ error: 'No se encontraron publicaciones' })
        };

        // Obtener el archivo
        const ruta_archivo = checkResult[0].ruta_archivo;

        // Eliminarlo de la BD
        await pool.query(
            'DELETE FROM card_pub WHERE id = ?',
            [id]
        );

        if(ruta_archivo){
            const filePath = path.join(CARDPUB_DIR, ruta_archivo);
            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath);
            };
        };

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
        descripcion_p,
        fecha_juego
    } = req.body;

    const file = req.file;

    try {
        let updateFields = {
            titulo_p,
            subtitulo_p,
            descripcion_p,
            fecha_juego
        };

        let oldFileName = null;

        // Condicion: si se subio una nueva imagen, cambiar la vieja
        if (file) {
            const [current] = await pool.query('SELECT ruta_archivo FROM card_pub WHERE id = ?', [id]);

            if (current.length > 0) {
                oldFileName = current[0].ruta_archivo;
            };

            const fileName = `cardpub-${Date.now()}-${file.originalname}`;
            const filePath = path.join(CARDPUB_DIR, fileName);
            fs.renameSync(file.path, filePath);
            updateFields.ruta_archivo = fileName;
        };

        const [result] = await pool.query(
            'UPDATE card_pub SET ? WHERE id = ?',
            [updateFields, id]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({ error: 'Publicacion no encontrada' });
        };

        // Eliminar la imagen
        if(file && oldFileName){
            const oldFilePath = path.join(CARDPUB_DIR, oldFileName);
            if(fs.existsSync(oldFilePath)){
                fs.unlinkSync(oldFilePath);
            };
        };

        //Obtener el registro recien actualido
        const [newValuesCardPut] = await pool.query(
            'SELECT id, titulo_p, subtitulo_p, descripcion_p, ruta_archivo, fecha_juego FROM card_pub WHERE id = ?',
            [id]
        );

        if (newValuesCardPut === 0) {
            return res.status(500).json({ error: 'Error al recuperar la publicaion actualizada' });
        };

        const card = newValuesCardPut[0];

        res.json({
            success: true,
            message: 'Publicacion Actualizada',
            id: card.id,
            titulo_p: card.titulo_p,
            subtitulo_p: card.subtitulo_p,
            descripcion_p: card.descripcion_p,
            imagen_pub: card.ruta_archivo,
            fecha_juego: card.fecha_juego
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
        res.status(500).json({ error: 'Error en la obtencion del valor del VES' })
    }

};

export const getValorVes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT valor FROM valor_ves ORDER BY id DESC LIMIT 1');

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No hay valores regitrados' })
        };

        res.json({
            valor: rows[0].valor,
            id: rows[0].valor
        });

    } catch (error) {
        res.status(500).json({ error: 'Error en la obtencion del valor del VES' })
    }
};

export const updateValores = async (req, res) => {
    const { valor } = req.body;

    if (valor === undefined) {
        return res.status(400).json({ error: 'Valor Requerido' });
    };

    try {

        //Verificar si el registro existe; solo uno
        const [result] = await pool.query(
            'UPDATE valor_ves SET valor = ?',
            [valor]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        };

        res.json({
            message: 'Valor Actualizado Correctamente',
            valor_actualizado: valor
        });

    } catch (error) {
        console.error('Error en la actualizacion del valor', error);
        res.status(500).json({ error: 'Error en la actualizacion del valor' })
    }
};

export const UpdateEstadoPago = async (req, res) => {

    const { id } = req.params;
    const { estado_pago } = req.body;

    try {

        if (!['pendiente', 'pagado'].includes(estado_pago)) {
            return res.status(400).json({
                error: "Error del estado de pago"
            })
        };

        const [result] = await pool.query(
            'UPDATE jugador SET estado_pago = ? WHERE id = ?',
            [estado_pago, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Jugador no encontrado' })
        };


        // obtener los boletos, para menejar el estado completo del jugador
        const [updateRows] = await pool.query(
            `SELECT j.*, 
            (SELECT GROUP_CONCAT(nb.numero_boleto) 
            FROM numeros_boletos nb 
            WHERE nb.jugador_id = j.id) AS boletos,
            (SELECT MIN(nb.fecha_asignacion)   
            FROM numeros_boletos nb
            WHERE nb.jugador_id = j.id) AS fecha_registro  
            FROM jugador j 
            WHERE j.id = ?`,
            [id]
        );

        const jugador = updateRows[0];

        const boletosArray = jugador.boletos ? jugador.boletos.split(',').map(b => b.trim()) : [];

        if (updateRows.length === 0) {
            return res.status(404).json({ error: 'Jugador no encontrado despues de actualizar' })
        };

        res.json({
            success: true,
            message: 'Estado de pago actualizado',
            jugador: {
                ...jugador,
                boletos: boletosArray
            }
        });
    } catch (error) {
        console.error("Error en la actualizacion de estado de pago", error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// Obtener el numero de puestos
export const getModoSorteo = async (req, res) => {

    try {
        const [rows] = await pool.query('SELECT modo from configuracion_sorteo LIMIT 1'); // Obtener el valor del 'modo'
        res.json(rows[0] || { modo: '1000' }) // Se envia el valor de la tabla, y si no; se envia '1000'
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el modo del sorteo' });
    };
};


export const updateModoSorteo = async (req, res) => {

    const { modo } = req.body;

    try {

        //verificar si existe el registro
        const [check] = await pool.query('SELECT * FROM configuracion_sorteo');

        if (check.length === 0) {
            await pool.query('INSERT INTO configuracion_sorteo (modo) VALUES (?)', [modo]) // Si no hay registro, se insertara un nuevo modo
        } else {
            await pool.query('UPDATE configuracion_sorteo SET modo = ?', [modo]) // si ya existe, solo se actualiza el cmapo
        };

        res.json({ success: true, modo })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el modo del sorteo' });
    }
};

//manejo de abonos
export const abonarJugador = async (req, res) => {
    const { id } = req.params;
    const { monto_abonado } = req.body;

    if (!monto_abonado || parseFloat(monto_abonado) <= 0) {
        return res.status(400).json({ error: "Monto Invalido" });
    };

    try {
        // obtener el jugador
        const [jugadores] = await pool.query(
            'SELECT monto_total, monto_abonado FROM jugador WHERE id = ?',
            [id]
        );

        if (jugadores.length === 0) {
            return res.status(400).json({ error: "Jugador no encontrado" });
        };

        const jugador = jugadores[0];
        const nuevoAbono = parseFloat(jugador.monto_abonado) + parseFloat(monto_abonado);
        const pendiente = parseFloat(jugador.monto_total) - nuevoAbono;

        // validacion: que no exceda el monto total
        if (pendiente < 0) {
            return res.status(400).json({
                error: `Valor maximo del monto`
            });
        };

        //determinar estado pagago-pendiente
        const nuevoEstado = pendiente === 0 ? 'pagado' : 'pendiente'

        //actualizar jugador
        await pool.query(
            'UPDATE jugador SET monto_abonado = ?, estado_pago = ? WHERE id = ?',
            [nuevoAbono, nuevoEstado, id]
        );

        res.json({
            success: true,
            nuevo_abono: nuevoAbono,
            pendiente: pendiente,
            estado: nuevoEstado
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al procesar el abono" });
    }

};


export const addComprobantes = async (req, res) => {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "No se subio ningún archivo" })
    };

    try {

        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(UPLOADS_DIR, fileName);

        fs.renameSync(file.path, filePath);
        await pool.query('INSERT INTO comprobantes (jugador_id, ruta_archivo) VALUES (?, ?)', [id, fileName]);

        res.json({
            success: true,
            message: "Archivo Subido",
            fileName: fileName
        })
    } catch (error) {
        console.error('Error al agregar comprobante:', error);
        res.status(500).json({ error: 'Error al agregar comprobante' });
    };
};

export const getAllComprobantes = async (req, res) => {
    const { jugador_id } = req.params;

    try {
        const [rows] = await pool.query('SELECT id, ruta_archivo FROM comprobantes WHERE jugador_id = ?', [jugador_id]);

        if (rows.length === 0) {
            return res.json([]);
        };

        const comprobantes = rows.map(row => ({
            id: row.id,
            ruta_archivo: row.ruta_archivo
        }));

        res.json(comprobantes);
    } catch (error) {
        console.error('Error al obtener comprobantes:', error);
        res.status(500).json({ error: 'Error al obtener comprobantes' });
    };
};

export const getComprobantes = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            'SELECT ruta_archivo FROM comprobantes WHERE jugador_id = ?',
            [id]
        );

        if (!rows.length || !rows[0].ruta_archivo) {
            return res.status(404).json({ error: "Comprobante no encontrado" });
        };

        const filePath = path.join(UPLOADS_DIR, rows[0].ruta_archivo);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Archivo no encontrado" });
        };

        // Determinar el tipo mime
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.pdf': 'application/pdf'
        };

        const mimeType = mimeTypes[ext] || 'application/octet-stream' // mime generico

        // Enviar al cliente:
        res.setHeader('Content-Type', mimeType);
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error al obtener imagen:', error);
        res.status(500).json({ error: 'Error al cargar imagen' });
    }
};

export const updateComprobante = async (req, res) => {

    const { id } = req.params;
    const file = req.file;

    // Validacion:
    if (!file) {
        res.status(400).json({ error: "No se ha subido ningún archivo" })
    };

    try {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(UPLOADS_DIR, fileName);

        fs.renameSync(file.path, filePath);

        // Verificar si existe un comprobante
        const [existing] = await pool.query('SELECT * FROM comprobantes WHERE jugador_id = ?', [id]);

        if (existing.length > 0) {

            // Condicion: Eliminar el archivo antiguo
            const olfdFilePath = path.join(UPLOADS_DIR, existing[0].ruta_archivo);
            if (fs.existsSync(olfdFilePath)) {
                fs.unlinkSync(olfdFilePath);
            };

            await pool.query('UPDATE comprobantes SET ruta_archivo = ? WHERE jugador_id = ?', [fileName, id]);
        } else {
            await pool.query('INSERT INTO comprobantes (jugador_id, ruta_archivo) VALUES (?, ?)', [id, fileName]);
        };

        res.json({
            success: true,
            message: "Comprobante Actualizado"
        })

    } catch (error) {
        console.error('Error al actualizar el comprobante:', error);
        res.status(500).json({ error: 'Error al actualizar el comprobante' });
    };
};

export const deleteComprobante = async (req, res) => {

    const { comprobanteId } = req.params;

    try {

        const [rows] = await pool.query('SELECT ruta_archivo FROM comprobantes WHERE id = ?', [comprobanteId]);

        const [result] = await pool.query('DELETE FROM comprobantes WHERE id = ?', [comprobanteId]);

        if (result.affectedRows === 0) {
            return res.status(500).json({ error: "Comprobante no encontrado" })
        }

        // Eliminar el archivo Fisico:
        if (rows.length > 0 && rows[0].ruta_archivo) {
            const filePath = path.join(UPLOADS_DIR, rows[0].ruta_archivo);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            };
        };

        res.json({
            success: true,
            message: "Archivo Eliminado"
        });
    } catch (error) {
        console.error('Error al eliminar comprobante:', error);

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(500).json({
                error: 'No se puede eliminar: existen registros dependientes'
            });
        };

        res.status(500).json({ error: 'Error al eliminar comprobante' });
    }
};

export const deleteAllJugadores = async (req, res) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        // Obtener las rutas de las imagenes
        const [comprobantes] = await connection.query('SELECT ruta_archivo FROM comprobantes');
        const [cardPub] = await connection.query('SELECT ruta_archivo FROM card_pub');

        // Eliminar el registro de la BD
        await connection.query('DELETE FROM comprobantes');
        await connection.query('DELETE FROM numeros_boletos');
        await connection.query('DELETE FROM jugador');

        await connection.commit();

        // Elimninar Archivos Fisicos_
        comprobantes.forEach(comprobante => {
            if (comprobante.ruta_archivo) {
                const filePath = path.join(UPLOADS_DIR, comprobante.ruta_archivo);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                };
            };
        })

        cardPub.forEach(card => {
            if (card.ruta_archivo) {
                const filePath = path.join(UPLOADS_DIR, card.ruta_archivo);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                };
            };
        })

        res.json({
            success: true,
            message: "Todos los jugadores fueron eliminados"
        });
    } catch (error) {

        await connection.rollback();

        console.error("Error al intentar eliminar todos los jugadores");
        res.status(500).json({
            error: "Error al eliminar todos los jugadores",
            details: error.message
        });
    } finally {
        connection.release();
    }
};