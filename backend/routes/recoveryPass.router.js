const express = require('express');
const router = express.Router();
const recoveryPassController = require('../controllers/recoveryPass.controller'); // Importa el controlador

router.post('/', recoveryPassController.sendEmail); // Ruta para enviar el correo

module.exports = router;
