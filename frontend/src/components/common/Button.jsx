import './Button.css';

const Button = ({ 
    children, 
    variant = 'primary', 
    icon, 
    onClick, 
    type = 'button',
    disabled = false,
    fullWidth = false,
    size = 'medium'
}) => {
    const className = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''}`;

    return (
        <button 
            type={type}
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <i className={`fas fa-${icon}`}></i>}
            <span>{children}</span>
        </button>
    );
};

export default Button; 
