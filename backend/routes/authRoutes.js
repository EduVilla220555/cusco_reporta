const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../utils/validators');

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', validateRegister, authController.register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', validateLogin, authController.login);

// GET /api/auth/verify - Verificar token (requiere autenticación)
router.get('/verify', verifyToken, authController.verifyToken);

module.exports = router;