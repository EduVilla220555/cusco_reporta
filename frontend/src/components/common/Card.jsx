import './Card.css';

const Card = ({ children, title, icon, className = '' }) => {
    return (
        <div className={`card ${className}`}>
            {title && (
                <div className="card-header">
                    {icon && <i className={`fas fa-${icon}`}></i>}
                    <h3>{title}</h3>
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};

export default Card; 
