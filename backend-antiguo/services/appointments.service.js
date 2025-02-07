const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');

class AppointmentsService {
    constructor() { }

    async create(data) {
        try {
            // Verifica si el horario ya está reservado
            const existingAppointment = await models.Appointment.findOne({
                where: {
                    fecha: data.fecha,
                    servicioId: data.servicioId,
                },
            });

            if (existingAppointment) {
                throw new Error("El horario ya está reservado");
            }

            // Crea la cita
            const appointment = await models.Appointment.create(data);
            return appointment;
        } catch (error) {
            console.error("Error en create:", error);
            throw new Error("No se pudo crear la cita");
        }
    }


    async find() {
        try {
            const res = await models.Appointment.findAll({
                include: [
                    {
                        model: models.Service,
                        as: 'servicio'
                    },
                    {
                        model: models.User,  // Añadir la relación con User
                        as: 'usuario',
                        attributes: ['id', 'nombre', 'email']
                    }
                ]
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
                include: [
                    {
                        model: models.Service,
                        as: 'servicio'
                    },
                    {
                        model: models.User,  // Añadir la relación con User
                        as: 'usuario',
                        attributes: ['id', 'nombre', 'email']
                    }
                ]
            });
            return res;
        } catch (error) {
            console.error("Error en findById:", error);
            throw error;
        }
    }

    async findByUser(userId) {
        try {
            const res = await models.Appointment.findAll({
                where: {
                    usuarioId: userId  // Cambiado de userId a usuarioId
                },
                include: [
                    {
                        model: models.Service,
                        as: 'servicio'
                    },
                    {
                        model: models.User,
                        as: 'usuario',
                        attributes: ['id', 'nombre', 'email']
                    }
                ]
            });
            return res;
        } catch (error) {
            console.error("Error en findByUser:", error);
            throw error;
        }
    }

    async update(id, data, userRole) {
        try {
            const appointment = await this.findById(id);
            if (!appointment) {
                throw new Error("Cita no encontrada");
            }

            // Permitir actualización si es admin
            if (userRole !== 'Admin') {
                throw new Error("No tienes permiso para editar esta cita");
            }

            // Validar disponibilidad de la nueva fecha/hora si se está actualizando
            if (data.fecha) {
                const existingAppointment = await models.Appointment.findOne({
                    where: {
                        fecha: data.fecha,
                        id: { [Op.ne]: id }
                    }
                });

                if (existingAppointment) {
                    throw new Error("El horario seleccionado no está disponible");
                }
            }

            await appointment.update(data);
            return this.findById(id); // Retornar con relaciones actualizadas
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }

    async delete(id, userRole) {
        try {
            const appointment = await this.findById(id);
            if (!appointment) {
                throw new Error("Cita no encontrada");
            }

            // Verificar si es admin
            if (userRole !== 'Admin') {
                throw new Error("No tienes permiso para eliminar esta cita");
            }

            await appointment.destroy();
            return { success: true, message: 'Cita eliminada exitosamente' };
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }

    // ... resto de los métodos ...

    async updateStatus(id, status, userRole) {
        try {
            const appointment = await this.findById(id);
            if (!appointment) {
                throw new Error("Cita no encontrada");
            }

            // Permitir cambios de estado solo para admin
            if (userRole !== 'Admin') {
                throw new Error("No tienes permiso para cambiar el estado de la cita");
            }

            await appointment.update({ estado: status });
            return this.findById(id); // Retornar con relaciones actualizadas
        } catch (error) {
            console.error("Error en updateStatus:", error);
            throw error;
        }
    }

    async getAvailableHours(date) {
        try {
            // Define las horas de trabajo
            const workingHours = [
                '09:00', '10:00', '11:00', '12:00',
                '14:00', '15:00', '16:00', '17:00',
            ];

            // Busca citas existentes para la fecha especificada
            const appointments = await models.Appointment.findAll({
                where: {
                    fecha: {
                        [Op.gte]: new Date(date),
                        [Op.lt]: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
                    },
                },
                attributes: ['fecha'], // Solo necesitamos las horas
            });

            // Extrae las horas reservadas
            const reservedHours = appointments.map((appt) =>
                new Date(appt.fecha).toISOString().split('T')[1].slice(0, 5)
            );

            // Filtra las horas disponibles
            const availableHours = workingHours.filter(
                (hour) => !reservedHours.includes(hour)
            );

            return availableHours;
        } catch (error) {
            console.error('Error en getAvailableHours:', error);
            throw new Error('No se pudieron obtener las horas disponibles');
        }
    }


}

module.exports = AppointmentsService;