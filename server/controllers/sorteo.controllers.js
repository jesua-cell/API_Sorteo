import pool from '../config/db.js';

export const mainSorteo = (req, res) => {
    res.send("Mondongo Mondongo Mondongo Mondongo Mondongo Mondongo ")
}
//GET
export const getJugadores = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM jugador');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al Obtener los Datos de los Juegadores" })
    }
};

//POST
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
            nombres_apellidos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al registrar Jugador'});
    }
};