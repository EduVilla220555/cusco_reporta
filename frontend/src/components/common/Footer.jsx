import './Footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        {/* Sección de ubicación */}
        <div className="footer-section location-section">
          <div className="location-icon">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div className="location-text">
            <h3>Ubicación</h3>
            <p>Plaza Regocijo, Cusco, Perú</p>
          </div>
        </div>

        {/* Sección de redes sociales */}
        <div className="footer-section social-section">
          <h3>Síguenos en Redes Sociales</h3>
          <div className="social-links">
            <a 
              href="https://www.facebook.com/municipalidaddelcusco/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link facebook"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a 
              href="https://www.tiktok.com/@muni_cusco" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link tiktok"
              aria-label="TikTok"
            >
              <i className="fab fa-tiktok"></i>
            </a>
            <a 
              href="https://www.instagram.com/municipalidadelcusco/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link instagram"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a 
              href="https://www.youtube.com/@municipalidaddelcusco23-26" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link youtube"
              aria-label="YouTube"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Sección de copyright */}
        <div className="footer-section copyright-section">
          <div className="footer-logos">
            <img 
              src="/gob-pe-logo.png" 
              alt="Gobierno del Perú - Gob.pe" 
              className="footer-logo"
            />
          </div>
          <p className="copyright-text">
            © 2025 Cusco Reporta - UNSAAC | Desarrollo de Software I
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
