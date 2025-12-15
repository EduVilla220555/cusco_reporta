import { useEffect } from 'react';
import './Alert.css';

const Alert = ({ type = 'info', message, onClose, duration = 4000 }) => {
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    return (
        <div className={`alert alert-${type}`}>
            <i className={`fas ${icons[type]}`}></i>
            <span>{message}</span>
            {onClose && (
                <button className="alert-close" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
            )}
        </div>
    );
};

export default Alert; 
