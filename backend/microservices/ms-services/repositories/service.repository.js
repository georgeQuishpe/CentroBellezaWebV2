const { models } = require('../libs/sequelize');

class ServiceRepository {
    async findAll() {
        return await models.Service.findAll();
    }

    async findById(id) {
        return await models.Service.findByPk(id);
    }

    async create(data) {
        return await models.Service.create(data);
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
