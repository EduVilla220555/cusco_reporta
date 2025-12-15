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
            setAlert({ type: 'success', message: `Rol actualizado a ${newRole}` });
            loadUsers();
        } catch (error) {
            setAlert({ type: 'error', message: error.message || 'Error al actualizar rol' });
        }
    };

    const getRoleBadge = (role) => {
        const roleMap = {
            admin: { label: 'Administrador', class: 'role-admin' },
            authority: { label: 'Autoridad', class: 'role-authority' },
            citizen: { label: 'Ciudadano', class: 'role-citizen' }
        };

        const roleData = roleMap[role] || roleMap.citizen;

        return <span className={`role-badge ${roleData.class}`}>{roleData.label}</span>;
    };

    if (loading) {
        return (
            <Card title="Gestión de Usuarios y Roles" icon="user-shield">
                <p className="loading-text">Cargando usuarios...</p>
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

            <p className="user-management-description">
                Aquí puedes asignar roles de Autoridad a los usuarios registrados.
            </p>

            <div className="user-list">
                {users.map(user => (
                    <div key={user.id} className="user-item">
                        <div className="user-info">
                            <div className="user-name">{user.name}</div>
                            <div className="user-email">{user.email}</div>
                        </div>
                        
                        <div className="user-actions">
                            {getRoleBadge(user.role)}
                            
                            {user.role !== 'admin' && (
                                <Button
                                    variant={user.role === 'citizen' ? 'primary' : 'danger'}
                                    size="small"
                                    icon={user.role === 'citizen' ? 'arrow-up' : 'arrow-down'}
                                    onClick={() => handleToggleRole(user.id, user.role)}
                                >
                                    {user.role === 'citizen' ? 'Asignar Autoridad' : 'Revocar Autoridad'}
                                </Button>
                            )}

                            {user.role === 'admin' && (
                                <span className="admin-lock">
                                    <i className="fas fa-lock"></i> No Editable
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default UserManagement; 
