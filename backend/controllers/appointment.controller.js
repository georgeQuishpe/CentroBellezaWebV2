const AppointmentsService = require('../services/appointments.service');
const service = new AppointmentsService();

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

const getByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await service.findByUser(userId); // Utiliza un método en el servicio
        res.json(response);
    } catch (error) {
        console.error("Error en getByUser:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const response = await service.create(req.body);
        res.json({ success: true, data: response });
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


const getAvailableHours = async (req, res) => {
    try {
        const { date } = req.params;
        const hours = await service.getAvailableHours(date);
        res.json(hours);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




module.exports = {
    get,
    getById,
    getByUser,
    create,
    update,
    remove,
    getAvailableHours, // Incluye solo los controladores necesarios
};
