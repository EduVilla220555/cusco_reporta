const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registrar nuevo usuario
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validar campos requeridos
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        // Verificar si el email ya existe
        const emailExists = await User.emailExists(email);
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Este email ya está registrado'
            });
        }

        // Validar longitud de contraseña
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario (por defecto rol 'citizen')
        const userId = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'citizen'
        });

        // Obtener el usuario creado
        const newUser = await User.getById(userId);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Error en register:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
};

// Iniciar sesión
exports.login = async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        // Validar campos requeridos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son obligatorios'
            });
        }

        // Buscar usuario por email
        const user = await User.getByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Verificar contraseña
        let isPasswordValid = false;

        // MODO DESARROLLO: Intentar primero comparación directa (texto plano)
        if (user.password === password) {
            isPasswordValid = true;
            console.log('⚠️ ADVERTENCIA: Contraseña en texto plano detectada');
        } else {
            // Si no coincide en texto plano, intentar con bcrypt
            try {
                isPasswordValid = await bcrypt.compare(password, user.password);
            } catch (bcryptError) {
                // Si bcrypt falla, la contraseña no está hasheada correctamente
                isPasswordValid = false;
            }
        }

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Verificar que el tipo de usuario coincida (excepto admin)
        if (userType && user.role !== 'admin' && user.role !== userType) {
            return res.status(403).json({
                success: false,
                message: `Este usuario no tiene rol de ${userType}`
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
};

// Verificar token (middleware de autenticación)
exports.verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        const user = await User.getById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};