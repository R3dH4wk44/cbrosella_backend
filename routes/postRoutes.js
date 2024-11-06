import express from 'express';
import {pool} from '../db_config/db.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM post;');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los posts' });
    }
  });
  

router.get('/:id', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM post WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el post' });
  }
});


router.post('/create', async (req, res) => {   

    const { title, content, featured_image } = req.body;
    
    const post = await pool.query('SELECT * FROM post WHERE title = $1', [title])
    if(post.rows.length > 0) {
      return res.status(409).json({ message: 'El post ya existe' });
    }
    const result = await pool.query('INSERT INTO post (title,content,featured_image) VALUES ($1,$2,$3)', [title, content,featured_image])
        res.json({ message: 'El post se ha creado correctamente'});
  });

  router.put('/update/:id', async (req, res) => {
    const { title, content, featured_image } = req.body;
    const id = parseInt(req.params.id);

    const post = await pool.query('SELECT * FROM post WHERE id = $1', [id]);
    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    const result = await pool.query(
      'UPDATE post SET title=$1, content=$2, featured_image=$3 WHERE id=$4',
      [title, content, featured_image, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'No se ha podido actualizar el post' });
    }

    res.json({ message: 'El post se ha actualizado correctamente' });
  });

  router.delete('/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    const post = await pool.query('SELECT * FROM post WHERE id = $1', [id]);
    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    const result = await pool.query('DELETE FROM post WHERE id=$1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'No se ha podido eliminar el post' });
    }

    res.json({ message: 'El post se ha eliminado correctamente' });
  });

  
  export default router;