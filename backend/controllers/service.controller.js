const ServicesService = require('../services/services.service');
const service = new ServicesService();

const get = async (req, res) => {
    try {
        const response = await service.find();
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const getById = async (req, res) => {
    try {
        const response = await service.findById(req.params.id);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const Joi = require('joi');

const serviceSchema = Joi.object({
    nombre: Joi.string().max(100).required(),
    descripcion: Joi.string().allow(''),
    precio: Joi.number().positive().required(),
    duracion: Joi.number().integer().positive().required(),
    estado: Joi.boolean().required(),
});

const create = async (req, res) => {
    try {
        const { error } = serviceSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const response = await service.create(req.body);
        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};


const update = async (req, res) => {
    try {
        const response = await service.update(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const remove = async (req, res) => {
    try {
        const response = await service.delete(req.params.id);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

module.exports = {
    get, getById, create, update, remove, get
};