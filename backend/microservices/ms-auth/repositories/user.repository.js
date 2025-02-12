const User = require('../models/user.model');

class UserRepository {
    async findAll() {
        return await User.findAll();
    }

    async findById(id) {
        return await User.findByPk(id);
    }

    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async create(data) {
        return await User.create(data);
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