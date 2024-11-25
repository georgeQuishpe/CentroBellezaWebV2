const nodemailer = require("nodemailer");
require('dotenv').config(); // Esto debe ir al principio de tu archivo


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,    
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
});

/**
 * Función para enviar correos electrónicos usando Nodemailer.
 * @param {string} to - Dirección de correo del destinatario.
 * @param {string} subject - Asunto del correo.
 * @param {string} text - Cuerpo del correo en texto plano.
 * @param {string} [html] - (Opcional) Cuerpo del correo en formato HTML.
 * @returns {Promise} - Devuelve una promesa que se resuelve si el correo se envía correctamente.
 */
const sendEmail = async (to, subject, text, html = null) => {
    const mailOptions = {
        from: process.env.MAIL_USERNAME, // Dirección del remitente
        to,                             // Dirección del destinatario
        subject,                        // Asunto del correo
        text,                           // Texto plano
        ...(html && { html }),          // Opcional: contenido HTML
    };

    return transporter.sendMail(mailOptions); // Retorna una promesa
};

const generateRecoveryCode = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
};

module.exports = { sendEmail, generateRecoveryCode };
