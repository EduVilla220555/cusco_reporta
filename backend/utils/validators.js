// Validadores para datos de entrada

// Validar email
exports.isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validar contraseña (mínimo 6 caracteres)
exports.isValidPassword = (password) => {
    return password && password.length >= 6;
};

// Validar nombre (no vacío, máximo 100 caracteres)
exports.isValidName = (name) => {
    return name && name.trim().length > 0 && name.length <= 100;
};

// Validar tipo de reporte
exports.isValidReportType = (type) => {
    const validTypes = ['vias', 'alumbrado', 'basura', 'otros'];
    return validTypes.includes(type);
};

// Validar prioridad de reporte
exports.isValidPriority = (priority) => {
    const validPriorities = ['baja', 'media', 'alta'];
    return validPriorities.includes(priority);
};

// Validar estado de reporte
exports.isValidStatus = (status) => {
    const validStatuses = ['pending', 'progress', 'resolved'];
    return validStatuses.includes(status);
};

// Validar rol de usuario
exports.isValidRole = (role) => {
    const validRoles = ['citizen', 'authority', 'admin'];
    return validRoles.includes(role);
};

// Validar coordenadas
exports.isValidLatitude = (lat) => {
    return !isNaN(lat) && lat >= -90 && lat <= 90;
};

exports.isValidLongitude = (lng) => {
    return !isNaN(lng) && lng >= -180 && lng <= 180;
};

// Middleware de validación para registro
exports.validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = [];

    if (!this.isValidName(name)) {
        errors.push('Nombre inválido');
    }

    if (!this.isValidEmail(email)) {
        errors.push('Email inválido');
    }

    if (!this.isValidPassword(password)) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Datos de registro inválidos',
            errors
        });
    }

    next();
};

// Middleware de validación para login
exports.validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || !this.isValidEmail(email)) {
        errors.push('Email inválido');
    }

    if (!password) {
        errors.push('Contraseña requerida');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Datos de login inválidos',
            errors
        });
    }

    next();
};

// Middleware de validación para crear reporte
exports.validateReport = (req, res, next) => {
    const { title, type, priority, citizen_id } = req.body;
    const errors = [];

    if (!title || title.trim().length === 0) {
        errors.push('El título es obligatorio');
    }

    if (!type || !this.isValidReportType(type)) {
        errors.push('Tipo de reporte inválido');
    }

    if (priority && !this.isValidPriority(priority)) {
        errors.push('Prioridad inválida');
    }

    if (!citizen_id) {
        errors.push('ID de ciudadano requerido');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Datos de reporte inválidos',
            errors
        });
    }

    next();
};

// Sanitizar input (prevenir XSS básico)
exports.sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remover < y >
        .substring(0, 1000); // Limitar longitud
};

// Validar ID numérico
exports.isValidId = (id) => {
    return !isNaN(id) && parseInt(id) > 0;
}; 
