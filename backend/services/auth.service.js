const bcrypt = require('bcrypt');
const { sendEmail } = require('./mailer.service');
const UserService = require('./users.service');
const service = new UserService();


class AuthService {

    constructor() {}

    async login(email, password) {
        const user = await service.findByEmail(email);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta');
        }
        return user;
    }

    async signup(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await service.create({ ...userData, password: hashedPassword });
        return newUser;
    }

    async sendPasswordRecovery(email) {
        const user = await service.findByEmail(email);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const recoveryCode = this.generateRecoveryCode();
        await sendEmail(email, 'Código de recuperación', `Tu código de recuperación es: ${recoveryCode}`);
        return recoveryCode;
    };

    generateRecoveryCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }

}

module.exports = AuthService;
