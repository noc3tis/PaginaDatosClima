require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(express.json({limit: '10mb'}));
app.use(cors());
app.use(express.static('public'));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false}
}); 

app.get('/prueba-db', async (req, res) => {
    try{
        const resultado = await pool.query('SELECT NOW()');
        res.json({mensaje: 'Conexion exitosa', horaServidor: resultado.rows[0]});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error conectando a la BD'});
    }
});

app.post('/guardar-clima', async (req, res) =>{
    
    console.log("Recibido:", req.body);
    const {date, time, temp_out, hi_temp, low_temp, out_hum, dew_pt, wind_speed, wind_dir, wind_run, hi_speed, hi_dir, wind_chill, heat_index, thw_index, thsw_index, bar, rain, rain_rate, solar_rad, solar_energy, hi_solar_rad, uv_index, uv_dose, hi_uv, in_temp, in_hum, in_dew, in_heat, in_emc, in_air_density, et, wind_samp, iss_recept} = req.body;
    try{
        const query = 'INSERT INTO datos (date, time, temp_out, hi_temp, low_temp, out_hum, dew_pt, wind_speed, wind_dir, wind_run, hi_speed, hi_dir, wind_chill, heat_index, thw_index, thsw_index, bar, rain, rain_rate, solar_rad, solar_energy, hi_solar_rad, uv_index, uv_dose, hi_uv, in_temp, in_hum, in_dew, in_heat, in_emc, in_air_density, et, wind_samp, iss_recept) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34) RETURNING *';
        const values = [date, time, temp_out, hi_temp, low_temp, out_hum, dew_pt, wind_speed, wind_dir, wind_run, hi_speed, hi_dir, wind_chill, heat_index, thw_index, thsw_index, bar, rain, rain_rate, solar_rad, solar_energy, hi_solar_rad, uv_index, uv_dose, hi_uv, in_temp, in_hum, in_dew, in_heat, in_emc, in_air_density, et, wind_samp, iss_recept].map(v => v === undefined ? null : v);
    
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    }catch (err) {
        console.error("Error en DB:", err.message);
        res.status(500).json({error: err.message, detail:err.detail});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});