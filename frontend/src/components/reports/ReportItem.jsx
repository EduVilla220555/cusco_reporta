import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import { useToast } from '../common/Toast';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import ReportTimeline from './ReportTimeline';
import './ReportItem.css';

const ReportItem = ({ report, showCitizenInfo = false, showActions = false }) => {
    const { user } = useAuth();
    const { updateReportStatus } = useReports();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null });
    const [showPhoto, setShowPhoto] = useState(false);
    const [showTimeline, setShowTimeline] = useState(false);

    const statusMap = {
        pending: { text: 'Pendiente', class: 'status-pending', icon: 'fas fa-hourglass-start' },
        progress: { text: 'En Proceso', class: 'status-progress', icon: 'fas fa-spinner fa-spin' },
        resolved: { text: 'Resuelto', class: 'status-resolved', icon: 'fas fa-check-circle' }
    };

    const typeConfig = {
        alumbrado: { text: 'Alumbrado Público', icon: 'fas fa-lightbulb', color: '#e5be5a', phone: '51984654321', entity: 'Mantenimiento y Alumbrado' },
        basura: { text: 'Limpieza y Basura', icon: 'fas fa-trash-alt', color: '#38a169', phone: '51984123456', entity: 'Limpieza y Medio Ambiente' },
        vias: { text: 'Vías y Pistas', icon: 'fas fa-road', color: '#dd6b20', phone: '51984654321', entity: 'Obras y Mantenimiento Vial' },
        parques: { text: 'Parques y Áreas Verdes', icon: 'fas fa-tree', color: '#48bb78', phone: '51984123456', entity: 'Gerencia Ambiental' },
        agua: { text: 'Agua y Alcantarillado', icon: 'fas fa-tint', color: '#3182ce', phone: '51984789012', entity: 'Atención de Saneamiento' },
        seguridad: { text: 'Seguridad Ciudadana', icon: 'fas fa-shield-alt', color: '#e53e3e', phone: '51984221118', entity: 'Central de Serenazgo Cusco' },
        otros: { text: 'Otros Reclamos', icon: 'fas fa-clipboard-list', color: '#805ad5', phone: '51984789012', entity: 'Mesa de Partes Municipal' }
    };

    const typeInfo = typeConfig[report.type] || {
        text: report.type || 'Incidencia General',
        icon: 'fas fa-tag',
        color: 'var(--color-gold)',
        phone: '51984221118',
        entity: 'Atención Municipal'
    };

    const handleUpdateStatus = async (newStatus) => {
        setLoading(true);
        setConfirmDialog({ isOpen: false, action: null });

        try {
            await updateReportStatus(report.id, {
                status: newStatus,
                user_id: user.id,
                comment: `Estado actualizado a ${newStatus}`
            });

            toast.success(`¡Reporte actualizado a "${statusMap[newStatus].text}"!`);
        } catch (error) {
            toast.error(error.message || 'Error al actualizar el estado');
        } finally {
            setLoading(false);
        }
    };

    const openConfirmDialog = (action, newStatus) => {
        setConfirmDialog({
            isOpen: true,
            action: newStatus,
            title: `¿Confirmar ${action}?`,
            message: `¿Estás seguro de que deseas ${action.toLowerCase()} este reporte?`
        });
    };

    const handleWhatsAppFollowUp = () => {
        const url = 'https://api.whatsapp.com/send/?phone=51918643261&text&type=phone_number&app_absent=0';
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const renderActions = () => {
        if (!showActions) return null;

        if (report.status === 'pending') {
            return (
                <div className="report-actions">
                    <Button
                        variant="warning"
                        size="small"
                        icon="play"
                        onClick={() => openConfirmDialog('Iniciar atención', 'progress')}
                        disabled={loading}
                    >
                        Iniciar
                    </Button>
                    <Button
                        variant="success"
                        size="small"
                        icon="check"
                        onClick={() => openConfirmDialog('Resolver directamente', 'resolved')}
                        disabled={loading}
                    >
                        Resolver
                    </Button>
                </div>
            );
        }

        if (report.status === 'progress') {
            return (
                <div className="report-actions">
                    <Button
                        variant="success"
                        size="small"
                        icon="check"
                        onClick={() => openConfirmDialog('Finalizar reporte', 'resolved')}
                        disabled={loading}
                    >
                        Finalizar
                    </Button>
                </div>
            );
        }

        return null;
    };

    return (
        <>
            <div className="report-item">
                <div className="report-header">
                    <div className="report-title-group">
                        <span className="report-type-pill" style={{ borderColor: typeInfo.color }}>
                            <i className={typeInfo.icon} style={{ color: typeInfo.color }}></i>
                            {typeInfo.text}
                        </span>
                        <h4 className="report-title">{report.title}</h4>
                    </div>

                    <span className={`status-badge ${statusMap[report.status]?.class || 'status-pending'}`}>
                        {statusMap[report.status]?.text || report.status}
                    </span>
                </div>

                <div className="report-meta">
                    <span><strong>N° Reporte:</strong> {report.code || `#${report.id}`}</span>
                    <span><strong>Fecha:</strong> {new Date(report.created_at).toLocaleDateString()}</span>
                    <span>
                        <strong>Prioridad:</strong> 
                        <span className={`priority-tag priority-${report.priority || 'media'}`} style={{ marginLeft: '4px' }}>
                            {report.priority ? report.priority.toUpperCase() : 'MEDIA'}
                        </span>
                    </span>
                </div>

                {showCitizenInfo && (
                    <div className="report-citizen">
                        <i className="fas fa-user-circle"></i>
                        <span><strong>Ciudadano:</strong> {report.citizen_name} ({report.citizen_email})</span>
                    </div>
                )}

                {report.description && (
                    <p className="report-description">{report.description}</p>
                )}

                {/* UBICACIÓN GPS */}
                {report.latitude && report.longitude && (
                    <div className="report-location">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Coordenadas: Lat {Number(report.latitude).toFixed(5)}, Lng {Number(report.longitude).toFixed(5)}</span>
                        <a 
                            href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="location-link"
                        >
                            Ver en Google Maps
                            <i className="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                )}

                {/* FOTOGRAFÍA ADJUNTA */}
                {report.photo_url && (
                    <div className="report-photo-section">
                        <button 
                            type="button"
                            className="show-photo-btn"
                            onClick={() => setShowPhoto(!showPhoto)}
                        >
                            <i className={`fas fa-${showPhoto ? 'eye-slash' : 'image'}`}></i>
                            {showPhoto ? 'Ocultar fotografía' : 'Ver fotografía de evidencia'}
                        </button>
                        
                        {showPhoto && (
                            <div className="report-photo">
                                <img src={report.photo_url} alt="Foto del reporte" />
                            </div>
                        )}
                    </div>
                )}

                {/* BARRA DE INTERACCIÓN: BOTÓN WHATSAPP DE AUTORIDAD COMPETENTE + ACCIONES */}
                <div className="report-footer-bar" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.8rem',
                    marginTop: '1.2rem',
                    paddingTop: '0.8rem',
                    borderTop: '1px solid rgba(249, 210, 118, 0.2)'
                }}>
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={handleWhatsAppFollowUp}
                            className="report-wa-btn"
                            title={`Consultar por WhatsApp con ${typeInfo.entity}`}
                            style={{
                                background: 'rgba(37, 211, 102, 0.15)',
                                color: '#25D366',
                                border: '1.5px solid #25D366',
                                borderRadius: '8px',
                                padding: '0.5rem 0.9rem',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <i className="fab fa-whatsapp" style={{ fontSize: '1rem' }}></i>
                            <span>Consultar con Agente WhatsApp</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowTimeline(!showTimeline)}
                            className="report-timeline-toggle-btn"
                            style={{
                                background: showTimeline ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' : 'rgba(131, 20, 44, 0.7)',
                                color: showTimeline ? 'var(--color-maroon)' : 'var(--color-gold)',
                                border: '1.5px solid var(--color-gold)',
                                borderRadius: '8px',
                                padding: '0.5rem 0.9rem',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <i className="fas fa-route"></i>
                            <span>{showTimeline ? 'Ocultar Línea de Tiempo' : 'Ver Línea de Tiempo'}</span>
                        </button>
                    </div>

                    {renderActions()}
                </div>

                {/* Línea de tiempo visual progresiva (Punto 4) */}
                {showTimeline && (
                    <ReportTimeline report={report} />
                )}
            </div>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                type="warning"
                confirmText="Confirmar"
                cancelText="Cancelar"
                onConfirm={() => handleUpdateStatus(confirmDialog.action)}
                onCancel={() => setConfirmDialog({ isOpen: false, action: null })}
            />
        </>
    );
};

export default ReportItem;