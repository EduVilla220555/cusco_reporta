import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import { useToast } from '../common/Toast';
import Button from '../common/Button';
import Card from '../common/Card';
import { CATEGORIES } from '../citizen/CitizenCategoryHub';
import './ReportForm.css';

const ReportForm = ({ selectedCategory = null, onCategoryChange = null, onReportCreated = null }) => {
    const { user } = useAuth();
    const { createReport } = useReports();
    const toast = useToast();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: selectedCategory || '',
        priority: 'media',
        latitude: null,
        longitude: null,
        photo_url: null
    });
    const [loading, setLoading] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);

    // Sincronizar si la categoría seleccionada desde las píldoras de CitizenCategoryHub cambia
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            type: selectedCategory || ''
        }));
    }, [selectedCategory]);

    const reportTypes = [
        { value: 'alumbrado', label: '💡 Falta de Alumbrado Público' },
        { value: 'basura', label: '🗑️ Acumulación de Basura y Residuos' },
        { value: 'vias', label: '🚧 Vías, Pistas y Veredas Dañadas' },
        { value: 'parques', label: '🌳 Parques y Áreas Verdes' },
        { value: 'agua', label: '💧 Fuga de Agua o Alcantarillado' },
        { value: 'seguridad', label: '🛡️ Seguridad y Orden Público' },
        { value: 'otros', label: '📋 Otros Reclamos Urbanos' }
    ];

    const priorities = [
        { value: 'baja', label: 'Baja (Trámite regular)' },
        { value: 'media', label: 'Media (Atención estándar)' },
        { value: 'alta', label: 'Alta (Peligro o urgencia vecinal)' }
    ];

    const currentCatObj = CATEGORIES.find(c => c.id === formData.type);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'type' && onCategoryChange) {
            onCategoryChange(value || null);
        }
    };

    // Agregar sugerencia rápida al título
    const handleAddQuickTip = (tip) => {
        setFormData(prev => {
            const separator = prev.title ? ' - ' : '';
            return {
                ...prev,
                title: prev.title.includes(tip) ? prev.title : `${prev.title}${separator}${tip}`
            };
        });
        toast.info(`Sugerencia agregada: "${tip}"`);
    };

    // Capturar geolocalización GPS
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Tu navegador no soporta geolocalización');
            return;
        }

        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                toast.success('¡Ubicación GPS capturada con éxito!');
                setGeoLoading(false);
            },
            (error) => {
                console.error('Error obteniendo ubicación:', error);
                toast.error('No se pudo obtener la ubicación. Verifica los permisos.');
                setGeoLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // Manejar selección de foto
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Por favor selecciona una imagen válida');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('La imagen debe ser menor a 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
            setPhotoFile(file);
            toast.success('Foto cargada correctamente');
        };
        reader.readAsDataURL(file);
    };

    // Eliminar foto
    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        setFormData(prev => ({
            ...prev,
            photo_url: null
        }));
        setPhotoFile(null);
        const inputElem = document.getElementById('photo');
        if (inputElem) inputElem.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.type) {
            toast.error('Por favor selecciona la categoría e ingresa el título del reporte.');
            return;
        }

        setLoading(true);

        try {
            const fd = new FormData();
            fd.append('title', formData.title.trim());
            fd.append('description', formData.description ? formData.description.trim() : '');
            fd.append('type', formData.type);
            fd.append('priority', formData.priority);
            if (formData.latitude) fd.append('latitude', formData.latitude);
            if (formData.longitude) fd.append('longitude', formData.longitude);
            fd.append('citizen_id', user.id);
            if (photoFile) fd.append('photo', photoFile);

            const response = await createReport(fd);

            if (response && response.success) {
                toast.success('¡Reporte registrado exitosamente en el sistema municipal!');
                
                // Limpiar formulario
                setFormData({
                    title: '',
                    description: '',
                    type: '',
                    priority: 'media',
                    latitude: null,
                    longitude: null,
                    photo_url: null
                });
                setPhotoPreview(null);
                setPhotoFile(null);
                const inputElem = document.getElementById('photo');
                if (inputElem) inputElem.value = '';

                if (onReportCreated) {
                    onReportCreated();
                }
            }
        } catch (error) {
            toast.error(error.message || 'Error al registrar el reporte');
        } finally {
            setLoading(false);
        }
    };

    const dynamicPlaceholder = 
        formData.type === 'alumbrado'
            ? "Ej: Poste apagado en Av. El Sol frente a Qorikancha"
            : formData.type === 'basura'
            ? "Ej: Acumulación de residuos en esquina de San Pedro"
            : formData.type === 'vias'
            ? "Ej: Baches profundos y vereda rota en calle Saphy cdra 4"
            : formData.type === 'parques'
            ? "Ej: Árbol con riesgo de caída en Plaza San Francisco"
            : formData.type === 'agua'
            ? "Ej: Fuga de agua en calzada y buzón de desagüe sin tapa"
            : formData.type === 'seguridad'
            ? "Ej: Falta de patrullaje y zona oscura peligrosa"
            : "Ej: Describa la incidencia indicando calle o punto de referencia";

    return (
        <div className="report-form-card-container" id="report-form-card">
            <Card>
                <form onSubmit={handleSubmit} className="report-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="type">
                                <i className="fas fa-layer-group"></i> Tipo de Incidencia *
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Selecciona una categoría --</option>
                                {reportTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">
                                <i className="fas fa-exclamation-triangle"></i> Nivel de Prioridad
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                {priorities.map(priority => (
                                    <option key={priority.value} value={priority.value}>
                                        {priority.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Chips contextuales de sugerencias rápidas para la categoría seleccionada */}
                    {currentCatObj && currentCatObj.quickTips && (
                        <div className="quick-tips-container" style={{
                            marginBottom: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            flexWrap: 'wrap',
                            background: 'rgba(68, 0, 13, 0.5)',
                            padding: '0.7rem 1rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(249, 210, 118, 0.2)'
                        }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: '700' }}>
                                <i className="fas fa-magic" style={{ marginRight: '4px' }}></i> Sugerencias rápidas:
                            </span>
                            {currentCatObj.quickTips.map((tip, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleAddQuickTip(tip)}
                                    style={{
                                        background: 'rgba(249, 210, 118, 0.12)',
                                        color: '#ffffff',
                                        border: '1px solid rgba(249, 210, 118, 0.3)',
                                        borderRadius: '15px',
                                        padding: '0.25rem 0.65rem',
                                        fontSize: '0.78rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = 'var(--color-gold)';
                                        e.currentTarget.style.color = 'var(--color-maroon)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'rgba(249, 210, 118, 0.12)';
                                        e.currentTarget.style.color = '#ffffff';
                                    }}
                                >
                                    + {tip}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="title">
                            <i className="fas fa-heading"></i> Título del Reporte *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder={dynamicPlaceholder}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            <i className="fas fa-align-left"></i> Descripción Detallada
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Brinde detalles adicionales como calles adyacentes, referencias o tiempo que lleva el problema..."
                        />
                    </div>

                    {/* FOTO ADJUNTA */}
                    <div className="form-group">
                        <label htmlFor="photo">
                            <i className="fas fa-camera"></i> Fotografía Evidencia (Opcional - Máx. 5MB)
                        </label>
                        <input
                            type="file"
                            id="photo"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="file-input"
                        />
                        {photoPreview && (
                            <div className="photo-preview">
                                <img src={photoPreview} alt="Vista previa de la evidencia" />
                                <button 
                                    type="button" 
                                    className="remove-photo-btn"
                                    onClick={handleRemovePhoto}
                                >
                                    <i className="fas fa-times"></i> Quitar fotografía
                                </button>
                            </div>
                        )}
                    </div>

                    {/* GEOLOCALIZACIÓN GPS */}
                    <div className="form-group">
                        <label>
                            <i className="fas fa-map-marker-alt"></i> Ubicación Georreferenciada (Recomendado)
                        </label>
                        <div className="location-container">
                            <Button 
                                type="button"
                                variant="secondary"
                                icon="location-arrow"
                                onClick={handleGetLocation}
                                disabled={geoLoading}
                            >
                                {geoLoading ? 'Obteniendo coordenadas GPS...' : 'Capturar mi ubicación actual GPS'}
                            </Button>
                            
                            {formData.latitude && formData.longitude && (
                                <div className="location-info">
                                    <i className="fas fa-check-circle"></i>
                                    <span>Coordenadas registradas con éxito</span>
                                    <small>
                                        Latitud: {Number(formData.latitude).toFixed(6)}, Longitud: {Number(formData.longitude).toFixed(6)}
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        variant="primary" 
                        icon="paper-plane"
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? 'Registrando en el sistema...' : 'Enviar Reporte a la Municipalidad'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default ReportForm;