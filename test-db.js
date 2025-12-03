require('dotenv').config();
const{ Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

console.log("Probando conexio a:", connectionString);

const pool = new Pool({
    connectionString: connectionString,
    ssl: {rejectUnauthorized:false},
    connectionTimeoutMillis: 5000
});

(async () => {
    try{
        const client = await pool.connect();
        console.log("Conexion Exitosa");
        const res = await client.query('SELECT NOW()');
        console.log("Hora del servidor DB:", res.rows[0]);
        client.release();
    } catch (err) {
        console.error("Error de conexion");
        console.error(err);
    } finally {
        await pool.end();
    }
})();