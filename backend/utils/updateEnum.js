const { pool } = require('../config/database');

async function updateEnum() {
    try {
        await pool.query(`ALTER TABLE reports MODIFY COLUMN type ENUM('vias', 'alumbrado', 'basura', 'parques', 'agua', 'seguridad', 'otros') NOT NULL`);
        console.log('✅ ENUM modificado correctamente en la tabla reports.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error alterando ENUM:', error);
        process.exit(1);
    }
}

updateEnum();
