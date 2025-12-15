const { query, queryOne } = require('../config/database');

class User {
    // Obtener todos los usuarios
    static async getAll() {
        const sql = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
        return await query(sql);
    }

    // Obtener usuario por ID
    static async getById(id) {
        const sql = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
        return await queryOne(sql, [id]);
    }

    // Obtener usuario por email
    static async getByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        return await queryOne(sql, [email]);
    }

    // Crear nuevo usuario
    static async create(userData) {
        const { name, email, password, role = 'citizen' } = userData;
        const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        const result = await query(sql, [name, email, password, role]);
        return result.insertId;
    }

    // Actualizar rol de usuario
    static async updateRole(id, newRole) {
        const sql = 'UPDATE users SET role = ? WHERE id = ?';
        const result = await query(sql, [newRole, id]);
        return result.affectedRows > 0;
    }

    // Eliminar usuario
    static async delete(id) {
        const sql = 'DELETE FROM users WHERE id = ?';
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    }

    // Obtener usuarios por rol
    static async getByRole(role) {
        const sql = 'SELECT id, name, email, role, created_at FROM users WHERE role = ? ORDER BY name';
        return await query(sql, [role]);
    }

    // Contar usuarios por rol
    static async countByRole() {
        const sql = `
            SELECT role, COUNT(*) as total 
            FROM users 
            GROUP BY role
        `;
        return await query(sql);
    }

    // Verificar si el email ya existe
    static async emailExists(email) {
        const sql = 'SELECT id FROM users WHERE email = ?';
        const user = await queryOne(sql, [email]);
        return user !== null;
    }
}

module.exports = User; 
