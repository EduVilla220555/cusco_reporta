// Middleware para manejo centralizado de errores

// Errores personalizados
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Manejo de errores de MySQL
const handleMySQLError = (error) => {
    // Error de duplicado (email ya existe)
    if (error.code === 'ER_DUP_ENTRY') {
        return new AppError('Este email ya está registrado', 400);
    }

    // Error de foreign key
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return new AppError('El recurso referenciado no existe', 400);
    }

    // Error de sintaxis SQL
    if (error.code === 'ER_PARSE_ERROR') {
        return new AppError('Error en la consulta a la base de datos', 500);
    }

    return error;
};

// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log para desarrollo
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', {
            message: err.message,
            stack: err.stack,
            code: err.code
        });
    }

    // Manejar errores específicos de MySQL
    if (err.code && err.code.startsWith('ER_')) {
        error = handleMySQLError(err);
    }

    // Error de validación de Mongoose (si usas MongoDB)
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(e => e.message).join(', ');
        error = new AppError(message, 400);
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        error = new AppError('Token inválido', 401);
    }

    if (err.name === 'TokenExpiredError') {
        error = new AppError('Token expirado', 401);
    }

    // Respuesta
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Middleware para rutas no encontradas
const notFound = (req, res, next) => {
    const error = new AppError(`Ruta no encontrada: ${req.originalUrl}`, 404);
    next(error);
};

module.exports = {
    AppError,
    errorHandler,
    notFound
}; 
