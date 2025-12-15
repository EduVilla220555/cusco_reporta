import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import Button from '../common/Button';
import './AuthForm.css';

const LoginForm = ({ onToggleForm, onSuccess }) => {
    const { login } = useAuth();
    const toast = useToast();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'citizen'
    });
    const [loading, setLoading] = useState(false);

    const userTypes = [
        { value: 'citizen', label: 'Ciudadano', icon: 'user' },
        { value: 'authority', label: 'Autoridad', icon: 'shield-alt' },
        { value: 'admin', label: 'Administrador', icon: 'users-cog' }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await login(formData);
            
            if (response.success) {
                toast.success(`¡Bienvenido, ${response.user.name}!`);
                setTimeout(() => {
                    onSuccess && onSuccess(response.user.role);
                }, 500);
            }
        } catch (error) {
            toast.error(error.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h2>Acceso al Sistema</h2>

            <form onSubmit={handleSubmit}>
                <div className="user-type-selector">
                    {userTypes.map(type => (
                        <div
                            key={type.value}
                            className={`user-type-card ${formData.userType === type.value ? 'selected' : ''}`}
                            onClick={() => setFormData({ ...formData, userType: type.value })}
                        >
                            <i className={`fas fa-${type.icon}`}></i>
                            <div>{type.label}</div>
                        </div>
                    ))}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu.email@ejemplo.com"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />
                </div>

                <Button 
                    type="submit" 
                    variant="primary" 
                    icon="sign-in-alt"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
            </form>

            <p className="auth-toggle">
                ¿No tienes cuenta?{' '}
                <span onClick={onToggleForm}>Regístrate</span>
            </p>
        </div>
    );
};

export default LoginForm;