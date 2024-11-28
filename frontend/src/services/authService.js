export const authService = {
    getToken() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.token;
    },

    getUser() {
        return JSON.parse(localStorage.getItem('user'));
    },

    setAuth(data) {
        localStorage.setItem('user', JSON.stringify(data));
        document.cookie = `user=${JSON.stringify(data)}; path=/; max-age=86400`;
    },

    logout() {
        localStorage.removeItem('user');
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
};