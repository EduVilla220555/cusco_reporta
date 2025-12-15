const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
require('dotenv').config();

async function hashAllPasswords() {
    console.log('\n🔐 Iniciando hasheo de contraseñas...\n');

    try {
        // Obtener todos los usuarios
        const users = await query('SELECT id, email, password FROM users');

        console.log(`👥 Usuarios encontrados: ${users.length}\n`);

        for (const user of users) {
            // Verificar si la contraseña ya está hasheada
            const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');

            if (!isHashed) {
                console.log(`🔄 Hasheando contraseña para: ${user.email}`);
                
                // Hashear la contraseña
                const hashedPassword = await bcrypt.hash(user.password, 10);
                
                // Actualizar en la base de datos
                await query(
                    'UPDATE users SET password = ? WHERE id = ?',
                    [hashedPassword, user.id]
                );

                console.log(`   ✅ Contraseña actualizada`);
            } else {
                console.log(`⏭️  ${user.email} - Ya tiene contraseña hasheada`);
            }
        }

        console.log('\n✅ Todas las contraseñas han sido hasheadas correctamente\n');
        console.log('📋 Credenciales para probar:');
        console.log('   Admin: admin@santiago.pe / admin123');
        console.log('   Autoridad: maria.gonzalez@email.com / 1234');
        console.log('   Ciudadano: juan.perez@email.com / 1234\n');

    } catch (error) {
        console.error('❌ Error al hashear contraseñas:', error.message);
    }

    process.exit(0);
}

hashAllPasswords();