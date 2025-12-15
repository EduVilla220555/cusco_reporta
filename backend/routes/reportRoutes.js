const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, requireCitizen, requireAuthority } = require('../middleware/authMiddleware');
const { validateReport } = require('../utils/validators');
const upload = require('../middleware/upload');

// Rutas públicas (sin autenticación)
// GET /api/reports - Obtener todos los reportes
router.get('/', reportController.getAllReports);

// GET /api/reports/search - Buscar reportes
router.get('/search', reportController.searchReports);

// GET /api/reports/stats - Obtener estadísticas de reportes
router.get('/stats', reportController.getReportStats);

// GET /api/reports/status/:status - Obtener reportes por estado
router.get('/status/:status', reportController.getReportsByStatus);

// GET /api/reports/:id - Obtener reporte por ID
router.get('/:id', reportController.getReportById);

// GET /api/reports/:id/history - Obtener historial de un reporte
router.get('/:id/history', reportController.getReportHistory);

// Rutas protegidas (requieren autenticación)

// GET /api/reports/citizen/:citizenId - Obtener reportes de un ciudadano (requiere auth)
router.get('/citizen/:citizenId', verifyToken, reportController.getReportsByCitizen);

// POST /api/reports - Crear nuevo reporte (solo ciudadanos)
// Usamos multipart/form-data con campo 'photo' (manejado por multer)
router.post('/', verifyToken, requireCitizen, upload.single('photo'), validateReport, reportController.createReport);

// PUT /api/reports/:id/status - Actualizar estado de reporte (solo autoridades)
router.put('/:id/status', verifyToken, requireAuthority, reportController.updateReportStatus);

module.exports = router;