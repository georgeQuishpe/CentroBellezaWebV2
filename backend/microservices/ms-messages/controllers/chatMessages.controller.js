const ChatMessagesService = require('../services/chatMessages.service');
const chatMessageService = new ChatMessagesService();
const axios = require('axios');

const getAllMessages = async (req, res) => {
    try {
        // const messages = await chatMessageService.find();
        // res.json(messages);
        // const messages = await chatMessageService.findByUser();
        // res.json(messages);
        const { userId, toUserId } = req.query;
        if (userId) {
            const messages = await chatMessageService.findByUser(userId);
            res.json(messages);
        } else {
            const messages = await chatMessageService.findByUser();
            res.json(messages);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMessagesByUser = async (req, res) => {
    try {
        console.log('Solicitud de mensajes para usuario:', req.params.userId);
        const messages = await chatMessageService.findByUser(req.params.userId);
        res.json(messages);
    } catch (error) {
        console.error('Error en la ruta:', error);
        res.status(500).json({
            error: true,
            message: error.message || 'Error al cargar mensajes'
        });
    }
};

const getAppointmentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const appointments = await axios.get(`http://host.docker.internal:5003/api/v1/appointments/user/${userId}`);

        res.json(appointments);
    } catch (error) {
        console.error("Error al obtener citas:", error);
        res.status(500).json({ error: "Error al obtener citas" });
    }
};

const createMessage = async (req, res) => {
    try {
        const newMessage = await chatMessageService.create(req.body);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markMessageAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMessage = await chatMessageService.markAsRead(id);
        res.json(updatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllMessages,
    getMessagesByUser,
    getAppointmentsByUser,
    createMessage,
    markMessageAsRead
};
