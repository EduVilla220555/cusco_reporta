import { useState } from 'react';
import { useReports } from '../context/ReportContext';
import Card from '../components/common/Card';
import ReportList from '../components/reports/ReportList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ReportsPage.css';

const ReportsPage = () => {
    const { reports, loading, searchReports, filterByStatus } = useReports();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        searchReports(value);
    };

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setStatusFilter(value);
        filterByStatus(value);
    };

    return (
        <div>
            <Card title="Buscar y Filtrar Reportes" icon="search">
                <div className="search-filters">
                    <div className="form-group">
                        <label htmlFor="search">Buscar por Título o Código</label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="RPT-001 o título..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Filtrar por Estado</label>
                        <select
                            id="status"
                            value={statusFilter}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todos</option>
                            <option value="pending">Pendiente</option>
                            <option value="progress">En Proceso</option>
                            <option value="resolved">Resuelto</option>
                        </select>
                    </div>
                </div>
            </Card>

            {loading ? (
                <LoadingSpinner text="Buscando reportes..." />
            ) : (
                <ReportList
                    reports={reports}
                    title="Resultados"
                    icon="list"
                    showCitizenInfo={true}
                    emptyMessage="No se encontraron reportes."
                />
            )}
        </div>
    );
};

export default ReportsPage;