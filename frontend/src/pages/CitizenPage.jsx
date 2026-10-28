import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import reportService from '../services/reportService';
import CitizenCategoryHub from '../components/citizen/CitizenCategoryHub';
import ReportForm from '../components/reports/ReportForm';
import ReportList from '../components/reports/ReportList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CitizenPage = () => {
    const { user } = useAuth();
    const [myReports, setMyReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('report'); // 'report' | 'history' | 'channels'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [historyFilterCategory, setHistoryFilterCategory] = useState('all');

    useEffect(() => {
        loadMyReports();
    }, [user]);

    const loadMyReports = async () => {
        if (!user) return;

        try {
            const response = await reportService.getReportsByCitizen(user.id);
            setMyReports(response.reports || []);
        } catch (error) {
            console.error('Error al cargar reportes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCategory = (catId) => {
        setSelectedCategory(catId);
        // Desplazamiento suave al formulario
        setTimeout(() => {
            const formElem = document.getElementById('report-form-card');
            if (formElem) {
                formElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const handleReportCreated = () => {
        loadMyReports();
        setSelectedCategory(null);
        // Opcional: cambiar a la pestaña de historial tras crear
        setActiveTab('history');
    };

    // Filtrar reportes del historial según categoría seleccionada
    const filteredReports = historyFilterCategory === 'all'
        ? myReports
        : myReports.filter(r => r.type === historyFilterCategory);

    const filterCategories = [
        { id: 'all', label: 'Todos los Reportes', icon: 'fas fa-th-large' },
        { id: 'alumbrado', label: 'Alumbrado', icon: 'fas fa-lightbulb' },
        { id: 'basura', label: 'Basura', icon: 'fas fa-trash-alt' },
        { id: 'vias', label: 'Vías / Pistas', icon: 'fas fa-road' },
        { id: 'parques', label: 'Parques', icon: 'fas fa-tree' },
        { id: 'agua', label: 'Agua / Desagüe', icon: 'fas fa-tint' },
        { id: 'seguridad', label: 'Seguridad', icon: 'fas fa-shield-alt' },
        { id: 'otros', label: 'Otros', icon: 'fas fa-clipboard-list' }
    ];

    return (
        <div className="citizen-page">
            {/* Hub institucional de categorías, métricas y navegación de pestañas */}
            <CitizenCategoryHub
                user={user}
                reports={myReports}
                activeCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Pestaña: REPORTAR INCIDENCIA */}
            {activeTab === 'report' && (
                <div style={{ marginTop: '0.5rem' }}>
                    <ReportForm 
                        selectedCategory={selectedCategory} 
                        onCategoryChange={setSelectedCategory}
                        onReportCreated={handleReportCreated} 
                    />
                </div>
            )}

            {/* Pestaña: MIS REPORTES */}
            {activeTab === 'history' && (
                <div style={{ marginTop: '1rem' }}>
                    {/* Filtro rápido por categoría */}
                    <div style={{
                        display: 'flex',
                        gap: '0.6rem',
                        flexWrap: 'wrap',
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        background: 'rgba(68, 0, 13, 0.6)',
                        border: '1px solid rgba(249, 210, 118, 0.25)',
                        borderRadius: '12px'
                    }}>
                        <span style={{ 
                            alignSelf: 'center', 
                            fontSize: '0.9rem', 
                            fontWeight: '700', 
                            color: 'var(--color-gold)', 
                            marginRight: '0.4rem' 
                        }}>
                            <i className="fas fa-filter" style={{ marginRight: '6px' }}></i> Filtrar:
                        </span>

                        {filterCategories.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setHistoryFilterCategory(cat.id)}
                                style={{
                                    background: historyFilterCategory === cat.id 
                                        ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' 
                                        : 'rgba(131, 20, 44, 0.65)',
                                    color: historyFilterCategory === cat.id ? 'var(--color-maroon)' : '#ffffff',
                                    border: historyFilterCategory === cat.id ? '1.5px solid #ffffff' : '1px solid rgba(249, 210, 118, 0.25)',
                                    borderRadius: '8px',
                                    padding: '0.45rem 0.85rem',
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <i className={cat.icon}></i>
                                <span>{cat.label}</span>
                                {cat.id !== 'all' && (
                                    <span style={{
                                        fontSize: '0.75rem',
                                        background: historyFilterCategory === cat.id ? 'var(--color-maroon)' : 'rgba(255,255,255,0.2)',
                                        color: historyFilterCategory === cat.id ? 'var(--color-gold)' : '#ffffff',
                                        padding: '0.1rem 0.4rem',
                                        borderRadius: '10px'
                                    }}>
                                        {myReports.filter(r => r.type === cat.id).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <LoadingSpinner text="Cargando tus reportes ciudadanos..." />
                    ) : (
                        <ReportList
                            reports={filteredReports}
                            title={`Mis Reportes Ciudadanos (${filteredReports.length})`}
                            icon="history"
                            emptyMessage={
                                historyFilterCategory === 'all'
                                    ? "No tienes reportes aún. ¡Haz clic en 'Reportar Incidencia' para enviar el primero!"
                                    : "No tienes reportes registrados en esta categoría específica."
                            }
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default CitizenPage;