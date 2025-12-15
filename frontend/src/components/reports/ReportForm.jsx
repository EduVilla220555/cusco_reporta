import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import { useToast } from '../common/Toast';
import Button from '../common/Button';
import Card from '../common/Card';
import './ReportForm.css';

const ReportForm = () => {
    const { user } = useAuth();
    const { createReport } = useReports();
    const toast = useToast();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: '',
        priority: 'media',
        latitude: null,
        longitude: null,
        photo_url: null
    });
    const [loading, setLoading] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);

    const reportTypes = [
        { value: 'vias', label: 'Vías y Pistas Dañadas' },
        { value: 'alumbrado', label: 'Falta de Alumbrado' },
        { value: 'basura', label: 'Acumulación de Basura' },
        { value: 'otros', label: 'Otros' }
    ];

    const priorities = [
        { value: 'baja', label: 'Baja' },
        { value: 'media', label: 'Media' },
        { value: 'alta', label: 'Alta' }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Capturar geolocalización
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Tu navegador no soporta geolocalización');
            return;
        }

        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData({
                    ...formData,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                toast.success('¡Ubicación capturada exitosamente!');
                setGeoLoading(false);
            },
            (error) => {
                console.error('Error obteniendo ubicación:', error);
                toast.error('No se pudo obtener la ubicación. Verifica los permisos.');
                setGeoLoading(false);
            }
        );
    };

    // Manejar selección de foto
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor selecciona una imagen válida');
            return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('La imagen debe ser menor a 5MB');
            return;
        }

        // Convertir a base64 para preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
            // Guardamos preview (base64) pero NO guardamos base64 en formData; usamos FormData al enviar
            setPhotoFile(file); // guardar el file real para envío
            toast.success('Foto cargada correctamente');
        };
        reader.readAsDataURL(file);
    };

    // Eliminar foto
    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        setFormData({
            ...formData,
            photo_url: null
        });
        setPhotoFile(null);
        document.getElementById('photo').value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.type) {
            toast.error('El título y tipo son obligatorios');
            return;
        }

        setLoading(true);

        try {
            // Construir FormData para enviar multipart/form-data (incluye archivo si existe)
            const fd = new FormData();
            fd.append('title', formData.title);
            fd.append('description', formData.description || '');
            fd.append('type', formData.type);
            fd.append('priority', formData.priority);
            if (formData.latitude) fd.append('latitude', formData.latitude);
            if (formData.longitude) fd.append('longitude', formData.longitude);
            fd.append('citizen_id', user.id);
            if (photoFile) fd.append('photo', photoFile);

            const response = await createReport(fd);

            if (response.success) {
                toast.success('¡Reporte creado exitosamente!');
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
                document.getElementById('photo').value = '';
            }
        } catch (error) {
            toast.error(error.message || 'Error al crear reporte');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Reportar Nueva Incidencia" icon="plus-circle">
            <form onSubmit={handleSubmit} className="report-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="type">Tipo de Incidencia *</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione...</option>
                            {reportTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority">Prioridad</label>
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

                <div className="form-group">
                    <label htmlFor="title">Título del Reporte *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ej: Hueco en la Av. El Sol"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Describa la incidencia..."
                    />
                </div>

                {/* NUEVA SECCIÓN: FOTO */}
                <div className="form-group">
                    <label htmlFor="photo">
                        <i className="fas fa-camera"></i> Foto de la Incidencia (Opcional)
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
                            <img src={photoPreview} alt="Preview" />
                            <button 
                                type="button" 
                                className="remove-photo-btn"
                                onClick={handleRemovePhoto}
                            >
                                <i className="fas fa-times"></i> Quitar foto
                            </button>
                        </div>
                    )}
                </div>

                {/* NUEVA SECCIÓN: GEOLOCALIZACIÓN */}
                <div className="form-group">
                    <label>
                        <i className="fas fa-map-marker-alt"></i> Ubicación (Opcional)
                    </label>
                    <div className="location-container">
                        <Button 
                            type="button"
                            variant="secondary"
                            icon="location-arrow"
                            onClick={handleGetLocation}
                            disabled={geoLoading}
                        >
                            {geoLoading ? 'Obteniendo ubicación...' : 'Capturar mi ubicación'}
                        </Button>
                        
                        {formData.latitude && formData.longitude && (
                            <div className="location-info">
                                <i className="fas fa-check-circle"></i>
                                <span>Ubicación capturada</span>
                                <small>
                                    Lat: {formData.latitude.toFixed(6)}, 
                                    Lng: {formData.longitude.toFixed(6)}
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
                    {loading ? 'Enviando...' : 'Enviar Reporte'}
                </Button>
            </form>
        </Card>
    );
};

export default ReportForm;