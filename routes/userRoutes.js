import express from 'express';
import {pool, jwtSecret} from '../db_config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import {userLoginSchema, userRegisterSchema} from '../shcemas/userSchema.js';
const router = express.Router();




const veriftToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtén el token sin 'Bearer'
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            // Verifica el tipo de error y responde con mensajes específicos
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Token expired.' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ message: 'Token inválido.' });
            } else {        
                return res.status(403).json({ message: 'Authentication failed.' });
            }
        }
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {   
    if(req.user.role !== 'admin') return res.status(403).json({ message: 'No es admin'});
    next();
}

// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM users;');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  });
  
  // Otras rutas específicas para usuarios pueden ir aquí
  
  router.post('/login', async (req, res) => {
    
    try{
        // Validacion de datos.

        userLoginSchema.parse(req.body);

        try {
            const { email, password } = req.body;
    
            // 1. Consulta en la base de datos si el usuario existe
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];
    
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
    
            // 2. Verifica que la contraseña es correcta
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
    
            // 3. Genera el token JWT con el id, username y rol del usuario
            const payload = { id: user.id, email: user.email, name: user.name, phone:user.phone, role: user.is_admin ? 'admin' : 'client' };
            const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    
            // 4. Envía el token al cliente
            res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error en el servidor' });
        }

    }catch(error){
        return res.status(400).json({message: 'datos de entrada invalidos'})
    }
    
});


    router.post('/register', async (req, res) => {
        const { name, phone, password, email} = req.body;

        // Verifica que el username no este en uso
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'El nombre de usuario ya está en uso' });
        }

        // Hashea la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserta el nuevo usuario en la base de datos
        const result = await pool.query('INSERT INTO users (name, phone, password, email) VALUES ($1, $2, $3, $4) RETURNING *', [name, phone, hashedPassword, email]);
        const user = result.rows[0];

        // Genera el token JWT con el id, username
        const payload = { id: user.id, username: user.username, role: 'client' };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

        // Envía el token al cliente
        res.json({ token });
    })

    router.post('/admin', veriftToken, isAdmin, (req, res) => {
        res.status(200).json({ message: 'Welcome Amin'});
    })

  export default router;