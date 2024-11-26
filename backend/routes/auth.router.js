const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller'); // Importa el controlador

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/recover-password', authController.recoverPassword);

module.exports = router;
