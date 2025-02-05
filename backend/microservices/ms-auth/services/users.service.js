const UserRepository = require('../repositories/user.repository');

class UsersService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async find() {
        return await this.userRepository.findAll();
    }

    async findById(id) {
        return await this.userRepository.findById(id);
    }

    async findByEmail(email) {
        return await this.userRepository.findByEmail(email);
    }

    async create(data) {
        return await this.userRepository.create(data);
    }

    async update(id, data) {
        return await this.userRepository.update(id, data);
    }

    async delete(id) {
        return await this.userRepository.delete(id);
    }
}

module.exports = UsersService;
