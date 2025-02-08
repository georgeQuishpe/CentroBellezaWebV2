const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');

class AppointmentsRepository {
    async create(data) {
        return await models.Appointment.create(data);
    }

    async findAll() {
        return await models.Appointment.findAll({
        });
    }

    async findById(id) {
        return await models.Appointment.findByPk(id);
    }

    // async findByUser(userId) {
    //     return await models.Appointment.findAll({
    //         where: { usuarioId: userId }
    //     });
    // }

    async findByUser(userId, options = {}) {
        return await models.Appointment.findAll({
            where: { usuarioId: userId },
            ...options,
            include: [
                {
                    model: models.Service,
                    as: 'servicio',
                    attributes: ['nombre', 'precio', 'duracion']
                }
            ]
        });
    }


    //     async findByUser(userId) {
    //     return await models.Appointment.findAll({
    //         where: { usuarioId: userId },
    //         include: [
    //             {
    //                 model: models.Service,
    //                 as: 'servicio',
    //                 attributes: ['id', 'nombre', 'precio', 'duracion']
    //             },
    //             {
    //                 model: models.User,
    //                 as: 'usuario',
    //                 attributes: ['id', 'nombre', 'email']
    //             }
    //         ]
    //     });
    // }

    async findByDateAndService(fecha, servicioId) {
        return await models.Appointment.findOne({
            where: { fecha, servicioId }
        });
    }

    async update(id, data) {
        const appointment = await this.findById(id);
        if (!appointment) return null;
        await appointment.update(data);
        return this.findById(id);
    }

    async delete(id) {
        const appointment = await this.findById(id);
        if (!appointment) return null;
        await appointment.destroy();
        return { success: true, message: 'Cita eliminada exitosamente' };
    }

    async getAvailableHours(date) {
        const workingHours = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

        const appointments = await models.Appointment.findAll({
            where: {
                fecha: {
                    [Op.gte]: new Date(date),
                    [Op.lt]: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
                }
            },
            attributes: ['fecha']
        });

        const reservedHours = appointments.map(appt => new Date(appt.fecha).toISOString().split('T')[1].slice(0, 5));
        return workingHours.filter(hour => !reservedHours.includes(hour));
    }
}

module.exports = new AppointmentsRepository();
