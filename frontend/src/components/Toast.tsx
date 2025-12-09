import { useEffect } from 'react';

interface Props {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: '#10b981',
    error: '#e50914',
    info: '#3b82f6'
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: colors[type],
      color: '#fff',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      zIndex: 1001,
      animation: 'slideInRight 0.3s ease',
      minWidth: '250px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <span style={{ fontSize: '14px', fontWeight: '500' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '0',
          marginLeft: 'auto'
        }}
      >
        ×
      </button>
    </div>
  );
}
