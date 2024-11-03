import express from 'express';
import {pool} from '../db_config/db.js';

const router = express.Router();


// Ruta para obtener todos los usuarios
router.get('/all', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM game;');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los partidos' });
    }
  });
  
  // Otras rutas específicas para usuarios pueden ir aquí
  
  export default router;