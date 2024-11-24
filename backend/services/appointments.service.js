const { models } = require('../libs/sequelize');

class AppointmentsService {

    constructor() {}

    async find(){
        const res = await models.Appointment.findAll();
        return res;
    }

    async findById(id){
        const res = await models.Appointment.findByPk(id);
        return res;
    }

    async create(data){
        const res = await models.Appointment.create(data);
        return res;
    }

    async update(id, data){
        const model = await this.findById(id);
        const res = await model.update(data);
        return res;
    }

    async delete(id){
        const model = await this.findById(id);
        const res = await model.destroy();
        return res;
    }

}

module.exports = AppointmentsService;