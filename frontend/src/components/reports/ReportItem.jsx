import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import { useToast } from '../common/Toast';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import './ReportItem.css';

const ReportItem = ({ report, showCitizenInfo = false, showActions = false }) => {
    const { user } = useAuth();
    const { updateReportStatus } = useReports();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null });
    const [showPhoto, setShowPhoto] = useState(false);

    const statusMap = {
        pending: { text: 'Pendiente', class: 'status-pending' },
        progress: { text: 'En Proceso', class: 'status-progress' },
        resolved: { text: 'Resuelto', class: 'status-resolved' }
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
                    <div className="report-title">{report.title}</div>
                    <span className={`status-badge ${statusMap[report.status].class}`}>
                        {statusMap[report.status].text}
                    </span>
                </div>

                <div className="report-meta">
                    <span><strong>ID:</strong> {report.code}</span>
                    <span><strong>Fecha:</strong> {new Date(report.created_at).toLocaleDateString()}</span>
                    <span><strong>Tipo:</strong> {report.type}</span>
                    <span><strong>Prioridad:</strong> {report.priority}</span>
                </div>

                {showCitizenInfo && (
                    <div className="report-citizen">
                        <strong>Ciudadano:</strong> {report.citizen_name} ({report.citizen_email})
                    </div>
                )}

                {report.description && (
                    <p className="report-description">{report.description}</p>
                )}

                {/* MOSTRAR UBICACIÓN SI EXISTE */}
                {report.latitude && report.longitude && (
                    <div className="report-location">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Ubicación registrada:</span>
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

                {/* MOSTRAR FOTO SI EXISTE */}
                {report.photo_url && (
                    <div className="report-photo-section">
                        <button 
                            className="show-photo-btn"
                            onClick={() => setShowPhoto(!showPhoto)}
                        >
                            <i className={`fas fa-${showPhoto ? 'eye-slash' : 'image'}`}></i>
                            {showPhoto ? 'Ocultar foto' : 'Ver foto adjunta'}
                        </button>
                        
                        {showPhoto && (
                            <div className="report-photo">
                                <img src={report.photo_url} alt="Foto del reporte" />
                            </div>
                        )}
                    </div>
                )}

                {renderActions()}
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