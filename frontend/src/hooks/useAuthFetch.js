// frontend/src/hooks/useAuthFetch.js
import { authService } from '../services/authService';

export const useAuthFetch = () => {
    const fetchWithAuth = async (url, options = {}) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        if (!token) {
            throw new Error('No hay sesión activa');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error en la petición');
        }

        return response.json();
    };

    return { fetchWithAuth };
};