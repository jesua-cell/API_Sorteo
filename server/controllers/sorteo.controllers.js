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
    const { cedula, celular, comprobante_pago, metodo_pago, pais_estado, referenciaPago, nombres_apellidos } = req.body;
    if (
        !cedula ||
        !celular ||
        !metodo_pago ||
        !pais_estado ||
        !referenciaPago ||
        !nombres_apellidos
    ) {
        return res.status(400).json({ error: 'Faltan completar campos obligatorios' });
    };

    try {
        const [result] = await pool.query(`INSERT INTO jugador (cedula, celular, comprobante_pago, metodo_pago, pais_estado, referenciaPago, nombres_apellidos) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            cedula,
            celular,
            comprobante_pago || null,
            metodo_pago,
            pais_estado,
            referenciaPago,
            nombres_apellidos
        ]);
        res.status(201).json({
            id: result.insertId,
            cedula,
            nombres_apellidos,
            cedula,
            celular,
            comprobante_pago,
            metodo_pago,
            pais_estado,
            referenciaPago,
            nombres_apellidos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar Jugador' });
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
        const [rows] = await pool.query('SELECT * FROM numeros_boletos');
        res.json(rows);
    } catch (error) {
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