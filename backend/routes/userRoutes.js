const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get('/', requireAdmin, userController.getAllUsers);

// GET /api/users/stats - Obtener estadísticas de usuarios (solo admin)
router.get('/stats', requireAdmin, userController.getUserStats);

// GET /api/users/role/:role - Obtener usuarios por rol (solo admin)
router.get('/role/:role', requireAdmin, userController.getUsersByRole);

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', userController.getUserById);

// PUT /api/users/:id/role - Actualizar rol de usuario (solo admin)
router.put('/:id/role', requireAdmin, userController.updateUserRole);

module.exports = router;