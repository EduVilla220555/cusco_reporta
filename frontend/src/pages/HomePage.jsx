import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import Card from '../components/common/Card';

const HomePage = ({ onLoginSuccess }) => {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <div>
            <Card>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        Bienvenido a Cusco Reporta
                    </h2>
                    
                </div>
            </Card>

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
        </div>
    );
};

export default HomePage; 
