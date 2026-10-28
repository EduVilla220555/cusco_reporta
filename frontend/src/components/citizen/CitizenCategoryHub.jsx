import React from 'react';
import './CitizenCategoryHub.css';

export const CATEGORIES = [
    {
        id: 'alumbrado',
        title: 'Alumbrado Público',
        shortTitle: 'Alumbrado',
        icon: 'fas fa-lightbulb',
        badge: 'Servicio Básico',
        desc: 'Postes sin luz, luminarias quemadas, cables caídos o cajas eléctricas en riesgo.',
        tags: ['Postes', 'Luminarias', 'Cables sueltos'],
        quickTips: ['Poste apagado', 'Luminaria intermitente', 'Cable suelto o caído', 'Caja eléctrica expuesta']
    },
    {
        id: 'basura',
        title: 'Limpieza y Basura',
        shortTitle: 'Basura',
        icon: 'fas fa-trash-alt',
        badge: 'Medio Ambiente',
        desc: 'Acumulación excesiva de residuos, puntos críticos sin recoger y falta de contenedores.',
        tags: ['Puntos críticos', 'Contenedores', 'Desmonte'],
        quickTips: ['Acumulación de basura', 'Falta de contenedor', 'Desmonte en vereda', 'Olores molestos']
    },
    {
        id: 'vias',
        title: 'Vías, Pistas y Veredas',
        shortTitle: 'Vías y Pistas',
        icon: 'fas fa-road',
        badge: 'Infraestructura',
        desc: 'Baches peligrosos, pistas agrietadas, veredas destruidas o hundimientos.',
        tags: ['Baches', 'Pistas rajadas', 'Veredas rotas'],
        quickTips: ['Hueco o bache profundo', 'Pista rajada', 'Vereda destruida', 'Hundimiento en calzada']
    },
    {
        id: 'parques',
        title: 'Parques y Áreas Verdes',
        shortTitle: 'Parques',
        icon: 'fas fa-tree',
        badge: 'Espacios Públicos',
        desc: 'Mantenimiento de áreas verdes, poda de árboles en riesgo y juegos infantiles deteriorados.',
        tags: ['Jardines', 'Árboles en riesgo', 'Parques'],
        quickTips: ['Árbol con riesgo de caída', 'Césped crecido sin podar', 'Juegos infantiles rotos', 'Falta de riego']
    },
    {
        id: 'agua',
        title: 'Agua y Alcantarillado',
        shortTitle: 'Agua / Desagüe',
        icon: 'fas fa-tint',
        badge: 'Saneamiento',
        desc: 'Fugas de agua en pistas, buzones de desagüe sin tapa, aniegos y malos olores.',
        tags: ['Fugas de agua', 'Desagües', 'Buzones rotos'],
        quickTips: ['Fuga de agua potable', 'Buzón sin tapa', 'Desagüe colapsado', 'Aniego en vía pública']
    },
    {
        id: 'seguridad',
        title: 'Seguridad y Orden',
        shortTitle: 'Seguridad',
        icon: 'fas fa-shield-alt',
        badge: 'Tranquilidad Vecinal',
        desc: 'Zonas peligrosas, falta de patrullaje, ocupación indebida de veredas o ruidos molestos.',
        tags: ['Patrullaje', 'Zonas oscuras', 'Orden público'],
        quickTips: ['Falta de patrullaje', 'Zona oscura peligrosa', 'Ocupación indebida de vereda', 'Ruidos molestos']
    },
    {
        id: 'otros',
        title: 'Otros Reclamos Urbanos',
        shortTitle: 'Otros Reclamos',
        icon: 'fas fa-clipboard-list',
        badge: 'Atención General',
        desc: 'Cualquier otra incidencia o problema urbano que requiera la intervención municipal.',
        tags: ['Mobiliario', 'Señalización', 'Reclamos varios'],
        quickTips: ['Señalización dañada', 'Semáforo inoperativo', 'Pintado de paso peatonal', 'Reclamo general']
    }
];

const CitizenCategoryHub = ({
    user,
    reports = [],
    activeCategory,
    onSelectCategory,
    activeTab,
    onTabChange
}) => {
    // Cálculo de métricas rápidas del ciudadano
    const totalReports = reports.length;
    const progressReports = reports.filter(r => r.status === 'progress').length;
    const resolvedReports = reports.filter(r => r.status === 'resolved').length;

    const activeCategoryObj = CATEGORIES.find(c => c.id === activeCategory);

    return (
        <section className="citizen-hub-container">
            {/* Header de bienvenida con mini-métricas */}
            <div className="citizen-header-card">
                <div className="citizen-welcome-info">
                    <h2>Bienvenido, {user?.name || 'Ciudadano Cusqueño'}</h2>
                    <p>Reporta incidencias en tu distrito o barrio y monitorea la atención de la Municipalidad.</p>
                </div>

                <div className="citizen-quick-metrics">
                    <div className="citizen-metric-pill" title="Total de incidencias reportadas por ti">
                        <div className="metric-pill-icon total">
                            <i className="fas fa-bullhorn"></i>
                        </div>
                        <div className="metric-pill-data">
                            <span className="metric-pill-val">{totalReports}</span>
                            <span className="metric-pill-label">Mis Reportes</span>
                        </div>
                    </div>

                    <div className="citizen-metric-pill" title="Incidencias que están siendo atendidas actualmente">
                        <div className="metric-pill-icon progress">
                            <i className="fas fa-clock"></i>
                        </div>
                        <div className="metric-pill-data">
                            <span className="metric-pill-val">{progressReports}</span>
                            <span className="metric-pill-label">En Proceso</span>
                        </div>
                    </div>

                    <div className="citizen-metric-pill" title="Incidencias concluidas y resueltas">
                        <div className="metric-pill-icon resolved">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <div className="metric-pill-data">
                            <span className="metric-pill-val">{resolvedReports}</span>
                            <span className="metric-pill-label">Resueltos</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pestañas de navegación para el ciudadano */}
            <nav className="citizen-tabs-bar" aria-label="Secciones del Ciudadano">
                <button
                    type="button"
                    className={`citizen-tab-btn ${activeTab === 'report' ? 'active' : ''}`}
                    onClick={() => onTabChange('report')}
                >
                    <i className="fas fa-plus-circle"></i>
                    <span>Reportar Incidencia</span>
                </button>

                <button
                    type="button"
                    className={`citizen-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => onTabChange('history')}
                >
                    <i className="fas fa-history"></i>
                    <span>Mis Reportes ({totalReports})</span>
                </button>

                <button
                    type="button"
                    className={`citizen-tab-btn ${activeTab === 'channels' ? 'active' : ''}`}
                    onClick={() => onTabChange('channels')}
                >
                    <i className="fab fa-whatsapp"></i>
                    <span>Atención y WhatsApp Directo</span>
                </button>
            </nav>

            {/* PESTAÑA: REPORTAR INCIDENCIA */}
            {activeTab === 'report' && (
                <>
                    {/* Barra de píldoras horizontales estilo Dribbble (como en la referencia) */}
                    <div className="category-pills-container">
                        <div className="category-pills-header">
                            <span className="pills-label">
                                <i className="fas fa-sliders-h"></i> Selecciona la categoría de tu incidencia:
                            </span>
                            {activeCategory && (
                                <button
                                    type="button"
                                    className="cat-clear-pill-btn"
                                    onClick={() => onSelectCategory(null)}
                                >
                                    <i className="fas fa-times"></i> Ver todas las categorías
                                </button>
                            )}
                        </div>

                        <div className="category-pills-bar" role="tablist">
                            <button
                                type="button"
                                className={`category-pill-btn ${!activeCategory ? 'active' : ''}`}
                                onClick={() => onSelectCategory(null)}
                                role="tab"
                                aria-selected={!activeCategory}
                            >
                                <i className="fas fa-th-large"></i>
                                <span>Todas</span>
                            </button>

                            {CATEGORIES.map(category => {
                                const isSelected = activeCategory === category.id;
                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        className={`category-pill-btn ${isSelected ? 'active' : ''}`}
                                        onClick={() => onSelectCategory(isSelected ? null : category.id)}
                                        role="tab"
                                        aria-selected={isSelected}
                                        title={category.desc}
                                    >
                                        <i className={category.icon}></i>
                                        <span>{category.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Letrero / Banner destacado: Formulario de Reporte Urbano */}
                    <div className="report-form-header-banner" id="report-form-banner">
                        <div className="form-banner-left">
                            <div className="form-banner-icon-box">
                                <i className={activeCategoryObj ? activeCategoryObj.icon : "fas fa-file-signature"}></i>
                            </div>
                            <div className="form-banner-text">
                                <h3 className="form-banner-title">Formulario de Reporte Urbano</h3>
                                <p className="form-banner-subtitle">
                                    {activeCategoryObj 
                                        ? `Configurado para: ${activeCategoryObj.title} — Completa los datos a continuación para registrar tu incidencia.`
                                        : 'Selecciona una categoría arriba para autocompletar el tipo o completa los datos generales de tu reporte:'}
                                </p>
                            </div>
                        </div>

                        {activeCategoryObj && (
                            <div className="form-banner-active-badge">
                                <span className="active-dot"></span>
                                <span>{activeCategoryObj.title}</span>
                                <button
                                    type="button"
                                    onClick={() => onSelectCategory(null)}
                                    title="Quitar categoría seleccionada"
                                    className="badge-remove-btn"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* PESTAÑA: CANALES DE ATENCIÓN DIRECTA */}
            {activeTab === 'channels' && (
                <div className="citizen-channels-view">
                    <div style={{
                        background: 'linear-gradient(150deg, rgba(131, 20, 44, 0.9) 0%, rgba(68, 0, 13, 0.96) 100%)',
                        border: '2px solid var(--color-gold)',
                        borderRadius: '20px',
                        padding: '2.5rem',
                        boxShadow: '0 12px 35px rgba(0,0,0,0.45)',
                        marginBottom: '2rem',
                        textAlign: 'center',
                        maxWidth: '750px',
                        margin: '0 auto'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #25D366, #128C7E)',
                            border: '3px solid var(--color-gold)',
                            margin: '0 auto 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            color: '#ffffff',
                            boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)'
                        }}>
                            <i className="fab fa-whatsapp"></i>
                        </div>

                        <span style={{
                            display: 'inline-block',
                            background: 'rgba(37, 211, 102, 0.2)',
                            color: '#4ade80',
                            border: '1px solid rgba(74, 222, 128, 0.4)',
                            padding: '0.35rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            letterSpacing: '0.5px'
                        }}>
                            ● AGENTE OFICIAL EN LÍNEA
                        </span>

                        <h3 style={{
                            color: 'var(--color-gold)',
                            fontFamily: 'var(--title-font)',
                            fontSize: '1.9rem',
                            margin: '0 0 0.8rem 0'
                        }}>
                            Atención al Ciudadano Cusco
                        </h3>

                        <p style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '1.05rem',
                            lineHeight: 1.6,
                            marginBottom: '2rem'
                        }}>
                            Comunícate directamente con nuestro agente especializado para resolver dudas sobre el uso de la plataforma, coordinar la atención de emergencias en la vía pública o dar seguimiento a tus reportes.
                        </p>

                        <a
                            href="https://api.whatsapp.com/send/?phone=51918643261&text&type=phone_number&app_absent=0"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.8rem',
                                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                color: '#ffffff',
                                border: '1.5px solid var(--color-gold)',
                                padding: '1rem 2.2rem',
                                borderRadius: '14px',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                textDecoration: 'none',
                                boxShadow: '0 6px 20px rgba(37, 211, 102, 0.45)',
                                transition: 'all 0.25s'
                            }}
                        >
                            <i className="fab fa-whatsapp" style={{ fontSize: '1.4rem' }}></i>
                            <span>Abrir Chat con el Agente de Atención</span>
                        </a>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CitizenCategoryHub;
