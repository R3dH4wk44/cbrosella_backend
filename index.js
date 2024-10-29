import express from "express";
import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();
const app = express();
const { Pool } = pkg;
const port = process.env.PORT || 8080;


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Conexión exitosa a PostgreSQL', time: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al conectar a la base de datos' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});