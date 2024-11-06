import express from 'express';
import {pool} from '../db_config/db.js';

const router = express.Router();


// Ruta para obtener todos los partidos
router.get('/all', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM game;');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los partidos' });
    }
  });
  
// Rura para seleccionar partidos por equipo

router.get('/team/:id', async (req, res) => {
  const equipoId = req.params.id;
  try{
    const result = await pool.query(
      `SELECT 
         game.id AS game_id,
         game.team_id,
         teams.name AS team_name,
         game.rival,
         game.team_score,
         game.rival_score,
         game.is_local
       FROM 
         game
       JOIN 
         teams ON game.team_id = teams.id
       WHERE 
         game.team_id = $1`,
      [equipoId]
    );
    if(result.rows.length === 0){
      res.status(404).json({message: "No se ha encontrado el equipo."});
    }
    res.json(result.rows);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Error al seleccionar partidos por equipo' });
  }
})
  // Otras rutas específicas para usuarios pueden ir aquí
  
  // Ruta para crear un nuevo partido

  router.post('/create', async (req, res) => {
    const { team_id, rival, team_score, rival_score, is_local } = req.body;
    try{
      const result = await pool.query(
        'INSERT INTO game (team_id, rival, team_score, rival_score, is_local) VALUES ($1, $2, $3, $4, $5)',
        [team_id, rival, team_score, rival_score, is_local]
      );

      res.json({ message: 'El partido se ha creado correctamente' });
    }catch(e) {
      console.error(e);
      res.status(500).json({ error: 'Error al crear el partido' });
    }

      })
  export default router;