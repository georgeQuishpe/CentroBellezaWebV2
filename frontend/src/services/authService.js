export const authService = {
    logout() {
        localStorage.removeItem('user')
    },
}