const API_URL = 'http://localhost:5000/api/v1'

export const authService = {
    async login(email, password) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Error al iniciar sesión')
        }

        return data
    },

    logout() {
        localStorage.removeItem('user')
    },

    getCurrentUser() {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    },
}