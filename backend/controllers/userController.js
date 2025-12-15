const User = require('../models/User');

// Obtener todos los usuarios (solo admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        
        res.json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error('Error en getAllUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.getById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Error en getUserById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
};

// Actualizar rol de usuario (solo admin)
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validar rol
        const validRoles = ['citizen', 'authority', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Rol inválido'
            });
        }

        // Verificar que el usuario existe
        const user = await User.getById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Actualizar rol
        const updated = await User.updateRole(id, role);

        if (updated) {
            const updatedUser = await User.getById(id);
            res.json({
                success: true,
                message: 'Rol actualizado exitosamente',
                user: updatedUser
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el rol'
            });
        }

    } catch (error) {
        console.error('Error en updateUserRole:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar rol',
            error: error.message
        });
    }
};

// Obtener usuarios por rol
exports.getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const users = await User.getByRole(role);

        res.json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error('Error en getUsersByRole:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios por rol',
            error: error.message
        });
    }
};

// Obtener estadísticas de usuarios
exports.getUserStats = async (req, res) => {
    try {
        const stats = await User.countByRole();

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('Error en getUserStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
}; 
