import Button from './Button';
import './ConfirmDialog.css';

const ConfirmDialog = ({ 
    isOpen, 
    title, 
    message, 
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm, 
    onCancel,
    type = 'warning' // 'warning', 'danger', 'info'
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div className="confirm-dialog-backdrop" onClick={handleBackdropClick}>
            <div className="confirm-dialog">
                <div className={`confirm-dialog-header confirm-dialog-${type}`}>
                    <i className={`fas ${
                        type === 'danger' ? 'fa-exclamation-triangle' :
                        type === 'info' ? 'fa-info-circle' :
                        'fa-question-circle'
                    }`}></i>
                    <h3>{title}</h3>
                </div>
                
                <div className="confirm-dialog-body">
                    <p>{message}</p>
                </div>
                
                <div className="confirm-dialog-footer">
                    <Button 
                        variant="secondary" 
                        onClick={onCancel}
                    >
                        {cancelText}
                    </Button>
                    <Button 
                        variant={type === 'danger' ? 'danger' : 'primary'}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;