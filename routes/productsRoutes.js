import express from 'express';
import {pool} from '../db_config/db.js';

const router = express.Router();


// Ruta para obtener todos los usuarios
router.get('/all', async (req, res) => {
    try {
      const products = await pool.query('SELECT * FROM products;');
      const categories = await pool.query('SELECT * FROM product_category');
      res.json( { products: products.rows, categories: categories.rows});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });
  
  // Otras rutas específicas para usuarios pueden ir aquí
  
  export default router;