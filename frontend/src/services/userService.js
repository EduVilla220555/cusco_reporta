import api from './api';

const userService = {
    // Obtener todos los usuarios
    getAllUsers: async () => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener usuarios' };
        }
    },

    // Obtener usuario por ID
    getUserById: async (id) => {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener usuario' };
        }
    },

    // Actualizar rol de usuario
    updateUserRole: async (id, role) => {
        try {
            const response = await api.put(`/users/${id}/role`, { role });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar rol' };
        }
    },

    // Obtener usuarios por rol
    getUsersByRole: async (role) => {
        try {
            const response = await api.get(`/users/role/${role}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener usuarios por rol' };
        }
    },

    // Obtener estadísticas de usuarios
    getUserStats: async () => {
        try {
            const response = await api.get('/users/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener estadísticas' };
        }
    }
};

export default userService; 
