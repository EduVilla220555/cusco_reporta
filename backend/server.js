// Importar dependencias
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors({
    origin: (origin, callback) => {
        // Permitir solicitudes sin origin (como apps móviles, Postman o llamadas locales)
        if (!origin) return callback(null, true);
        
        // Permitir cualquier puerto en localhost, 127.0.0.1 o CLIENT_URL configurado
        const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
        if (isLocalhost || origin === process.env.CLIENT_URL || process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }
        
        callback(new Error('Bloqueado por CORS'));
    },
    credentials: true
}));

// Aumentar límites para payloads grandes (base64) — solo temporal
app.use(express.json({ limit: '12mb' }));        // sube el límite según necesites
app.use(express.urlencoded({ limit: '12mb', extended: true }));

// Middleware para logging (desarrollo)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'API Santiago Reporta funcionando correctamente',
        version: '1.0.0',
        status: 'active',
        timestamp: new Date().toISOString()
    });
});

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Servir archivos subidos (fotos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware de manejo de rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores (debe estar al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🚀 Servidor Backend Iniciado       ║
║   📡 Puerto: ${PORT}                    ║
║   🌐 URL: http://localhost:${PORT}     ║
║   🔧 Modo: ${process.env.NODE_ENV || 'development'}              ║
║   📅 ${new Date().toLocaleString()}    ║
╚═══════════════════════════════════════╝
    `);
    
    // Probar conexión a la base de datos
    await testConnection();
    
    console.log('\n📌 Rutas API disponibles:');
    console.log('   Auth:    /api/auth/*');
    console.log('   Reports: /api/reports/*');
    console.log('   Users:   /api/users/*');
    console.log('\n✅ Servidor listo para recibir peticiones\n');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
    console.error('❌ Error no manejado:', err);
    // En producción, aquí podrías cerrar el servidor
});

process.on('uncaughtException', (err) => {
    console.error('❌ Excepción no capturada:', err);
    process.exit(1);
});