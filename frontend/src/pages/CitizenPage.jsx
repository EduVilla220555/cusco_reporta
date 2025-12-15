import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import reportService from '../services/reportService';
import ReportForm from '../components/reports/ReportForm';
import ReportList from '../components/reports/ReportList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CitizenPage = () => {
    const { user } = useAuth();
    const [myReports, setMyReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMyReports();
    }, [user]);

    const loadMyReports = async () => {
        if (!user) return;

        try {
            const response = await reportService.getReportsByCitizen(user.id);
            setMyReports(response.reports);
        } catch (error) {
            console.error('Error al cargar reportes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <ReportForm />
            
            {loading ? (
                <LoadingSpinner text="Cargando tus reportes..." />
            ) : (
                <ReportList
                    reports={myReports}
                    title="Mis Reportes"
                    icon="history"
                    emptyMessage="No tienes reportes aún. ¡Crea tu primer reporte!"
                />
            )}
        </div>
    );
};

export default CitizenPage;