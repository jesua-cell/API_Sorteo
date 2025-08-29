import bcrypt from "bcryptjs";
import pool from '../config/db.js';

async function hashPasswords() {
    const saltRounds = 8;
    const admins = [
        { id: 1, password: 'alejandra1555pin' },
        { id: 2, password: 'donney1666pin' }
    ];

    for (const admin of admins) {
        const hashedPassword = await bcrypt.hash(admin.password, saltRounds);
        await pool.query(
            `UPDATE admin SET contrasenia = ? WHERE id = ?`, [hashedPassword, admin.id]
        );
        console.log(`Contraseña Actualizada: ${admin.id}`);
    };
};

hashPasswords()
    .then(() => {
        console.log("Todas las contraseñas han sido actualizadas");
        process.exit();
    })
    .catch(error => {
        console.error("Error", error);
        process.exit(1);
    })
