const Report = require('../models/Report');

// Obtener todos los reportes
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.getAll();

        res.json({
            success: true,
            count: reports.length,
            reports
        });

    } catch (error) {
        console.error('Error en getAllReports:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener reportes',
            error: error.message
        });
    }
};

// Obtener reporte por ID
exports.getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.getById(id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Reporte no encontrado'
            });
        }

        res.json({
            success: true,
            report
        });

    } catch (error) {
        console.error('Error en getReportById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener reporte',
            error: error.message
        });
    }
};

// Crear nuevo reporte
exports.createReport = async (req, res) => {
    try {
        // Si usamos multipart/form-data, multer habrá puesto el archivo en req.file
        const { title, description, type, priority, citizen_id, latitude, longitude } = req.body;

        // Validar campos requeridos
        if (!title || !type || !citizen_id) {
            return res.status(400).json({
                success: false,
                message: 'Título, tipo y ciudadano son obligatorios'
            });
        }

        // Generar código único
        const code = await Report.generateCode();

        // Construir photo_url si existe archivo
        let photo_url = null;
        if (req.file) {
            // URL absoluta al recurso servido por /uploads
            photo_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        // Crear reporte
        const reportId = await Report.create({
            code,
            title,
            description,
            type,
            priority: priority || 'media',
            citizen_id,
            latitude,
            longitude,
            photo_url
        });

        // Obtener el reporte creado
        const newReport = await Report.getById(reportId);

        res.status(201).json({
            success: true,
            message: 'Reporte creado exitosamente',
            report: newReport
        });

    } catch (error) {
        console.error('Error en createReport:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear reporte',
            error: error.message
        });
    }
};

// Actualizar estado de reporte
exports.updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, user_id, comment } = req.body;

        // Validar estado
        const validStatuses = ['pending', 'progress', 'resolved'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Estado inválido'
            });
        }

        // Actualizar estado
        await Report.updateStatus(id, status, user_id, comment);

        // Obtener reporte actualizado
        const updatedReport = await Report.getById(id);

        res.json({
            success: true,
            message: 'Estado actualizado exitosamente',
            report: updatedReport
        });

    } catch (error) {
        console.error('Error en updateReportStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar estado',
            error: error.message
        });
    }
};

// Obtener reportes por ciudadano
exports.getReportsByCitizen = async (req, res) => {
    try {
        const { citizenId } = req.params;
        const reports = await Report.getByCitizen(citizenId);

        res.json({
            success: true,
            count: reports.length,
            reports
        });

    } catch (error) {
        console.error('Error en getReportsByCitizen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener reportes del ciudadano',
            error: error.message
        });
    }
};

// Obtener reportes por estado
exports.getReportsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const reports = await Report.getByStatus(status);

        res.json({
            success: true,
            count: reports.length,
            reports
        });

    } catch (error) {
        console.error('Error en getReportsByStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener reportes por estado',
            error: error.message
        });
    }
};

// Buscar reportes
exports.searchReports = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Parámetro de búsqueda requerido'
            });
        }

        const reports = await Report.search(q);

        res.json({
            success: true,
            count: reports.length,
            reports
        });

    } catch (error) {
        console.error('Error en searchReports:', error);
        res.status(500).json({
            success: false,
            message: 'Error al buscar reportes',
            error: error.message
        });
    }
};

// Obtener estadísticas de reportes
exports.getReportStats = async (req, res) => {
    try {
        const stats = await Report.getStatistics();

        // Formatear estadísticas
        const formattedStats = {
            pending: 0,
            progress: 0,
            resolved: 0
        };

        stats.forEach(stat => {
            formattedStats[stat.status] = stat.total;
        });

        res.json({
            success: true,
            stats: formattedStats
        });

    } catch (error) {
        console.error('Error en getReportStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};

// Obtener historial de un reporte
exports.getReportHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = await Report.getUpdates(id);

        res.json({
            success: true,
            count: updates.length,
            updates
        });

    } catch (error) {
        console.error('Error en getReportHistory:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial',
            error: error.message
        });
    }
}; 
