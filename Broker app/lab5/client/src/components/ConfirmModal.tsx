import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  type = 'danger'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <FontAwesomeIcon 
            icon={faExclamationTriangle} 
            style={{ 
              fontSize: '48px', 
              color: type === 'danger' ? '#e53e3e' : type === 'warning' ? '#ed8936' : '#5a67d8',
              marginBottom: '16px'
            }} 
          />
          <h2 style={{ marginBottom: '12px', fontSize: '22px', color: '#2d3748' }}>{title}</h2>
          <p style={{ color: '#4a5568', fontSize: '15px', lineHeight: '1.6' }}>{message}</p>
        </div>
        
        <div className="modal-actions">
          <button 
            type="button" 
            className="button button-secondary" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            className={`button ${type === 'danger' ? 'button-danger' : 'button-primary'}`}
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

