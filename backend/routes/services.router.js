const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/service.controller');


const isAdmin = (req, res, next) => {
    if (req.user?.rol !== 'Admin') {
        return res.status(403).json({ success: false, message: 'Acceso denegado' });
    }
    next();
};

router.post('/', isAdmin, servicesController.create);
router.put('/:id', isAdmin, servicesController.update);
router.delete('/:id', isAdmin, servicesController.remove);


router
    .get('/', servicesController.get)
    .get('/:id', servicesController.getById)
    .post('/', servicesController.create)
    .put('/:id', servicesController.update)
    .delete('/:id', servicesController.remove);

module.exports = router;