const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Añade esta importación
const { sendEmail } = require('./mailer.service');
const UserService = require('./users.service');
const service = new UserService();

class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'tu_clave_secreta'; // Idealmente en variables de entorno
    }

    async login(email, password) {
        const user = await service.findByEmail(email);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta');
        }

        // Genera el token JWT
        const token = this.generateToken(user);

        // Retorna el usuario y el token (excluye la contraseña)
        const { password: _, ...userWithoutPassword } = user.toJSON();
        return {
            ...userWithoutPassword,
            token
        };
    }

    generateToken(user) {
        const payload = {
            sub: user.id,
            // id: user.id, 
            email: user.email,
            rol: user.rol,
            iat: Date.now()
        };

        return jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            throw new Error('Token inválido');
        }
    }

    async signup(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await service.create({ ...userData, password: hashedPassword });

        // Genera token para el nuevo usuario
        const token = this.generateToken(newUser);

        // Retorna usuario y token (excluye la contraseña)
        const { password: _, ...userWithoutPassword } = newUser.toJSON();
        return {
            ...userWithoutPassword,
            token
        };
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

        if (user.verificationCode !== code) {
            throw new Error('El código de verificación no es válido');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({
            password: hashedPassword,
            verificationCode: null
        });

        // Genera un nuevo token después de resetear la contraseña
        const token = this.generateToken(user);

        const { password: _, verificationCode: __, ...userWithoutSensitiveInfo } = user.toJSON();
        return {
            ...userWithoutSensitiveInfo,
            token
        };
    }

    generateRecoveryCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }
}

module.exports = AuthService;