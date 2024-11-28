const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointment.controller');
const { authMiddleware, isAdmin } = require('../auth.middleware'); // Corregir la importación

// Rutas públicas (sin autenticación)
router.get('/available/:date', appointmentsController.getAvailableHours);

// Aplicar middleware de autenticación a todas las rutas siguientes
router.use(authMiddleware);

// Rutas para usuarios autenticados (clientes y admin)
router.get('/user/:userId', appointmentsController.getByUser);
router.post('/', appointmentsController.create);

// Rutas que requieren rol de admin
router.get('/', isAdmin, appointmentsController.get); // Listar todas las citas
router.get('/:id', isAdmin, appointmentsController.getById); // Ver una cita específica
router.put('/:id', isAdmin, appointmentsController.update); // Actualizar cita
router.delete('/:id', isAdmin, appointmentsController.remove); // Eliminar cita

module.exports = router;