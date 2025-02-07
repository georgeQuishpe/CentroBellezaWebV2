const AppointmentsService = require('../services/appointments.service');
const service = new AppointmentsService();

const getAvailableHours = async (req, res) => {
    try {
        const { date } = req.params;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'La fecha es requerida',
            });
        }

        const availableHours = await service.getAvailableHours(date);

        res.status(200).json(availableHours);
    } catch (error) {
        console.error('Error en getAvailableHours:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener las horas disponibles',
        });
    }
};

const get = async (req, res) => {
    try {
        const response = await service.find();
        res.json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getById = async (req, res) => {
    try {
        const response = await service.findById(req.params.id);
        res.json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await service.findByUser(userId);
        res.json(response);
    } catch (error) {
        console.error("Error en getByUser:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const response = await service.create({
            ...req.body,
            userRole: req.user?.rol
        });
        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const update = async (req, res) => {
    try {
        const response = await service.update(
            req.params.id,
            req.body,
            req.user?.rol // Pasar el rol del usuario
        );
        res.json(response);
    } catch (error) {
        res.status(error.message.includes('permiso') ? 403 : 500)
            .json({ success: false, message: error.message });
    }
}

const remove = async (req, res) => {
    try {
        const response = await service.delete(
            req.params.id,
            req.user?.rol  // Pasar el rol en lugar del userId
        );
        res.json(response);
    } catch (error) {
        console.error('Error al eliminar cita:', error);
        res.status(error.message.includes('permiso') ? 403 : 500)
            .json({ success: false, message: error.message });
    }
}

// const getAvailableHours = async (req, res) => {
//     try {
//         const { date } = req.params;
//         const hours = await service.getAvailableHours(date);
//         res.json(hours);
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

module.exports = {
    get,
    getById,
    getByUser,
    create,
    update,
    remove,
    getAvailableHours
};