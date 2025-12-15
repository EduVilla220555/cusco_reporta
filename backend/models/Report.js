const { query, queryOne } = require('../config/database');

class Report {
    // Obtener todos los reportes con información del ciudadano
    static async getAll() {
        const sql = `
            SELECT 
                r.*,
                u.name as citizen_name,
                u.email as citizen_email
            FROM reports r
            INNER JOIN users u ON r.citizen_id = u.id
            ORDER BY r.created_at DESC
        `;
        return await query(sql);
    }

    // Obtener reporte por ID
    static async getById(id) {
        const sql = `
            SELECT 
                r.*,
                u.name as citizen_name,
                u.email as citizen_email
            FROM reports r
            INNER JOIN users u ON r.citizen_id = u.id
            WHERE r.id = ?
        `;
        return await queryOne(sql, [id]);
    }

    // Obtener reporte por código (RPT-XXX)
    static async getByCode(code) {
        const sql = `
            SELECT 
                r.*,
                u.name as citizen_name,
                u.email as citizen_email
            FROM reports r
            INNER JOIN users u ON r.citizen_id = u.id
            WHERE r.code = ?
        `;
        return await queryOne(sql, [code]);
    }

    // Crear nuevo reporte
    static async create(reportData) {
        const { 
            code, 
            title, 
            description, 
            type, 
            priority = 'media', 
            citizen_id,
            latitude = null,
            longitude = null,
            photo_url = null
        } = reportData;

        const sql = `
            INSERT INTO reports 
            (code, title, description, type, priority, citizen_id, latitude, longitude, photo_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const result = await query(sql, [
            code, title, description, type, priority, 
            citizen_id, latitude, longitude, photo_url
        ]);
        
        return result.insertId;
    }

    // Actualizar estado del reporte
    static async updateStatus(id, newStatus, userId, comment = null) {
        try {
            // Obtener estado anterior
            const report = await this.getById(id);
            if (!report) {
                throw new Error('Reporte no encontrado');
            }

            // Actualizar el reporte
            const updateSql = 'UPDATE reports SET status = ? WHERE id = ?';
            await query(updateSql, [newStatus, id]);

            // Registrar la actualización
            const insertSql = `
                INSERT INTO report_updates 
                (report_id, user_id, previous_status, new_status, comment) 
                VALUES (?, ?, ?, ?, ?)
            `;
            await query(insertSql, [id, userId, report.status, newStatus, comment]);

            return true;
        } catch (error) {
            console.error('Error al actualizar estado:', error.message);
            throw error;
        }
    }

    // Obtener reportes por ciudadano
    static async getByCitizen(citizenId) {
        const sql = `
            SELECT * FROM reports 
            WHERE citizen_id = ? 
            ORDER BY created_at DESC
        `;
        return await query(sql, [citizenId]);
    }

    // Obtener reportes por estado
    static async getByStatus(status) {
        const sql = `
            SELECT 
                r.*,
                u.name as citizen_name,
                u.email as citizen_email
            FROM reports r
            INNER JOIN users u ON r.citizen_id = u.id
            WHERE r.status = ?
            ORDER BY r.created_at DESC
        `;
        return await query(sql, [status]);
    }

    // Obtener estadísticas de reportes
    static async getStatistics() {
        const sql = `
            SELECT 
                status,
                COUNT(*) as total
            FROM reports
            GROUP BY status
        `;
        return await query(sql);
    }

    // Buscar reportes (por título o código)
    static async search(searchTerm) {
        const sql = `
            SELECT 
                r.*,
                u.name as citizen_name,
                u.email as citizen_email
            FROM reports r
            INNER JOIN users u ON r.citizen_id = u.id
            WHERE r.title LIKE ? OR r.code LIKE ?
            ORDER BY r.created_at DESC
        `;
        const searchPattern = `%${searchTerm}%`;
        return await query(sql, [searchPattern, searchPattern]);
    }

    // Generar código único para reporte
    static async generateCode() {
        const sql = 'SELECT code FROM reports ORDER BY id DESC LIMIT 1';
        const lastReport = await queryOne(sql);
        
        if (!lastReport) {
            return 'RPT-001';
        }
        
        const lastNumber = parseInt(lastReport.code.split('-')[1]);
        const newNumber = (lastNumber + 1).toString().padStart(3, '0');
        return `RPT-${newNumber}`;
    }

    // Obtener historial de actualizaciones de un reporte
    static async getUpdates(reportId) {
        const sql = `
            SELECT 
                ru.*,
                u.name as user_name,
                u.role as user_role
            FROM report_updates ru
            INNER JOIN users u ON ru.user_id = u.id
            WHERE ru.report_id = ?
            ORDER BY ru.created_at DESC
        `;
        return await query(sql, [reportId]);
    }

    // Eliminar reporte
    static async delete(id) {
        const sql = 'DELETE FROM reports WHERE id = ?';
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Report;