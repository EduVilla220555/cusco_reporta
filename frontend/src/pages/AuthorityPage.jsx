import { useEffect, useState } from 'react';
import { useReports } from '../context/ReportContext';
import reportService from '../services/reportService';
import Card from '../components/common/Card';
import ReportList from '../components/reports/ReportList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './AuthorityPage.css';

const AuthorityPage = () => {
    const { stats } = useReports();
    const [pendingReports, setPendingReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPendingReports();
    }, []);

    const loadPendingReports = async () => {
        try {
            const response = await reportService.getReportsByStatus('pending');
            setPendingReports(response.reports);
        } catch (error) {
            console.error('Error al cargar reportes pendientes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Dashboard de estadísticas */}
            <div className="stats-grid">
                <Card className="stat-card">
                    <div className="stat-number">{stats.pending}</div>
                    <div className="stat-label">Pendientes</div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-number">{stats.progress}</div>
                    <div className="stat-label">En Proceso</div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-number">{stats.resolved}</div>
                    <div className="stat-label">Resueltos</div>
                </Card>
            </div>

            {/* Lista de reportes pendientes */}
            {loading ? (
                <LoadingSpinner text="Cargando reportes pendientes..." />
            ) : (
                <ReportList
                    reports={pendingReports}
                    title="Reportes Pendientes de Atención"
                    icon="exclamation-triangle"
                    showCitizenInfo={true}
                    showActions={true}
                    emptyMessage="¡Excelente! No hay reportes pendientes."
                />
            )}
        </div>
    );
};

export default AuthorityPage;