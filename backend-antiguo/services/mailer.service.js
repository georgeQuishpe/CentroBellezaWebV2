const nodemailer = require("nodemailer");
require('dotenv').config(); 


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
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise} - Devuelve una promesa que se resuelve si el correo se envía correctamente.
 */
const sendEmail = async (to, subject, text, html = null) => {
    const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };