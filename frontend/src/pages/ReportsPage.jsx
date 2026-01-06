import { useState, useMemo } from 'react';
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

    const handleQuickFilter = (status) => {
        setStatusFilter(status);
        filterByStatus(status);
    };

    const stats = useMemo(() => {
        const total = reports?.length || 0;
        const pending = reports?.filter(r => r.status === 'pending').length || 0;
        const progress = reports?.filter(r => r.status === 'progress').length || 0;
        const resolved = reports?.filter(r => r.status === 'resolved').length || 0;
        
        return { total, pending, progress, resolved };
    }, [reports]);

    return (
        <div className="reports-page">
            {/* Estadísticas */}
            <div className="stats-grid">
                <div className="stat-card stat-total" onClick={() => handleQuickFilter('')}>
                    <div className="stat-icon">
                        <i className="fas fa-clipboard-list"></i>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Reportes</span>
                    </div>
                </div>

                <div className="stat-card stat-pending" onClick={() => handleQuickFilter('pending')}>
                    <div className="stat-icon">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.pending}</span>
                        <span className="stat-label">Pendientes</span>
                    </div>
                </div>

                <div className="stat-card stat-progress" onClick={() => handleQuickFilter('progress')}>
                    <div className="stat-icon">
                        <i className="fas fa-spinner"></i>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.progress}</span>
                        <span className="stat-label">En Proceso</span>
                    </div>
                </div>

                <div className="stat-card stat-resolved" onClick={() => handleQuickFilter('resolved')}>
                    <div className="stat-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.resolved}</span>
                        <span className="stat-label">Resueltos</span>
                    </div>
                </div>
            </div>

            {/* Búsqueda y Filtros */}
            <Card title="Buscar y Filtrar Reportes" icon="search">
                <div className="search-filters">
                    <div className="form-group search-group">
                        <label htmlFor="search">
                            <i className="fas fa-search"></i>
                            Buscar por Título o Código
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Ingresa RPT-001 o título del reporte..."
                            className="search-input"
                        />
                    </div>

                    <div className="form-group filter-group">
                        <label htmlFor="status">
                            <i className="fas fa-filter"></i>
                            Filtrar por Estado
                        </label>
                        <select
                            id="status"
                            value={statusFilter}
                            onChange={handleFilterChange}
                            className="filter-select"
                        >
                            <option value=""> Todos los estados</option>
                            <option value="pending">° Pendiente</option>
                            <option value="progress">° En Proceso</option>
                            <option value="resolved">° Resuelto</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Resultados */}
            {loading ? (
                <LoadingSpinner text="Cargando reportes..." />
            ) : (
                <ReportList
                    reports={reports}
                    title="Resultados"
                    icon="list"
                    showCitizenInfo={true}
                    emptyMessage="No se encontraron reportes con los criterios seleccionados."
                />
            )}
        </div>
    );
};

export default ReportsPage;