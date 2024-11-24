const express = require('express');
const router = express.Router();
const AppointmentsController = require('../controllers/appointment.controller');

router
    .get('/', AppointmentsController.get)
    .get('/:id', AppointmentsController.getById)
    .post('/', AppointmentsController.create)
    .put('/:id', AppointmentsController.update)
    .delete('/:id', AppointmentsController.remove);

module.exports = router;