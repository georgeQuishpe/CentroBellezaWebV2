const express = require('express');
const ChatMessagesService = require('../services/chatMessages.service');
const service = new ChatMessagesService();

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const messages = await service.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        console.log('Solicitud de mensajes para usuario:', req.params.userId);
        const messages = await service.findByUser(req.params.userId);
        res.json(messages);
    } catch (error) {
        console.error('Error en la ruta:', error);
        res.status(500).json({
            error: true,
            message: error.message || 'Error al cargar mensajes'
        });
    }
});

router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const appointments = await Appointment.findAll({
            where: { usuarioId: userId },
            include: [{ association: "servicio" }, { association: "usuario" }],
        });

        res.json(appointments); // Devuelve un arreglo, aunque esté vacío
    } catch (error) {
        console.error("Error al obtener citas:", error);
        res.status(500).json({ error: "Error al obtener citas" });
    }
});

router.post('/', async (req, res) => {
    try {
        const newMessage = await service.create(req.body);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMessage = await service.markAsRead(id);
        res.json(updatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;