const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./mailer.service');
const UsersService = require('./users.service');


class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'una_clave_secreta_muy_larga_y_segura';
        this.usersService = new UsersService();
    }

    findUserById(id) {
        // return models.User.findByPk(id);
        // return User.findByPk(id); // Use User instead of models.User
        console.log('Buscando usuario con ID:', id);
        console.log('UsersService:', this.usersService);
        return this.usersService.findById(id); // Cambiar findOne por findById

    }


    async login(email, password) {
        try {
            const user = await this.usersService.findByEmail(email);
            if (!user) {
                console.log('Usuario no encontrado:', email);
                throw new Error('Usuario no encontrado');
            }

            console.log('Usuario encontrado:', user.email, 'Rol:', user.rol); // Añade este log
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Contraseña incorrecta');
            }

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    rol: user.rol,
                    nombre: user.nombre
                },
                token: this.generateToken(user)
            };
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }

    }

    async signup(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await this.usersService.create({ ...userData, password: hashedPassword });

        const token = this.generateToken(newUser);
        const { password: _, ...userWithoutPassword } = newUser.toJSON();

        return { ...userWithoutPassword, token };
    }

    async sendPasswordRecovery(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new Error('Usuario no encontrado');

        const recoveryCode = this.generateRecoveryCode();
        await this.usersService.update(user.id, { verificationCode: recoveryCode });

        await sendEmail(email, 'Código de recuperación', `Tu código de recuperación es: ${recoveryCode}`);
        return recoveryCode;
    }

    async resetPassword(email, code, newPassword) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new Error('El usuario no existe');

        if (user.verificationCode !== code) throw new Error('El código de verificación no es válido');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersService.update(user.id, {
            password: hashedPassword,
            verificationCode: null
        });

        const token = this.generateToken(user);
        const { password: _, verificationCode: __, ...userWithoutSensitiveInfo } = user.toJSON();

        return { ...userWithoutSensitiveInfo, token };
    }

    // isTokenExpired = (token) => {
    //     try {
    //         const decoded = jwtDecode(token);
    //         if (!decoded.exp) return true;

    //         // exp está en segundos, Date.now() en milisegundos
    //         return Date.now() >= decoded.exp * 1000;
    //     } catch (error) {
    //         return true;
    //     }
    // };

    generateToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            rol: user.rol,
            // iat: Date.now(),
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hora de expiración
        };

        // return jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' });
        return jwt.sign(payload, this.jwtSecret);

    }

    generateRefreshToken(user) {
        const payload = {
            sub: user.id,
            type: 'refresh',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 días
        };
        return jwt.sign(payload, this.jwtSecret);
    }

    generateRecoveryCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }
    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token expired');
            }
            throw new Error('Invalid token');
        }
    }
}

module.exports = AuthService;
