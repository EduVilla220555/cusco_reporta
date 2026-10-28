-- =============================================
-- SCHEMA: santiago_reporta
-- Base de Datos para Plataforma de Reportes Urbanos
-- =============================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS santiago_reporta 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE santiago_reporta;

-- =============================================
-- TABLA: users (Usuarios del sistema)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('citizen', 'authority', 'admin') DEFAULT 'citizen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLA: reports (Reportes de incidencias)
-- =============================================
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE COMMENT 'Código único del reporte (RPT-XXX)',
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type ENUM('vias', 'alumbrado', 'basura', 'parques', 'agua', 'seguridad', 'otros') NOT NULL,
    priority ENUM('baja', 'media', 'alta') DEFAULT 'media',
    status ENUM('pending', 'progress', 'resolved') DEFAULT 'pending',
    citizen_id INT NOT NULL COMMENT 'ID del ciudadano que reporta',
    latitude DECIMAL(10, 8) NULL COMMENT 'Latitud de geolocalización',
    longitude DECIMAL(11, 8) NULL COMMENT 'Longitud de geolocalización',
    photo_url VARCHAR(255) NULL COMMENT 'URL de la foto del reporte',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_citizen (citizen_id),
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLA: report_updates (Seguimiento de reportes)
-- =============================================
CREATE TABLE IF NOT EXISTS report_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    user_id INT NOT NULL COMMENT 'Usuario (autoridad) que actualiza',
    previous_status ENUM('pending', 'progress', 'resolved'),
    new_status ENUM('pending', 'progress', 'resolved'),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_report (report_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- VISTA: Estadísticas de reportes por estado
-- =============================================
CREATE OR REPLACE VIEW report_statistics AS
SELECT 
    status,
    COUNT(*) as total,
    type,
    priority
FROM reports
GROUP BY status, type, priority;

-- =============================================
-- VISTA: Reportes con información del ciudadano
-- =============================================
CREATE OR REPLACE VIEW reports_with_citizen AS
SELECT 
    r.id,
    r.code,
    r.title,
    r.description,
    r.type,
    r.priority,
    r.status,
    r.latitude,
    r.longitude,
    r.photo_url,
    r.created_at,
    r.updated_at,
    u.id as citizen_id,
    u.name as citizen_name,
    u.email as citizen_email
FROM reports r
INNER JOIN users u ON r.citizen_id = u.id; 
