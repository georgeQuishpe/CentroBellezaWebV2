const bcrypt = require('bcrypt');
const { sendEmail } = require('./mailer.service');
const UserService = require('./users.service');
const service = new UserService();


class AuthService {

    constructor() { }

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

        // Guarda el código en la base de datos
        await user.update({ verificationCode: recoveryCode });

        // Envía el correo al usuario
        await sendEmail(email, 'Código de recuperación', `Tu código de recuperación es: ${recoveryCode}`);
        return recoveryCode;
    }



    async resetPassword(email, code, newPassword) {
        const user = await service.findByEmail(email);
        if (!user) {
            throw new Error('El usuario no existe');
        }

        // Valida el código de recuperación
        if (user.verificationCode !== code) {
            throw new Error('El código de verificación no es válido');
        }

        // Actualiza la contraseña y limpia el código
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword, verificationCode: null });

        return true;
    }






    generateRecoveryCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }

}

module.exports = AuthService;
