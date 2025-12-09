interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: '#1a1a1a',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '400px',
        width: '90%',
        border: '1px solid rgba(255,255,255,0.1)',
        animation: 'slideUp 0.3s ease'
      }}>
        <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '15px', fontWeight: '600' }}>
          {title}
        </h3>
        <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '25px', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Zrušit
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 20px',
              background: '#e50914',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Potvrdit
          </button>
        </div>
      </div>
    </div>
  );
}
