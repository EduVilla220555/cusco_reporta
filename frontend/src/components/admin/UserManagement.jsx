import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import Card from '../common/Card';
import Button from '../common/Button';
import Alert from '../common/Alert';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await userService.getAllUsers();
            setUsers(response.users);
        } catch (error) {
            setAlert({ type: 'error', message: 'Error al cargar usuarios' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'authority' ? 'citizen' : 'authority';

        try {
            await userService.updateUserRole(userId, newRole);
            setAlert({ type: 'success', message: `Rol actualizado exitosamente` });
            loadUsers();
        } catch (error) {
            setAlert({ type: 'error', message: error.message || 'Error al actualizar rol' });
        }
    };

    const getRoleInfo = (role) => {
        const roleMap = {
            admin: { 
                label: 'Administrador', 
                icon: 'fa-shield-halved',
                class: 'role-admin',
                description: 'Acceso completo al sistema'
            },
            authority: { 
                label: 'Autoridad', 
                icon: 'fa-user-tie',
                class: 'role-authority',
                description: 'Gestiona reportes'
            },
            citizen: { 
                label: 'Ciudadano', 
                icon: 'fa-user',
                class: 'role-citizen',
                description: 'Crea reportes'
            }
        };

        return roleMap[role] || roleMap.citizen;
    };

    if (loading) {
        return (
            <Card title="Gestión de Usuarios y Roles" icon="user-shield">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Cargando usuarios...</p>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Gestión de Usuarios y Roles" icon="user-shield">
            {alert && (
                <Alert 
                    type={alert.type} 
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            <div className="um-header">
                <p className="um-description">
                    <i className="fas fa-info-circle"></i>
                    Administra los roles y permisos de los usuarios del sistema
                </p>
                <div className="um-stats">
                    <div className="stat-item">
                        <i className="fas fa-users"></i>
                        <span>{users.length} Usuarios</span>
                    </div>
                </div>
            </div>

            <div className="user-grid">
                {users.map(user => {
                    const roleInfo = getRoleInfo(user.role);
                    return (
                        <div key={user.id} className={`user-card ${roleInfo.class}`}>
                            <div className="user-card-header">
                                <div className="user-avatar">
                                    <i className={`fas ${roleInfo.icon}`}></i>
                                </div>
                                <div className="user-main-info">
                                    <h3 className="user-name">{user.name}</h3>
                                    <p className="user-email">
                                        <i className="fas fa-envelope"></i>
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="user-card-body">
                                <div className="role-section">
                                    <div className="role-badge-container">
                                        <span className={`role-badge ${roleInfo.class}`}>
                                            <i className={`fas ${roleInfo.icon}`}></i>
                                            {roleInfo.label}
                                        </span>
                                        <p className="role-description">{roleInfo.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="user-card-footer">
                                {user.role !== 'admin' ? (
                                    <Button
                                        variant={user.role === 'citizen' ? 'primary' : 'danger'}
                                        size="small"
                                        icon={user.role === 'citizen' ? 'user-plus' : 'user-minus'}
                                        onClick={() => handleToggleRole(user.id, user.role)}
                                    >
                                        {user.role === 'citizen' ? 'Asignar Autoridad' : 'Revocar Autoridad'}
                                    </Button>
                                ) : (
                                    <div className="admin-lock">
                                        <i className="fas fa-lock"></i>
                                        <span>Rol protegido</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default UserManagement; 
