const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/service.controller');
const { authMiddleware, isAdmin } = require('../auth.middleware');

// Rutas públicas (no requieren autenticación)
router.get('/', servicesController.get);
router.get('/:id', servicesController.getById);

// Aplicar middleware de autenticación para las rutas protegidas
router.use(authMiddleware);
// Rutas que requieren rol de admin
router.post('/', isAdmin, servicesController.create);
router.put('/:id', isAdmin, servicesController.update);
router.delete('/:id', isAdmin, servicesController.remove);

module.exports = router;