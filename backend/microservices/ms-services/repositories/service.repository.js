const Service = require('../models/service.model');

class ServiceRepository {
    async findAll() {
        return await Service.findAll();
    }

    async findById(id) {
        return await Service.findByPk(id);
    }

    async create(data) {
        return await Service.create(data);
    }

    async update(id, data) {
        const service = await this.findById(id);
        if (!service) throw new Error('Servicio no encontrado');
        return await service.update(data);
    }

    async delete(id) {
        const service = await this.findById(id);
        if (!service) throw new Error('Servicio no encontrado');
        return await service.destroy();
    }
}

module.exports = ServiceRepository;
