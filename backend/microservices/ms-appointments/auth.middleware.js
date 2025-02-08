const jwt = require('jsonwebtoken');
const { config } = require('./config/config');


function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'No se proporcionó token de autenticación'
        });
    }

    const token = authHeader.split(' ')[1];
    // const decoded = jwt.decode(token);
    // console.log('Token decodificado:', decoded);

    const verifyToken = (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }
    
            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'una_clave_secreta_muy_larga_y_segura');

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