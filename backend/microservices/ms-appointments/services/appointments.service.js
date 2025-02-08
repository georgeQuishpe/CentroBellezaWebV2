const AppointmentsRepository = require('../repositories/appointment.repository');

class AppointmentsService {
    constructor() {}

    async create(data) {
        try {
            const existingAppointment = await AppointmentsRepository.findByDateAndService(data.fecha, data.servicioId);
            if (existingAppointment) {
                throw new Error("El horario ya está reservado");
            }

            return await AppointmentsRepository.create(data);
        } catch (error) {
            console.error("Error en create:", error);
            throw new Error("No se pudo crear la cita");
        }
    }

    async find() {
        return await AppointmentsRepository.findAll();
    }

    async findById(id) {
        return await AppointmentsRepository.findById(id);
    }

    async findByUser(userId) {
        return await AppointmentsRepository.findByUser(userId);
    }

    async update(id, data, userRole) {
        try {
            if (userRole !== 'Admin') throw new Error("No tienes permiso para editar esta cita");

            const updatedAppointment = await AppointmentsRepository.update(id, data);
            if (!updatedAppointment) throw new Error("Cita no encontrada");
            
            return updatedAppointment;
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }

    async delete(id, userRole) {
        try {
            if (userRole !== 'Admin') throw new Error("No tienes permiso para eliminar esta cita");

            const result = await AppointmentsRepository.delete(id);
            if (!result) throw new Error("Cita no encontrada");

            return result;
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }

    async getAvailableHours(date) {
        return await AppointmentsRepository.getAvailableHours(date);
    }
}

module.exports = AppointmentsService;
