const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointment.controller');

router
    .get('/', appointmentsController.get)
    .get('/:id', appointmentsController.getById)
    .post('/', appointmentsController.create)
    .put('/:id', appointmentsController.update)
    .delete('/:id', appointmentsController.remove);

module.exports = router;