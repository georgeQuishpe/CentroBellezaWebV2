const ServiceRepository = require('../repositories/service.repository');

class ServicesService {
    constructor() {
        this.repository = new ServiceRepository();
    }

    async find() {
        return await this.repository.findAll();
    }

    async findById(id) {
        return await this.repository.findById(id);
    }

    async create(data) {
        return await this.repository.create(data);
    }

    async update(id, data) {
        return await this.repository.update(id, data);
    }

    async delete(id) {
        return await this.repository.delete(id);
    }
}

module.exports = ServicesService;
