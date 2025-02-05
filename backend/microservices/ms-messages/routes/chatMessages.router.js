const express = require('express');
const router = express.Router();
const chatMessagesController = require('../controllers/chatMessages.controller');

router
    .get('/', chatMessagesController.getAllMessages)
    .get('/:userId', chatMessagesController.getMessagesByUser)
    .get('/user/:userId', chatMessagesController.getAppointmentsByUser)
    .post('/', chatMessagesController.createMessage)
    .patch('/:id/read', chatMessagesController.markMessageAsRead);

module.exports = router;
