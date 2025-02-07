const AuthService = require('../services/auth.service');
const service = new AuthService();

const signup = async (req, res) => {
    try {
        const response = await service.signup(req.body);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const user = await service.login(req.body.email, req.body.password);
        res.json(user);
    } catch (error) {
        res.status(401).send({ success: false, message: error.message });
    }
}

const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const verificationCode = await service.sendPasswordRecovery(email);
        res.status(200).json({
            success: true,
            message: 'Código de verificación enviado',
            code: verificationCode
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        console.log(req.body); // Verifica los datos enviados por el cliente
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            throw new Error('Faltan campos requeridos');
        }

        await service.resetPassword(email, code, newPassword);
        res.status(200).json({
            success: true,
            message: 'Contraseña actualizada exitosamente',
        });
    } catch (error) {
        console.error(error.message); // Depuración de errores
        res.status(400).json({ success: false, message: error.message });
    }
};


module.exports = {
    signup,
    login,
    recoverPassword,
    resetPassword
};