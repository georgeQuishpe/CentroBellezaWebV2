const API_URL = 'http://localhost:5000/api/v1';

export const chatService = {
    async getMessageHistory(userId) {
        try {
            const response = await fetch(`${API_URL}/chat-messages/${userId}`);
            if (!response.ok) throw new Error('Error al obtener mensajes');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async markMessageAsRead(messageId) {
        try {
            const response = await fetch(`${API_URL}/chat-messages/${messageId}/read`, {
                method: 'PUT',
            });
            if (!response.ok) throw new Error('Error al marcar mensaje como leído');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
};