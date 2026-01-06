import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ activeTab, onTabChange }) => {
    const { user, isAuthenticated, logout } = useAuth();

    const tabs = [
        { id: 'home', label: 'Inicio', icon: 'home', public: true },
        { id: 'citizen', label: 'Ciudadano', icon: 'user', roles: ['citizen'] },
        { id: 'authority', label: 'Autoridad', icon: 'shield-alt', roles: ['authority', 'admin'] },
        { id: 'admin', label: 'Admin', icon: 'cogs', roles: ['admin'] },
        { id: 'reports', label: 'Seguimiento', icon: 'list', public: true }
    ];

    const canAccessTab = (tab) => {
        if (tab.public) return true;
        if (!isAuthenticated) return false;
        if (!tab.roles) return true;
        return tab.roles.includes(user?.role);
    };

    const handleLogout = () => {
        logout();
        onTabChange('home');
    };

    return (
        <nav className="navbar">
            <div className="navbar-tabs">
                {tabs.map(tab => (
                    canAccessTab(tab) && (
                        <button
                            key={tab.id}
                            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => onTabChange(tab.id)}
                        >
                            <i className={`fas fa-${tab.icon}`}></i>
                            <span>{tab.label}</span>
                        </button>
                    )
                ))}
            </div>
            
            {isAuthenticated && (
                <div className="navbar-user">
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                    </div>
                    <button className="btn-logout" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Salir</span>
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 
