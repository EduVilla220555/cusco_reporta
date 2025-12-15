// Script para probar la conexión a la base de datos y los modelos
require('dotenv').config();
const { testConnection } = require('../config/database');
const User = require('../models/User');
const Report = require('../models/Report');

async function testDatabase() {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   🧪 PRUEBA DE BASE DE DATOS          ║');
    console.log('╚════════════════════════════════════════╝\n');

    try {
        // 1. Probar conexión
        console.log('1️⃣  Probando conexión a MySQL...');
        const connected = await testConnection();
        if (!connected) {
            throw new Error('No se pudo conectar a la base de datos');
        }
        console.log('✅ Conexión exitosa\n');

        // 2. Probar modelo User
        console.log('2️⃣  Probando modelo User...');
        const users = await User.getAll();
        console.log(`✅ Usuarios encontrados: ${users.length}`);
        
        if (users.length > 0) {
            console.log('\n📋 Usuarios en la base de datos:');
            users.forEach(user => {
                console.log(`   - ${user.name} (${user.email}) - Rol: ${user.role}`);
            });
        }

        // Contar usuarios por rol
        const roleCount = await User.countByRole();
        console.log('\n📊 Usuarios por rol:');
        roleCount.forEach(item => {
            console.log(`   - ${item.role}: ${item.total}`);
        });

        // 3. Probar modelo Report
        console.log('\n3️⃣  Probando modelo Report...');
        const reports = await Report.getAll();
        console.log(`✅ Reportes encontrados: ${reports.length}`);

        if (reports.length > 0) {
            console.log('\n📋 Reportes en la base de datos:');
            reports.slice(0, 5).forEach(report => {
                console.log(`   - ${report.code}: ${report.title} [${report.status}]`);
            });
        }

        // Estadísticas de reportes
        const stats = await Report.getStatistics();
        console.log('\n📊 Reportes por estado:');
        stats.forEach(stat => {
            console.log(`   - ${stat.status}: ${stat.total}`);
        });

        // 4. Probar búsqueda
        console.log('\n4️⃣  Probando búsqueda...');
        const searchResults = await Report.search('hueco');
        console.log(`✅ Resultados de búsqueda "hueco": ${searchResults.length}`);

        // 5. Probar obtener reporte específico
        console.log('\n5️⃣  Probando obtener reporte por código...');
        const report = await Report.getByCode('RPT-001');
        if (report) {
            console.log(`✅ Reporte encontrado: ${report.title}`);
            console.log(`   Ciudadano: ${report.citizen_name}`);
            console.log(`   Estado: ${report.status}`);
        }

        console.log('\n╔════════════════════════════════════════╗');
        console.log('║   ✅ TODAS LAS PRUEBAS PASARON         ║');
        console.log('╚════════════════════════════════════════╝\n');

    } catch (error) {
        console.error('\n❌ Error durante las pruebas:');
        console.error(error.message);
        console.error('\n💡 Posibles soluciones:');
        console.error('   - Verifica que MySQL esté corriendo');
        console.error('   - Verifica las credenciales en .env');
        console.error('   - Ejecuta los scripts SQL (schema.sql y seed.sql)');
        console.error('   - Revisa que la base de datos santiago_reporta existe\n');
    }

    process.exit(0);
}

// Ejecutar pruebas
testDatabase();