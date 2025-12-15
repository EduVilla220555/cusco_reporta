import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext';
import { ToastProvider } from './components/common/Toast';
import Navbar from './components/common/Navbar';
import LoadingSpinner from './components/common/LoadingSpinner';
import HomePage from './pages/HomePage';
import CitizenPage from './pages/CitizenPage';
import AuthorityPage from './pages/AuthorityPage';
import AdminPage from './pages/AdminPage';
import ReportsPage from './pages/ReportsPage';
import './styles/App.css';

function AppContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLoginSuccess = (userRole) => {
    // Redirigir según el rol
    if (userRole === 'admin') {
      setActiveTab('admin');
    } else if (userRole === 'authority') {
      setActiveTab('authority');
    } else {
      setActiveTab('citizen');
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <LoadingSpinner size="large" text="Cargando aplicación..." />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="main-header">
        <div className="logo-container">
          <img 
            src="https://placehold.co/100x100/113f2b/7cc551?text=UNSAAC" 
            alt="Logo UNSAAC" 
            className="logo"
          />
          <div className="header-text">
            <h1>Cusco Reporta</h1>
            <p>Plataforma de Reportes de Incidencias Urbanas</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {isAuthenticated && (
            <Navbar 
              activeTab={activeTab} 
              onTabChange={handleTabChange}
            />
          )}

          {/* Renderizar contenido según la pestaña activa */}
          {activeTab === 'home' && (
            <HomePage onLoginSuccess={handleLoginSuccess} />
          )}

          {activeTab === 'citizen' && isAuthenticated && user?.role === 'citizen' && (
            <CitizenPage />
          )}

          {activeTab === 'authority' && isAuthenticated && (user?.role === 'authority' || user?.role === 'admin') && (
            <AuthorityPage />
          )}

          {activeTab === 'admin' && isAuthenticated && user?.role === 'admin' && (
            <AdminPage />
          )}

          {activeTab === 'reports' && (
            <ReportsPage />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <p>© 2025 Cusco Reporta - UNSAAC | Desarrollo de Software I</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ReportProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ReportProvider>
    </AuthProvider>
  );
}

export default App;