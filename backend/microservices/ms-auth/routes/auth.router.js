const express = require('express');
const jwt = require('jsonwebtoken'); // Añade esta línea
const router = express.Router();
const { config } = require('../config/config'); // Asegúrate de que esta importación existe

const { signup, login, recoverPassword, resetPassword } = require('../controllers/auth.controller');

// Rutas de autenticación
router.post('/signup', signup);
router.post('/login', login);
router.post('/recover-password', recoverPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Asegúrate que config.jwtSecret existe
        if (!config.jwtSecret) {
            throw new Error('JWT secret not configured');
        }

        // Verificar token actual
        // const decoded = jwt.verify(token, config.jwtSecret, { ignoreExpiration: true });
        // Verifica el token con la clave secreta
        const decoded = jwt.verify(token, config.jwtSecret);

        // Buscar usuario
        const user = await service.findUserById(decoded.sub);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generar nuevo token
        const newToken = jwt.sign({
            sub: user.id,
            email: user.email,
            rol: user.rol,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hora
        }, config.jwtSecret);

        // Devolver nuevo token
        res.json({ token: newToken });

    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({
            message: 'Error refreshing token',
            error: error.message
        });
    }
});

module.exports = router;