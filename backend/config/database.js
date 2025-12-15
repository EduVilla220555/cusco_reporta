const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la conexión a MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'santiago_reporta',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a MySQL exitosa');
        console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
        
        // Verificar que las tablas existen
        const [tables] = await connection.query('SHOW TABLES');
        console.log(`📋 Tablas disponibles: ${tables.length}`);
        
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con MySQL:', error.message);
        console.error('💡 Verifica:');
        console.error('   - MySQL está corriendo');
        console.error('   - Las credenciales en .env son correctas');
        console.error('   - La base de datos santiago_reporta existe');
        return false;
    }
};

// Función helper para ejecutar queries
const query = async (sql, params = []) => {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Error en query:', error.message);
        throw error;
    }
};

// Función helper para obtener un solo registro
const queryOne = async (sql, params = []) => {
    try {
        const [results] = await pool.execute(sql, params);
        return results[0] || null;
    } catch (error) {
        console.error('Error en queryOne:', error.message);
        throw error;
    }
};

// Probar conexión al iniciar
// Si se ejecuta este archivo directamente, probar la conexión (no se ejecuta cuando se importa)
if (require.main === module) {
    testConnection();
}

module.exports = {
    pool,
    query,
    queryOne,
    testConnection
};