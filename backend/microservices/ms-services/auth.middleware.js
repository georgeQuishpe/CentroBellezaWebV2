const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'No se proporcionó token de autenticación'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');

        // Asegurarse de que el token contiene la información necesaria
        if (!decodedToken.sub || !decodedToken.rol) {
            throw new Error('Token malformado');
        }

        // Estructura el objeto user con la información necesaria
        req.user = {
            sub: decodedToken.sub, // Para compatibilidad con el código existente
            id: decodedToken.sub,
            rol: decodedToken.rol,
            email: decodedToken.email
        };

        next();
    } catch (error) {
        console.error('Error de autenticación:', error);
        return res.status(403).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
}

// Middleware opcional para verificar rol de admin
function isAdmin(req, res, next) {
    if (req.user?.rol !== 'Admin') {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado: se requiere rol de administrador'
        });
    }
    next();
}

module.exports = { authMiddleware, isAdmin };