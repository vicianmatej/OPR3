import { useState } from 'react';
import { authApi } from '../services/api';

interface Props {
  onRegister: (token: string) => void;
  onSwitchToLogin: () => void;
}

export default function Register({ onRegister, onSwitchToLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await authApi.register({ email, password });
      alert('Registrace úspěšná! Nyní se přihlašte.');
      onSwitchToLogin();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Chyba při registraci');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          color: '#333',
          fontSize: '28px',
          fontWeight: '600'
        }}>Registrace</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              width: '100%',
              padding: '15px 20px',
              margin: '10px 0',
              border: '2px solid #e1e5e9',
              borderRadius: '12px',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <input
            type="password"
            placeholder="Heslo (min. 6 znaků)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ 
              width: '100%',
              padding: '15px 20px',
              margin: '10px 0',
              border: '2px solid #e1e5e9',
              borderRadius: '12px',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {error && <p style={{ color: '#e74c3c', textAlign: 'center', margin: '15px 0' }}>{error}</p>}
          <button type="submit" style={{ 
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            marginTop: '20px'
          }}>Registrovat</button>
        </form>
        <p style={{ marginTop: '25px', textAlign: 'center', color: '#666' }}>
          Už máte účet?{' '}
          <button onClick={onSwitchToLogin} style={{ 
            background: 'none', 
            border: 'none', 
            color: '#667eea', 
            cursor: 'pointer', 
            textDecoration: 'underline',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            Přihlásit se
          </button>
        </p>
      </div>
    </div>
  );
}