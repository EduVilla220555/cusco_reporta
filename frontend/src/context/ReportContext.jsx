import { createContext, useContext, useState, useEffect } from 'react';
import reportService from '../services/reportService';

const ReportContext = createContext();

export const useReports = () => {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error('useReports debe usarse dentro de ReportProvider');
    }
    return context;
};

export const ReportProvider = ({ children }) => {
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({ pending: 0, progress: 0, resolved: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar todos los reportes
    const loadReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await reportService.getAllReports();
            setReports(response.reports);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cargar estadísticas
    const loadStats = async () => {
        try {
            const response = await reportService.getReportStats();
            setStats(response.stats);
        } catch (err) {
            console.error('Error al cargar estadísticas:', err);
        }
    };

    // Crear nuevo reporte
    const createReport = async (reportData) => {
        try {
            const response = await reportService.createReport(reportData);
            await loadReports(); // Recargar lista
            await loadStats(); // Actualizar estadísticas
            return response;
        } catch (err) {
            throw err;
        }
    };

    // Actualizar estado de reporte
    const updateReportStatus = async (id, statusData) => {
        try {
            const response = await reportService.updateReportStatus(id, statusData);
            await loadReports(); // Recargar lista
            await loadStats(); // Actualizar estadísticas
            return response;
        } catch (err) {
            throw err;
        }
    };

    // Buscar reportes
    const searchReports = async (searchTerm) => {
        if (!searchTerm.trim()) {
            await loadReports();
            return;
        }

        setLoading(true);
        try {
            const response = await reportService.searchReports(searchTerm);
            setReports(response.reports);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar por estado
    const filterByStatus = async (status) => {
        if (!status) {
            await loadReports();
            return;
        }

        setLoading(true);
        try {
            const response = await reportService.getReportsByStatus(status);
            setReports(response.reports);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cargar reportes al montar el componente
    useEffect(() => {
        loadReports();
        loadStats();
    }, []);

    const value = {
        reports,
        stats,
        loading,
        error,
        loadReports,
        loadStats,
        createReport,
        updateReportStatus,
        searchReports,
        filterByStatus
    };

    return (
        <ReportContext.Provider value={value}>
            {children}
        </ReportContext.Provider>
    );
}; 
