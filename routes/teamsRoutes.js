import express from 'express';
import {pool} from '../db_config/db.js';
import { teamCreateSchema } from '../shcemas/teamsSchema.js';
const router = express.Router();


// Ruta para obtener todos los equipos
router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM teams;');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los Equipos' });
    }
  });
  
  //Ruta para obtener un equipo por id

  router.get(':id', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM teams WHERE id=$1', [req.params.id]);
      if(result.rows.length > 0){
        res.json(result.rows[0]);
      }else{
        res.status(404).json({ message: 'El equipo no fue encontrado'})
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el equipo' });
    }
  })

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

  //Borrar un equipo

  router.delete('/delete/:id', async (req,res)  =>{
    try{
      const { id } = req.params;
      const result = await pool.query('DELETE FROM teams WHERE id=$1', [id]);
      if(result.rowCount > 0){
        res.json({message: 'El equipo ha sido eliminado'})
      }else{
        res.status(404).json({message: 'El equipo no fue encontrado'})
      }
    }catch(e){
      console.error(e);
      res.status(500).json({message: 'Error al borrar el equipo'})
    }
  })


  //modificar un equipo 

  router.put('/update/:id', async (req, res) => {
    try {
        const { name, description, category_id, image_url } = req.body;
        const { id } = req.params;
        

        // Fetch the existing data for the team
        const existingResult = await pool.query('SELECT * FROM teams WHERE id = $1', [id]);
        const existingTeam = existingResult.rows[0];

        // Check if the team exists
        if (!existingTeam) {
            return res.status(404).json({ message: 'El equipo no fue encontrado' });
        }

        // Merge existing data with the new data from the request
        const updatedTeam = {
            name: name?? existingTeam.name,  // Use the new value if provided, otherwise use the existing value.
            description: description ?? existingTeam.description,
            category_id: category_id ?? existingTeam.category_id,
            image_url: image_url ?? existingTeam.image_url,
        };

        // Execute the update with the merged data
        const result = await pool.query(
            `UPDATE teams 
             SET description = $1, category_id = $2, image_url = $3 , name = $4
             WHERE id = $5 RETURNING *`,
            [updatedTeam.description, updatedTeam.category_id, updatedTeam.image_url, updatedTeam.name, id]
        );

        res.json(result.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al modificar el equipo' });
    }
});

  

  export default router;