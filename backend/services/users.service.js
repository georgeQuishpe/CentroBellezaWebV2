const { models } = require('../libs/sequelize');

class UsersService {

    constructor() {}

    async find(){
        const res = await models.User.findAll();
        return res;
    }

}

module.exports = UsersService;