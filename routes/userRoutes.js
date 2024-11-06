import express from 'express';
import { pool, jwtSecret } from '../db_config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { userLoginSchema, userRegisterSchema } from '../shcemas/userSchema.js';
import cookieParser from 'cookie-parser';

const router = express.Router();

router.use(cookieParser());

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;  

    if (!token) return res.status(401).json({ message: 'No token provided.' });

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Token expired.' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ message: 'Invalid token.' });
            } else {        
                return res.status(403).json({ message: 'Authentication failed.' });
            }
        }

        req.user = user;

        const expiresIn = req.user.rememberMe ? '7d' : '1h';  
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn });

        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  
            maxAge: expiresIn === '7d' ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,  
        });

        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(401).json({ message: 'Not an admin.' });
    next();
};

router.post('/login', async (req, res) => {
    try {

        userLoginSchema.parse(req.body);

        const { email, password, rememberMe } = req.body;

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: `No s'ha trobat l'usuari` });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Contrassenya incorrecte' });
        }

        const payload = { id: user.id, email: user.email, role: user.is_admin ? 'admin' : 'client', rememberMe };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: rememberMe ? '7d' : '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
              
        });

        res.json({ message: 'Login successful', role: user.is_admin ? 'admin' : 'client' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del Servidor' });
    }
});

router.post('/admin', verifyToken, isAdmin, (req, res) => {
    res.status(200).json({ message: 'Welcome Admin' });
});

router.put('/update', verifyToken, async (req, res) => {
    try {
        // Update user logic
        const { id } = req.user;
        const { name, phone, password, email } = req.body;

        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const existingUser = result.rows[0];

        if (!existingUser) {
            return res.status(404).json({ message: `No s'ha trobat l'usuari` });
        }

        // Update logic
        const updatedUser = {
            name: name ?? existingUser.name,
            phone: phone ?? existingUser.phone,
            email: email ?? existingUser.email,
            password: password ? await bcrypt.hash(password, 10) : existingUser.password,
        };

        const updateResult = await pool.query(
            'UPDATE users SET name = $1, phone = $2, email = $3, password = $4 WHERE id = $5 RETURNING *',
            [updatedUser.name, updatedUser.phone, updatedUser.email, updatedUser.password, id]
        );

        res.json(updateResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Error al actualitzar l'usuari` });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', { path: '/' });  
    res.status(200).send({ message: 'Logout successful' });
});

router.get('/user', verifyToken, async (req, res) => {
    try{
        const user = req.user;
        const userData = await pool.query('SELECT (name, email, phone, is_admin) FROM users WHERE user_id = $1', user.id);
        if(userData.length > 0){
            res.json(userData.rows[0]);
        }else{
            res.status(404).json({message: `No s'ha trobat l'usuari`});
        }
    }catch(e){
        console.error(e);
        res.status(500).json({message: `Error al obtenir les dades de l'Usuari`});
    }
   
})
export default router;
