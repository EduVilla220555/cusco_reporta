import { useState } from 'react';
import { useToast } from '../common/Toast';
import './EmergencyDirectory.css';

const EMERGENCY_CONTACTS = [
    {
        id: 'serenazgo',
        name: 'Central de Serenazgo Cusco',
        desc: 'Seguridad ciudadana, patrullaje preventivo y atención inmediata en la vía pública.',
        primaryPhone: '084-221118',
        cleanPrimary: '084221118',
        secondaryPhone: '984-221118',
        cleanSecondary: '984221118',
        badge: '24 HORAS',
        iconClass: 'fas fa-shield-alt',
        iconType: 'icon-serenazgo',
        category: 'seguridad'
    },
    {
        id: 'policia',
        name: 'Policía Nacional del Perú',
        desc: 'Comisaría de Cusco y Central 105. Denuncias, delitos y orden público.',
        primaryPhone: '105',
        cleanPrimary: '105',
        secondaryPhone: '084-246088',
        cleanSecondary: '084246088',
        badge: 'URGENCIAS',
        iconClass: 'fas fa-user-shield',
        iconType: 'icon-policia',
        category: 'seguridad'
    },
    {
        id: 'bomberos',
        name: 'Compañía de Bomberos Cusco N° 39',
        desc: 'Atención de incendios, rescates vehiculares, fugas y desastres naturales.',
        primaryPhone: '116',
        cleanPrimary: '116',
        secondaryPhone: '084-224444',
        cleanSecondary: '084224444',
        badge: 'GRATUITO 24H',
        iconClass: 'fas fa-fire-extinguisher',
        iconType: 'icon-bomberos',
        category: 'rescate'
    },
    {
        id: 'samu',
        name: 'SAMU Cusco (Urgencias Médicas)',
        desc: 'Sistema de Atención Médica de Urgencia con ambulancias y paramédicos.',
        primaryPhone: '106',
        cleanPrimary: '106',
        secondaryPhone: '084-222384',
        cleanSecondary: '084222384',
        badge: 'MÉDICO 24H',
        iconClass: 'fas fa-ambulance',
        iconType: 'icon-samu',
        category: 'salud'
    },
    {
        id: 'sedacusco',
        name: 'EPS SedaCusco (Agua y Desagüe)',
        desc: 'Reporte de aniegos, roturas de tuberías matrices y buzones de desagüe sin tapa.',
        primaryPhone: '084-244444',
        cleanPrimary: '084244444',
        secondaryPhone: '984-100200',
        cleanSecondary: '984100200',
        badge: 'AGUA / DESAGÜE',
        iconClass: 'fas fa-tint',
        iconType: 'icon-sedacusco',
        category: 'servicios'
    },
    {
        id: 'electrosur',
        name: 'Electro Sur Este (Fonoluz)',
        desc: 'Emergencias de energía eléctrica, cortes de luz y postes de alumbrado averiados.',
        primaryPhone: '0800-00100',
        cleanPrimary: '080000100',
        secondaryPhone: '084-244444',
        cleanSecondary: '084244444',
        badge: 'ALUMBRADO / LUZ',
        iconClass: 'fas fa-bolt',
        iconType: 'icon-electrosur',
        category: 'servicios'
    },
    {
        id: 'muni',
        name: 'Municipalidad Provincial del Cusco',
        desc: 'Mesa de partes, denuncias ambientales y gerencias de desarrollo urbano.',
        primaryPhone: '084-240006',
        cleanPrimary: '084240006',
        secondaryPhone: '084-226701',
        cleanSecondary: '084226701',
        badge: 'INSTITUCIONAL',
        iconClass: 'fas fa-landmark',
        iconType: 'icon-muni',
        category: 'gobierno'
    },
    {
        id: 'hospital',
        name: 'Hospital Regional del Cusco',
        desc: 'Área de emergencias generales, traumatología y hospitalización.',
        primaryPhone: '084-227661',
        cleanPrimary: '084227661',
        secondaryPhone: '084-227664',
        cleanSecondary: '084227664',
        badge: 'HOSPITALARIO',
        iconClass: 'fas fa-hospital',
        iconType: 'icon-salud',
        category: 'salud'
    }
];

const EmergencyDirectory = () => {
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState('');

    const handleCopyNumber = (phone, entityName) => {
        navigator.clipboard.writeText(phone);
        toast.success(`¡Número de ${entityName} (${phone}) copiado al portapapeles!`);
    };

    const filteredContacts = EMERGENCY_CONTACTS.filter(contact => {
        const query = searchQuery.toLowerCase().trim();
        return (
            contact.name.toLowerCase().includes(query) ||
            contact.desc.toLowerCase().includes(query) ||
            contact.primaryPhone.includes(query) ||
            contact.badge.toLowerCase().includes(query)
        );
    });

    return (
        <section className="emergency-directory-container">
            <div className="directory-header">
                <div className="directory-header-title">
                    <div className="directory-icon-banner">
                        <i className="fas fa-phone-volume"></i>
                    </div>
                    <div className="directory-header-text">
                        <h3>Directorio Telefónico y Centrales de Emergencia</h3>
                        <p>Números oficiales de auxilio rápido y atención de servicios esenciales en la provincia del Cusco.</p>
                    </div>
                </div>

                <div className="directory-search-box">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Buscar por institución o servicio (ej: agua, luz, policía)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="directory-grid">
                {filteredContacts.map(contact => (
                    <div key={contact.id} className="directory-card">
                        <div>
                            <div className="directory-card-top">
                                <div className={`directory-card-icon ${contact.iconType}`}>
                                    <i className={contact.iconClass}></i>
                                </div>
                                <div className="directory-card-details">
                                    <h4 className="directory-card-name">{contact.name}</h4>
                                    <p className="directory-card-desc">{contact.desc}</p>
                                </div>
                                <span className="directory-card-badge">{contact.badge}</span>
                            </div>

                            <div className="directory-numbers-box">
                                <div className="phone-item">
                                    <span className="phone-label">Principal / Gratuito:</span>
                                    <span className="phone-value">{contact.primaryPhone}</span>
                                </div>
                                {contact.secondaryPhone && (
                                    <div className="phone-item">
                                        <span className="phone-label">Directo / Central:</span>
                                        <span className="phone-value">{contact.secondaryPhone}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="directory-card-actions">
                            <a
                                href={`tel:${contact.cleanPrimary}`}
                                className="call-btn"
                                title={`Llamar a ${contact.name}`}
                            >
                                <i className="fas fa-phone-alt"></i>
                                <span>Llamar {contact.primaryPhone}</span>
                            </a>

                            <button
                                type="button"
                                className="copy-phone-btn"
                                onClick={() => handleCopyNumber(contact.primaryPhone, contact.name)}
                                title="Copiar número de teléfono"
                            >
                                <i className="far fa-copy"></i>
                                <span>Copiar</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default EmergencyDirectory;
