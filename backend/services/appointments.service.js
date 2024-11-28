const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');  // Añade esta importación

class AppointmentsService {

    constructor() { }

    async find() {
        try {
            const res = await models.Appointment.findAll({
                include: [{
                    model: models.Service,
                    as: 'servicio'
                }]
            });
            return res;
        } catch (error) {
            console.error("Error en find:", error);
            throw error;
        }
    }

    async findById(id) {
        try {
            const res = await models.Appointment.findByPk(id, {
                include: [{
                    model: models.Service,
                    as: 'servicio'
                }]
            });
            return res;
        } catch (error) {
            console.error("Error en findById:", error);
            throw error;
        }
    }

    async create(data) {
        try {
            const res = await models.Appointment.create(data);
            return await this.findById(res.id); // Retorna la cita con sus relaciones
        } catch (error) {
            console.error("Error en create:", error);
            throw error;
        }
    }

    async update(id, data, isAdmin = false) {
        const appointment = await this.findById(id);
        if (!appointment) {
            throw new Error("Cita no encontrada");
        }

        // Si no es admin, verificar permisos
        if (!isAdmin && appointment.usuarioId !== data.usuarioId) {
            throw new Error("No tienes permiso para editar esta cita");
        }

        // Validar disponibilidad de la nueva fecha/hora
        if (data.fecha) {
            const existingAppointment = await this.models.Appointment.findOne({
                where: {
                    fecha: data.fecha,
                    id: { [Op.ne]: id }
                }
            });

            if (existingAppointment) {
                throw new Error("El horario seleccionado no está disponible");
            }
        }

        return await appointment.update(data);
    }

    async delete(id, userId) {
        try {
            const appointment = await this.findById(id);
            if (!appointment) {
                throw new Error("Cita no encontrada");
            }
            if (appointment.usuarioId !== userId) {
                throw new Error("No tienes permiso para eliminar esta cita.");
            }
            return await appointment.destroy();
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }

    async getAvailableHours(date) {
        try {
            const allHours = ["09:00", "12:00", "15:00", "18:00"];
            const appointments = await models.Appointment.findAll({
                where: {
                    fecha: {
                        [Op.between]: [
                            `${date} 00:00:00`,
                            `${date} 23:59:59`
                        ]
                    }
                }
            });

            const reservedHours = appointments.map(appt =>
                appt.fecha.toString().slice(11, 16)
            );
            return allHours.filter(hour => !reservedHours.includes(hour));
        } catch (error) {
            console.error("Error en getAvailableHours:", error);
            throw error;
        }
    }

    async findByUser(userId) {
        try {
            const appointments = await models.Appointment.findAll({
                where: { usuarioId: userId },
                include: [{
                    model: models.Service,
                    as: 'servicio',
                    attributes: ['id', 'nombre', 'descripcion', 'precio']
                }],
                order: [['fecha', 'ASC']]
            });
            return appointments;
        } catch (error) {
            console.error("Error en findByUser:", error);
            throw error;
        }
    }

    async updateStatus(id, status, isAdmin = false) {
        const appointment = await this.findById(id);
        if (!appointment) {
            throw new Error("Cita no encontrada");
        }

        // Solo permitir ciertas transiciones de estado
        const validTransitions = {
            'Pendiente': ['Confirmada', 'Cancelada'],
            'Confirmada': ['Completada', 'Cancelada'],
            'Completada': [],
            'Cancelada': []
        };

        if (!isAdmin && !validTransitions[appointment.estado].includes(status)) {
            throw new Error("Transición de estado no permitida");
        }

        return await appointment.update({ estado: status });
    }

}

module.exports = AppointmentsService;