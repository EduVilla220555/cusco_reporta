const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar token JWT
exports.verifyToken = async (req, res, next) => {
    try {
        // Obtener token del header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

        // Buscar usuario
        const user = await User.getById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Agregar usuario a la request
        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};

// Middleware para verificar roles específicos
exports.requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'No autenticado'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción'
            });
        }

        next();
    };
};

// Middleware para verificar que el usuario es ciudadano
exports.requireCitizen = (req, res, next) => {
    if (!req.user || req.user.role !== 'citizen') {
        return res.status(403).json({
            success: false,
            message: 'Solo los ciudadanos pueden realizar esta acción'
        });
    }
    next();
};

// Middleware para verificar que el usuario es autoridad o admin
exports.requireAuthority = (req, res, next) => {
    if (!req.user || (req.user.role !== 'authority' && req.user.role !== 'admin')) {
        return res.status(403).json({
            success: false,
            message: 'Se requiere rol de Autoridad o Administrador'
        });
    }
    next();
};

// Middleware para verificar que el usuario es admin
exports.requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Se requiere rol de Administrador'
        });
    }
    next();
};

// Middleware para verificar propiedad del recurso
exports.checkOwnership = (resourceIdParam = 'id') => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params[resourceIdParam];
            
            // Si es admin, permitir acceso
            if (req.user.role === 'admin') {
                return next();
            }

            // Verificar según el tipo de recurso
            // Esto se puede personalizar según tus necesidades
            
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al verificar propiedad del recurso'
            });
        }
    };
}; 
