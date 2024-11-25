const {sendEmail, generateRecoveryCode } = require('../services/recoveryPass.service');

const recoveryPassController = {
    async sendEmail(req, res) {
        try {
            const info = await sendEmail(
                req.body.email, 
                'Recuperación de contraseña', 
                `Hola, tu código de recuperación es: ${generateRecoveryCode()}`
            );
            console.log("Correo enviado:", info.response);
            res.status(200).json({ message: 'Correo enviado exitosamente' });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ error: 'No se pudo enviar el correo' });
        }
    },
};

module.exports = recoveryPassController;
