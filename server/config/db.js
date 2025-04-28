import { createPool } from 'mysql2/promise'

export const pool = createPool({
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "sorteo",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    port: process.env.DB_PORT || 3306
})