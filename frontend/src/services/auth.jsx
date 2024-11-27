// services/auth.service.js
import axios from 'axios';

const API_URL = '/api/v1/auth'; // Ajusta según tu configuración de backend

export const authService = {
  async signup(userData) {
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error en el registro');
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error en el inicio de sesión');
    }
  },

  async recoverPassword(email) {
    try {
      const response = await axios.post(`${API_URL}/recover-password`, { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error en la recuperación de contraseña');
    }
  }
};