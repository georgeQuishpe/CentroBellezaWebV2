const UsersService = require('../services/users.service');
const service = new UsersService();

const get = async (req, res) => {
    try {
        const response = await service.find();
        console.log(response);
        
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

const getByEmail = async (req, res) => {
    try {
        const response = await service.findByEmail(req.params.email);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const create = async (req, res) => {
    try {
        const response = await service.create(req.body);
        res.json({success: true, data: response});
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

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
    get, getById, getByEmail, create, update, remove
};

