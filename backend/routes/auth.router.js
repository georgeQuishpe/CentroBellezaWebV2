const express = require('express');
const router = express.Router();
const { signup, login, recoverPassword, resetPassword } = require('../controllers/auth.controller');

// Rutas de autenticación
router.post('/signup', signup);
router.post('/login', login);
router.post('/recover-password', recoverPassword);
router.post('/reset-password', resetPassword);

module.exports = router;