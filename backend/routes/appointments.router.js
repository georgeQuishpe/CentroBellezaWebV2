const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointment.controller');

router
    .get('/', appointmentsController.get)
    .get('/:id', appointmentsController.getById)
    .get("/available/:date", appointmentsController.getAvailableHours)
    .get('/user/:userId', appointmentsController.getByUser) // Asegúrate de que exista este controlador
    .post('/', appointmentsController.create)
    .put('/:id', appointmentsController.update)
    .delete('/:id', appointmentsController.remove);

module.exports = router;