import React from 'react';
import './ReportTimeline.css';

const ReportTimeline = ({ report }) => {
    if (!report) return null;

    const status = report.status || 'pending';
    const createdAtDate = report.created_at ? new Date(report.created_at).toLocaleDateString('es-PE', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : 'Fecha no registrada';

    // Determinar estado de cada uno de los 4 pasos
    // Pasos:
    // 0: Registro
    // 1: Recepción / Evaluación
    // 2: Cuadrilla / En Proceso
    // 3: Resuelto
    let currentStepIndex = 1; // por defecto en evaluación si está pending
    if (status === 'progress') currentStepIndex = 2;
    if (status === 'resolved') currentStepIndex = 3;

    const steps = [
        {
            number: 1,
            title: 'Reporte Registrado',
            desc: 'Ingresado por el ciudadano con código único y geolocalización.',
            date: createdAtDate,
            icon: 'fas fa-clipboard-check'
        },
        {
            number: 2,
            title: 'Evaluación Técnica',
            desc: 'Mesa de partes derivó la incidencia al área especializada.',
            date: currentStepIndex >= 1 ? 'Validado por Mesa de Partes' : null,
            icon: 'fas fa-search-location'
        },
        {
            number: 3,
            title: 'Cuadrilla Asignada',
            desc: 'Equipo municipal e inspectores atendiendo en campo.',
            date: currentStepIndex >= 2 ? 'En intervención operativa' : 'Pendiente de turno',
            icon: 'fas fa-tools'
        },
        {
            number: 4,
            title: 'Incidencia Resuelta',
            desc: 'Problema solucionado y validado satisfactoriamente.',
            date: currentStepIndex === 3 ? 'Solución concluida' : 'Pendiente de cierre',
            icon: 'fas fa-check-double'
        }
    ];

    // Porcentaje de progreso para la barra conectora horizontal
    const progressWidths = {
        0: '0%',
        1: '33%',
        2: '66%',
        3: '100%'
    };

    return (
        <div className="report-timeline-container">
            <div className="timeline-header">
                <div className="timeline-title">
                    <i className="fas fa-history"></i>
                    <span>Línea de Tiempo de Seguimiento Municipal</span>
                </div>
                <span className={`timeline-current-status status-${status}`}>
                    {status === 'pending' && '⏳ Estado: Pendiente de Atención'}
                    {status === 'progress' && '⚡ Estado: En Proceso / Cuadrilla en Campo'}
                    {status === 'resolved' && '✅ Estado: Concluido y Resuelto'}
                </span>
            </div>

            <div className="stepper-track">
                {/* Barra de progreso de fondo */}
                <div 
                    className="stepper-progress-fill" 
                    style={{ width: progressWidths[currentStepIndex] }}
                />

                {steps.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex || (idx === 3 && currentStepIndex === 3);
                    const isActive = idx === currentStepIndex && currentStepIndex !== 3;

                    return (
                        <div 
                            key={step.number} 
                            className={`step-node-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                        >
                            <div className="step-circle">
                                {isCompleted ? (
                                    <i className="fas fa-check"></i>
                                ) : isActive ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                    <span>{step.number}</span>
                                )}
                            </div>

                            <div className="step-info">
                                <span className="step-title">{step.title}</span>
                                <p className="step-desc">{step.desc}</p>
                                {step.date && <span className="step-date">{step.date}</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReportTimeline;
