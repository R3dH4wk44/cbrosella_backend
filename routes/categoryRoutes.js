import express from 'express';
import {pool} from '../db_config/db.js';


const router = express.Router();
console.log(process.env.DATABASE_URL);

router.get('/all', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM category;');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener las categorias' });
    }
  });
  
  
  export default router;