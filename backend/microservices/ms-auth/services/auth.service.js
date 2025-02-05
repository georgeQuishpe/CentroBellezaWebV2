const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./mailer.service');
const UsersService = require('./users.service');

class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'tu_clave_secreta';
        this.usersService = new UsersService();
    }

    async login(email, password) {
        const user = await this.usersService.getUserByEmail(email);
        if (!user) throw new Error('Usuario no encontrado');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error('Contraseña incorrecta');

        const token = this.generateToken(user);
        const { password: _, ...userWithoutPassword } = user.toJSON();

        return { ...userWithoutPassword, token };
    }

    async signup(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await this.usersService.createUser({ ...userData, password: hashedPassword });

        const token = this.generateToken(newUser);
        const { password: _, ...userWithoutPassword } = newUser.toJSON();

        return { ...userWithoutPassword, token };
    }

    async sendPasswordRecovery(email) {
        const user = await this.usersService.getUserByEmail(email);
        if (!user) throw new Error('Usuario no encontrado');

        const recoveryCode = this.generateRecoveryCode();
        await this.usersService.updateUser(user.id, { verificationCode: recoveryCode });

        await sendEmail(email, 'Código de recuperación', `Tu código de recuperación es: ${recoveryCode}`);
        return recoveryCode;
    }

    async resetPassword(email, code, newPassword) {
        const user = await this.usersService.getUserByEmail(email);
        if (!user) throw new Error('El usuario no existe');

        if (user.verificationCode !== code) throw new Error('El código de verificación no es válido');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersService.updateUser(user.id, {
            password: hashedPassword,
            verificationCode: null
        });

        const token = this.generateToken(user);
        const { password: _, verificationCode: __, ...userWithoutSensitiveInfo } = user.toJSON();

        return { ...userWithoutSensitiveInfo, token };
    }

    generateToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            rol: user.rol,
            iat: Date.now()
        };

        return jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' });
    }

    generateRecoveryCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            throw new Error('Token inválido');
        }
    }
}

module.exports = AuthService;
