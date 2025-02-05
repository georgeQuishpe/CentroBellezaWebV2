const { models } = require('../libs/sequelize');

class UserRepository {
    async findAll() {
        return await models.User.findAll();
    }

    async findById(id) {
        return await models.User.findByPk(id);
    }

    async findByEmail(email) {
        return await models.User.findOne({ where: { email } });
    }

    async create(data) {
        return await models.User.create(data);
    }

    async update(id, data) {
        const user = await this.findById(id);
        if (!user) throw new Error('Usuario no encontrado');
        return await user.update(data);
    }

    async delete(id) {
        const user = await this.findById(id);
        if (!user) throw new Error('Usuario no encontrado');
        return await user.destroy();
    }
}

module.exports = UserRepository;
