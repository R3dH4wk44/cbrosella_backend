import express from "express";
import dotenv from "dotenv";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from 'url';
import categoryRoute from './routes/categoryRoutes.js';
import userRoute from './routes/userRoutes.js';
import teamsRoute from './routes/teamsRoutes.js';
import postRoute from './routes/postRoutes.js';
import gameRoute from './routes/gamesRoutes.js';
import productsCategoryRoute from './routes/product_categoryRoutes.js';
import productsRoute from './routes/productsRoutes.js';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.resolve(__dirname, './.env') });
const app = express();
const corsOptions = {
  origin: process.env.ORIGIN_URL, 
  credentials: true, 
};

app.use(cors(corsOptions));
const { Pool } = pkg;
const port = process.env.PORT || 8080;

console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());
app.use('/api/users', userRoute);
app.use('/api/category', categoryRoute);
app.use('/api/teams', teamsRoute);
app.use('/api/posts', postRoute);
app.use('/api/games', gameRoute);
app.use('/api/products-category', productsCategoryRoute);
app.use('/api/products', productsRoute);


app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users;');
    res.json({ message: 'Conexión exitosa a PostgreSQL', result: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al conectar a la base de datos' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});