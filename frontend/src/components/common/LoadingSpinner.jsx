import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = 'Cargando...' }) => {
    return (
        <div className="loading-spinner-container">
            <div className={`loading-spinner loading-spinner-${size}`}>
                <i className="fas fa-spinner fa-spin"></i>
            </div>
            {text && <p className="loading-text">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;