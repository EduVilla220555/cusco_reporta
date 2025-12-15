import api from './api';

const authService = {
    // Registrar nuevo usuario
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al registrar usuario' };
        }
    },

    // Iniciar sesión
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            
            // Guardar token y usuario en localStorage
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al iniciar sesión' };
        }
    },

    // Cerrar sesión
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Verificar token
    verifyToken: async () => {
        try {
            const response = await api.get('/auth/verify');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Token inválido' };
        }
    },

    // Obtener usuario actual del localStorage
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Verificar si hay sesión activa
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default authService; 
