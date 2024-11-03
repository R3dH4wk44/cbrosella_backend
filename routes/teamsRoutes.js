import express from 'express';
import {pool} from '../db_config/db.js';
import { teamCreateSchema } from '../shcemas/teamsSchema.js';
const router = express.Router();


// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM teams;');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los Equipos' });
    }
  });
  

  // Ruta para crear un equipo

  router.post('/create', async (req, res) => {

    try{
      // Validacion de datos.
      teamCreateSchema.parse(req.body);
      try{
        const { name, description, category_id, image_url } = req.body;

        const result = await pool.query('INSERT INTO teams (name, description, category_id, image_url) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, category_id, image_url]);
        res.json(result.rows[0]);
      }catch(e){
        console.error(e);
        return res.status(500).json({message: 'Error al crear el equipo'})
      }
    }catch(e){
      console.error(e);
      return res.status(400).json({message: 'datos de entrada invalidos'})
    }


  })
  // Otras rutas específicas para usuarios pueden ir aquí
  
  export default router;