-- =============================================
-- SCRIPT DE INICIALIZACIÓN
-- santiago_reporta Database
-- =============================================

-- Ejecutar el schema principal
SOURCE schema.sql;

-- Mensaje de confirmación
SELECT '✅ Base de datos santiago_reporta creada exitosamente' AS Status;
SELECT '📊 Tablas creadas: users, reports, report_updates' AS Info;
SELECT '👁️ Vistas creadas: report_statistics, reports_with_citizen' AS Info;

-- Verificar tablas creadas
SHOW TABLES;

-- Mostrar estructura de tabla users
DESCRIBE users;

-- Mostrar estructura de tabla reports
DESCRIBE reports; 
