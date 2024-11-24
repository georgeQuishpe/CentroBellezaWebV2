const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/service.controller');

router
    .get('/', servicesController.get)
    .get('/:id', servicesController.getById)
    .post('/', servicesController.create)
    .put('/:id', servicesController.update)
    .delete('/:id', servicesController.remove);

module.exports = router;