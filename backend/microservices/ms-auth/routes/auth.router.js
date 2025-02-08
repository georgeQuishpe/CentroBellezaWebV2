const express = require('express');
const router = express.Router();
const { signup, login, recoverPassword, resetPassword } = require('../controllers/auth.controller');

// Rutas de autenticación
router.post('/signup', signup);
router.post('/login', login);
router.post('/recover-password', recoverPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const decoded = jwt.verify(refreshToken, config.jwtSecret);

        if (decoded.type !== 'refresh') {
            throw new Error('Token inválido');
        }

        const user = await service.usersService.findById(decoded.sub);
        const newToken = service.generateToken(user);

        res.json({ token: newToken });
    } catch (error) {
        next(error);
    }
});

module.exports = router;