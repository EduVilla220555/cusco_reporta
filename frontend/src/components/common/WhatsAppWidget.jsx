import { useState } from 'react';
import './WhatsAppWidget.css';

const WHATSAPP_AGENT_URL = 'https://api.whatsapp.com/send/?phone=51918643261&text&type=phone_number&app_absent=0';

const WhatsAppWidget = ({ currentReportCode = null, currentReportTitle = null }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDirectOpen = () => {
        window.open(WHATSAPP_AGENT_URL, '_blank', 'noopener,noreferrer');
        setIsOpen(false);
    };

    return (
        <div className="wa-floating-container">
            {/* Modal simplificado de Agente Especializado */}
            {isOpen && (
                <div className="wa-modal-backdrop" onClick={() => setIsOpen(false)}>
                    <div className="wa-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="wa-modal-header">
                            <div className="wa-header-info">
                                <div className="wa-header-avatar">
                                    <i className="fab fa-whatsapp"></i>
                                    <span className="wa-avatar-online-dot"></span>
                                </div>
                                <div>
                                    <h4 className="wa-header-title">Atención al Ciudadano</h4>
                                    <p className="wa-header-subtitle">Agente especializado en línea 🟢</p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                className="wa-close-btn" 
                                onClick={() => setIsOpen(false)}
                                aria-label="Cerrar ventana de WhatsApp"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="wa-modal-body">
                            <div className="wa-agent-badge">
                                <i className="fas fa-shield-alt"></i>
                                <span>Canal Oficial de Asistencia Municipal</span>
                            </div>

                            <p className="wa-agent-intro">
                                ¡Hola! 👋 Conéctate directamente con nuestro agente especializado para resolver cualquier duda sobre tus reportes urbanos o incidencias en la ciudad.
                            </p>

                            {currentReportCode && (
                                <div className="wa-report-context">
                                    <i className="fas fa-file-invoice"></i>
                                    <span>Consulta activa sobre el reporte: <strong>{currentReportCode}</strong></span>
                                </div>
                            )}

                            <a
                                href={WHATSAPP_AGENT_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="wa-action-btn"
                                onClick={() => setIsOpen(false)}
                            >
                                <i className="fab fa-whatsapp" style={{ fontSize: '1.3rem' }}></i>
                                <span>Iniciar Chat con el Agente</span>
                            </a>

                            <div className="wa-modal-footer-note">
                                <i className="fas fa-check-circle" style={{ color: '#4ade80' }}></i>
                                <span>Atención rápida y personalizada</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Botón flotante permanente */}
            <button 
                type="button"
                className="wa-trigger-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Abrir chat de WhatsApp con agente especializado"
            >
                <i className="fab fa-whatsapp wa-trigger-icon"></i>
                <div className="wa-trigger-text">
                    <span className="wa-trigger-title">WhatsApp Municipal</span>
                    <span className="wa-trigger-status">
                        <span className="wa-status-dot"></span> Agente en línea
                    </span>
                </div>
            </button>
        </div>
    );
};

export default WhatsAppWidget;
