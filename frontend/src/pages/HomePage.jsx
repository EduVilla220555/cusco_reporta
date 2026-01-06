import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import Card from '../components/common/Card';
import './HomePage.css';

const HomePage = ({ onLoginSuccess }) => {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <div className="home-page">
            <div className="home-container">
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h1 className="welcome-title">Bienvenido a Cusco Reporta</h1>
                        <p className="welcome-subtitle">
                            Plataforma de Reportes de Incidencias Urbanas
                        </p>
                        
                        <div className="cusco-image-container">
                            <img 
                                src="/cusco.png" 
                                alt="Plaza de Armas del Cusco" 
                                className="cusco-image"
                            />
                        </div>

                        <div className="welcome-features">
                            <div className="feature-item">
                                <span className="feature-icon">📍</span>
                                <span>Reporta incidencias en tiempo real</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">👥</span>
                                <span>Colabora con tu comunidad</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Seguimiento de soluciones</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-section">
                    <Card>
                        <h2 className="auth-title">
                            {showLogin ? 'Acceso al Sistema' : 'Crear Cuenta'}
                        </h2>
                        {showLogin ? (
                            <LoginForm 
                                onToggleForm={() => setShowLogin(false)}
                                onSuccess={onLoginSuccess}
                            />
                        ) : (
                            <RegisterForm 
                                onToggleForm={() => setShowLogin(true)}
                            />
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HomePage; 
