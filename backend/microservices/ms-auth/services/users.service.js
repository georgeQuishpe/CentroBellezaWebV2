const { models } = require('../libs/sequelize');

class UsersService {

    constructor() {}

    async find(){
        const res = await models.User.findAll();
        return res;
    }

    async findById(id){
        const res = await models.User.findByPk(id);
        return res;
    }

    async findByEmail(email){
        const res = await models.User.findOne({ where: { email } });
        return res;
    }

    async create(data){
        const res = await models.User.create(data);
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

module.exports = UsersService;