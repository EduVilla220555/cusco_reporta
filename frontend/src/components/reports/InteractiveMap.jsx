import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import './InteractiveMap.css';

// Centro histórico de la ciudad de Cusco
const CUSCO_CENTER = [-13.5160, -71.9785];

const categoryIcons = {
    alumbrado: 'fas fa-lightbulb',
    basura: 'fas fa-trash-alt',
    vias: 'fas fa-road',
    parques: 'fas fa-tree',
    agua: 'fas fa-tint',
    seguridad: 'fas fa-shield-alt',
    otros: 'fas fa-clipboard-list'
};

const statusLabels = {
    pending: 'Pendiente',
    progress: 'En Proceso',
    resolved: 'Resuelto'
};

const InteractiveMap = ({ reports = [], onSelectReport = null, height = '440px' }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersLayerRef = useRef(null);

    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'progress' | 'resolved'
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Inicializar mapa de Leaflet
    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Evitar inicializaciones dobles
        if (mapInstanceRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: CUSCO_CENTER,
            zoom: 14,
            zoomControl: true,
            scrollWheelZoom: false
        });

        // Capa de mapas OpenStreetMap de alta calidad
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors | Municipalidad del Cusco'
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapInstanceRef.current = map;

        // Asegurar que el tamaño del mapa se ajuste bien al renderizar
        setTimeout(() => {
            map.invalidateSize();
        }, 200);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Actualizar marcadores cuando cambian los reportes o los filtros
    useEffect(() => {
        const map = mapInstanceRef.current;
        const markersLayer = markersLayerRef.current;
        if (!map || !markersLayer) return;

        markersLayer.clearLayers();

        // Filtrar reportes con coordenadas válidas
        const validReports = reports.filter(r => {
            const hasCoords = r.latitude && r.longitude && !isNaN(Number(r.latitude)) && !isNaN(Number(r.longitude));
            const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
            const matchesCategory = selectedCategory === 'all' || r.type === selectedCategory;
            return hasCoords && matchesStatus && matchesCategory;
        });

        const bounds = L.latLngBounds();

        validReports.forEach(report => {
            const lat = Number(report.latitude);
            const lng = Number(report.longitude);
            const status = report.status || 'pending';
            const iconClass = categoryIcons[report.type] || 'fas fa-map-marker-alt';

            // Crear ícono HTML personalizado
            const customIcon = L.divIcon({
                className: 'custom-map-marker',
                html: `
                    <div class="marker-pin ${status}">
                        <i class="${iconClass} marker-icon"></i>
                    </div>
                `,
                iconSize: [36, 36],
                iconAnchor: [18, 36],
                popupAnchor: [0, -32]
            });

            const marker = L.marker([lat, lng], { icon: customIcon });

            // Contenido enriquecido del Popup
            const photoHtml = report.photo_url 
                ? `<img src="${report.photo_url}" alt="Evidencia" class="popup-photo" />`
                : '';

            const popupContent = `
                <div class="map-popup-card">
                    <span class="popup-tag ${status}">${statusLabels[status] || status}</span>
                    <div class="popup-code">${report.code || `#REP-${report.id}`}</div>
                    <h5 class="popup-title">${report.title}</h5>
                    ${photoHtml}
                    ${report.description ? `<p style="font-size:0.8rem; margin: 4px 0; color:rgba(255,255,255,0.85);">${report.description.substring(0, 90)}...</p>` : ''}
                    <a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank" rel="noopener noreferrer" class="popup-link">
                        <i class="fas fa-external-link-alt"></i> Ver en Google Maps
                    </a>
                </div>
            `;

            marker.bindPopup(popupContent);
            markersLayer.addLayer(marker);
            bounds.extend([lat, lng]);
        });

        // Ajustar zoom si hay marcadores
        if (validReports.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        } else {
            map.setView(CUSCO_CENTER, 14);
        }
    }, [reports, statusFilter, selectedCategory]);

    const handleCenterCusco = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setView(CUSCO_CENTER, 15, { animate: true });
        }
    };

    const handleLocateMe = () => {
        if (!navigator.geolocation || !mapInstanceRef.current) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const userPos = [pos.coords.latitude, pos.coords.longitude];
            mapInstanceRef.current.setView(userPos, 16, { animate: true });

            L.circle(userPos, {
                radius: 120,
                color: '#F9D276',
                fillColor: '#F9D276',
                fillOpacity: 0.25
            }).addTo(markersLayerRef.current)
              .bindPopup('Tu ubicación actual aproximada')
              .openPopup();
        });
    };

    const georeferencedCount = reports.filter(r => r.latitude && r.longitude).length;

    return (
        <div className="interactive-map-container">
            <div className="map-header-controls">
                <div className="map-title-info">
                    <div className="map-title-icon">
                        <i className="fas fa-map-marked-alt"></i>
                    </div>
                    <div className="map-title-text">
                        <h4>Mapa Urbano de Incidencias en Cusco</h4>
                        <p>{georeferencedCount} reportes georreferenciados en la provincia del Cusco</p>
                    </div>
                </div>

                <div className="map-filter-tags">
                    <button
                        type="button"
                        className={`map-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        Todos
                    </button>
                    <button
                        type="button"
                        className={`map-filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('pending')}
                    >
                        <span className="legend-dot pending" style={{ width: 8, height: 8 }}></span>
                        Pendientes
                    </button>
                    <button
                        type="button"
                        className={`map-filter-btn ${statusFilter === 'progress' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('progress')}
                    >
                        <span className="legend-dot progress" style={{ width: 8, height: 8 }}></span>
                        En Proceso
                    </button>
                    <button
                        type="button"
                        className={`map-filter-btn ${statusFilter === 'resolved' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('resolved')}
                    >
                        <span className="legend-dot resolved" style={{ width: 8, height: 8 }}></span>
                        Resueltos
                    </button>
                    <button
                        type="button"
                        className="map-filter-btn"
                        onClick={handleCenterCusco}
                        title="Centrar en Plaza de Armas del Cusco"
                    >
                        <i className="fas fa-crosshairs"></i> Plaza Cusco
                    </button>
                    <button
                        type="button"
                        className="map-filter-btn"
                        onClick={handleLocateMe}
                        title="Ir a mi ubicación GPS actual"
                    >
                        <i className="fas fa-location-arrow"></i> Mi Ubicación
                    </button>
                </div>
            </div>

            {/* Lienzo del Mapa */}
            <div 
                ref={mapContainerRef} 
                className="leaflet-map-wrapper" 
                style={{ height }}
            />

            {/* Leyenda explicativa */}
            <div className="map-legend">
                <span style={{ fontWeight: 700, color: 'var(--color-gold)' }}>Leyenda de atención:</span>
                <div className="legend-item">
                    <span className="legend-dot pending"></span>
                    <span>Pendiente de Atención</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot progress"></span>
                    <span>Cuadrilla / En Proceso</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot resolved"></span>
                    <span>Incidencia Resuelta</span>
                </div>
            </div>
        </div>
    );
};

export default InteractiveMap;
