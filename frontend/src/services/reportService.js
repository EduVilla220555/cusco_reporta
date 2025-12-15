import api from './api';

const reportService = {
    // Obtener todos los reportes
    getAllReports: async () => {
        try {
            const response = await api.get('/reports');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener reportes' };
        }
    },

    // Obtener reporte por ID
    getReportById: async (id) => {
        try {
            const response = await api.get(`/reports/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener reporte' };
        }
    },

    // Crear nuevo reporte
    createReport: async (reportData) => {
        try {
            const response = await api.post('/reports', reportData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear reporte' };
        }
    },

    // Actualizar estado de reporte
    updateReportStatus: async (id, statusData) => {
        try {
            const response = await api.put(`/reports/${id}/status`, statusData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar estado' };
        }
    },

    // Obtener reportes por ciudadano
    getReportsByCitizen: async (citizenId) => {
        try {
            const response = await api.get(`/reports/citizen/${citizenId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener reportes del ciudadano' };
        }
    },

    // Obtener reportes por estado
    getReportsByStatus: async (status) => {
        try {
            const response = await api.get(`/reports/status/${status}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener reportes por estado' };
        }
    },

    // Buscar reportes
    searchReports: async (searchTerm) => {
        try {
            const response = await api.get(`/reports/search?q=${searchTerm}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al buscar reportes' };
        }
    },

    // Obtener estadísticas de reportes
    getReportStats: async () => {
        try {
            const response = await api.get('/reports/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener estadísticas' };
        }
    },

    // Obtener historial de un reporte
    getReportHistory: async (id) => {
        try {
            const response = await api.get(`/reports/${id}/history`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener historial' };
        }
    }
};

export default reportService; 
