const AppointmentsRepository = require('../repositories/appointments.repository');
const { models } = require('../libs/sequelize');
const axios = require('axios');


class AppointmentsService {
    constructor() { }

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

    // async create(data) {
    //     try {
    //         // Validar fecha
    //         if (new Date(data.fecha) < new Date()) {
    //             throw new Error("La fecha de la cita debe ser futura");
    //         }

    //         const existingAppointment = await AppointmentsRepository.findByDateAndService(data.fecha, data.servicioId);
    //         if (existingAppointment) {
    //             throw new Error("El horario ya está reservado");
    //         }

    //         const appointment = await AppointmentsRepository.create(data);

    //         // Retornar con relaciones
    //         return await AppointmentsRepository.findById(appointment.id);
    //     } catch (error) {
    //         console.error("Error en create:", error);
    //         throw error;
    //     }
    // }

    async find() {
        return await AppointmentsRepository.findAll();
    }

    async findById(id) {
        return await AppointmentsRepository.findById(id);
    }

    // async findByUser(userId) {
    //     // return await AppointmentsRepository.findByUser(userId);
    //     return await AppointmentsRepository.findByUser(userId, {
    //         include: [
    //             {
    //                 model: models.Service,
    //                 as: 'servicio',
    //                 attributes: ['nombre', 'precio', 'duracion']
    //             }
    //         ]
    //     });
    // }
    async findByUser(userId) {
        try {
            const appointments = await AppointmentsRepository.findByUser(userId);

            try {

                // Obtener datos de servicios
                // Obtener datos de servicios con retry y timeout
                // const servicesData = await axios.get(`http://ms-services:5002/api/v1/services`...);

                console.log('Intentando conectar a ms-services...');
                const servicesUrl = 'http://ms-services:5002/api/v1/services';
                console.log('URL del servicio:', servicesUrl);

                // const servicesData = await axios.get(`http://ms-services:5002/api/v1/services`, {
                //     timeout: 5000,
                //     retry: 3,
                //     retryDelay: 1000
                // });

                const servicesData = await axios.get(servicesUrl, {
                    timeout: 5000,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                console.log('Respuesta recibida de ms-services');

                const services = servicesData.data;

                // Obtener datos de usuario
                // Obtener datos de usuario
                const userData = await axios.get(`http://ms-auth:5001/api/v1/users/${userId}`, {
                    timeout: 5000
                });
                const user = userData.data;

                // Mapear y combinar la información
                return appointments.map(appointment => {
                    const service = services.find(s => s.id === appointment.servicioId);
                    return {
                        // ...appointment.toJSON(),
                        // servicio: service || null,
                        // usuario: user || null
                        ...appointment.toJSON(),
                        servicio: service || {
                            nombre: "Servicio no disponible",
                            precio: 0,
                            duracion: 0
                        },
                        usuario: user || null
                    };
                });
            } catch (serviceError) {
                console.error("Error al obtener datos externos:", serviceError);
                // Retornar las citas con información mínima en caso de error
                return appointments.map(appointment => ({
                    ...appointment.toJSON(),
                    servicio: {
                        nombre: "Servicio no disponible",
                        precio: 0,
                        duracion: 0
                    },
                    usuario: null
                }));
            }
        } catch (error) {
            console.error('Error detallado:', {
                code: error.code,
                message: error.message,
                config: error.config
            });
            throw error;
        }
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
