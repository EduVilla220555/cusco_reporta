-- =============================================
-- DATOS DE PRUEBA (SEED)
-- santiago_reporta Database
-- CONTRASEÑAS EN TEXTO PLANO (SOLO DESARROLLO)
-- =============================================

USE santiago_reporta;

-- Limpiar datos existentes (solo para desarrollo)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE report_updates;
TRUNCATE TABLE reports;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- INSERTAR USUARIOS DE PRUEBA
-- =============================================
-- NOTA: Contraseñas en texto plano para facilitar pruebas
-- El backend las comparará con bcrypt, así que necesitamos que sean texto plano aquí

INSERT INTO users (name, email, password, role) VALUES
-- Administrador (password: admin123)
('Admin Principal', 'admin@santiago.pe', 'admin123', 'admin'),

-- Autoridades (password: 1234)
('María González', 'maria.gonzalez@email.com', '1234', 'authority'),
('Carlos Mendoza', 'carlos.mendoza@email.com', '1234', 'authority'),

-- Ciudadanos (password: 1234)
('Juan Pérez', 'juan.perez@email.com', '1234', 'citizen'),
('Ana López', 'ana.lopez@email.com', '1234', 'citizen'),
('Pedro Ramírez', 'pedro.ramirez@email.com', '1234', 'citizen');

-- =============================================
-- INSERTAR REPORTES DE PRUEBA
-- =============================================

INSERT INTO reports (code, title, description, type, priority, status, citizen_id, latitude, longitude) VALUES
-- Reportes Pendientes
('RPT-001', 'Hueco grande en Av. El Sol', 'Hueco profundo que causa accidentes en la Av. El Sol altura del Qoricancha', 'vias', 'alta', 'pending', 4, -13.5170, -71.9785),
('RPT-002', 'Falta de señalización en cruce', 'El cruce de Av. La Cultura no tiene señales de tránsito', 'vias', 'media', 'pending', 5, -13.5226, -71.9673),
('RPT-003', 'Luminaria malograda', 'Poste de luz sin funcionar en Jr. Triunfo', 'alumbrado', 'alta', 'pending', 6, -13.5164, -71.9789),

-- Reportes En Proceso
('RPT-004', 'Acumulación de basura', 'Basura acumulada por varios días en Av. Los Incas', 'basura', 'alta', 'progress', 4, -13.5198, -71.9509),
('RPT-005', 'Semáforo malogrado', 'Semáforo no funciona en Av. Pachacutec', 'otros', 'media', 'progress', 5, -13.5292, -71.9675),

-- Reportes Resueltos
('RPT-006', 'Bache en calle', 'Bache reparado en calle Plateros', 'vias', 'media', 'resolved', 6, -13.5163, -71.9789),
('RPT-007', 'Contenedor de basura roto', 'Contenedor fue reemplazado', 'basura', 'baja', 'resolved', 4, -13.5180, -71.9700);

-- =============================================
-- INSERTAR ACTUALIZACIONES DE REPORTES
-- =============================================

INSERT INTO report_updates (report_id, user_id, previous_status, new_status, comment) VALUES
-- Actualizaciones del reporte RPT-004
(4, 2, 'pending', 'progress', 'Equipo de limpieza enviado al lugar'),

-- Actualizaciones del reporte RPT-005
(5, 3, 'pending', 'progress', 'Técnicos evaluando el semáforo'),

-- Actualizaciones del reporte RPT-006
(6, 2, 'pending', 'progress', 'Reparación iniciada'),
(6, 2, 'progress', 'resolved', 'Bache reparado completamente'),

-- Actualizaciones del reporte RPT-007
(7, 3, 'pending', 'resolved', 'Contenedor nuevo instalado');

-- =============================================
-- VERIFICACIÓN DE DATOS
-- =============================================

SELECT '✅ Datos de prueba insertados correctamente' AS Status;
SELECT '' AS `Separator`;
SELECT '🔑 CREDENCIALES DE PRUEBA:' AS Info;
SELECT '   👤 Administrador: admin@santiago.pe / admin123' AS Credentials;
SELECT '   👮 Autoridades: maria.gonzalez@email.com / 1234' AS Credentials;
SELECT '   👮 Autoridades: carlos.mendoza@email.com / 1234' AS Credentials;
SELECT '   🧑 Ciudadanos: juan.perez@email.com / 1234' AS Credentials;
SELECT '   🧑 Ciudadanos: ana.lopez@email.com / 1234' AS Credentials;
SELECT '   🧑 Ciudadanos: pedro.ramirez@email.com / 1234' AS Credentials;
SELECT '' AS `Separator`;

-- Mostrar resumen de usuarios
SELECT
    '📊 RESUMEN DE USUARIOS' AS `=== RESUMEN ===`,
    role AS Rol,
    COUNT(*) AS Total
FROM users
GROUP BY role;

SELECT '' AS `Separator`;

-- Mostrar resumen de reportes
SELECT
    '📊 RESUMEN DE REPORTES' AS `=== RESUMEN ===`,
    status AS Estado,
    COUNT(*) AS Total
FROM reports
GROUP BY status;