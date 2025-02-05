const { models } = require('../libs/sequelize');

class ServicesService {

    constructor() { }

    async find() {
        const res = await models.Service.findAll();
        return res;
    }

    async findById(id) {
        const res = await models.Service.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await models.Service.create(data);
        return res;
    }

    async update(id, data) {
        const model = await this.findById(id);
        const res = await model.update(data);
        return res;
    }

    async delete(id) {
        const model = await this.findById(id);
        const res = await model.destroy();
        return res;
    }

}

module.exports = ServicesService;