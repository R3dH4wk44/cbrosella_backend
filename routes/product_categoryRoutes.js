import express from 'express';
import {pool} from '../db_config/db.js';
const router = express.Router();


// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM products_category;');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener las categorias de productos' });
    }
  });
  
  router.post('/create', async (req, res) => {   

    const { name, description } = req.body;
    
    const category = await pool.query('SELECT * FROM products_category WHERE name = $1', [name])
    if(category.rows.length > 0) {
      return res.status(409).json({ message: 'La categoria de productos ya existe' });
    }
    const result = await pool.query('INSERT INTO products_category (name,description) VALUES ($1,$2)', [name, description])
        res.json({ message: 'La categoria se ha creado correctamente'});
  })
  // Otras rutas específicas para usuarios pueden ir aquí
  
  export default router;