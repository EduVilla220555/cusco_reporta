import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import Button from '../common/Button';
import './AuthForm.css';

const RegisterForm = ({ onToggleForm }) => {
    const { register } = useAuth();
    const toast = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (formData.password !== formData.confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const response = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            if (response.success) {
                toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
                setTimeout(() => {
                    onToggleForm();
                }, 1500);
            }
        } catch (error) {
            toast.error(error.message || 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h2>Crear Nueva Cuenta</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nombre Completo</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Juan Pérez"
                        required
                    />
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
                        placeholder="Mínimo 6 caracteres"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repite tu contraseña"
                        required
                    />
                </div>

                <Button 
                    type="submit" 
                    variant="primary" 
                    icon="user-plus"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Registrando...' : 'Registrarse'}
                </Button>
            </form>

            <p className="auth-toggle">
                ¿Ya tienes cuenta?{' '}
                <span onClick={onToggleForm}>Inicia Sesión</span>
            </p>
        </div>
    );
};

export default RegisterForm;