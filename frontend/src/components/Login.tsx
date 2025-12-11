import { useState } from 'react';
import { authApi } from '../services/api';

interface Props {
  onLogin: (token: string) => void;
  onSwitchToRegister: () => void;
}

export default function Login({ onLogin, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', data.role || 'USER');
      localStorage.setItem('userId', data.userId);
      onLogin(data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Neplatné přihlašovací údaje');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill-opacity=\'0.03\'%3E%3Cpolygon fill=\'%23000\' points=\'50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40\'/%3E%3C/g%3E%3C/svg%3E")',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.75)',
        borderRadius: '4px',
        padding: '60px 68px 40px',
        width: '100%',
        maxWidth: '450px',
        minHeight: '660px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            color: '#e50914',
            fontSize: '36px',
            fontWeight: '900',
            letterSpacing: '2px',
            marginBottom: '8px'
          }}>CINEHUB</h1>
          <p style={{ color: '#999', fontSize: '16px', margin: 0 }}>Váš filmový svět</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="email"
              placeholder="Email nebo telefonní číslo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                width: '100%',
                height: '50px',
                padding: '16px 20px 0',
                background: '#333',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'background-color 0.15s ease'
              }}
              onFocus={(e) => e.target.style.background = '#454545'}
              onBlur={(e) => e.target.style.background = '#333'}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <input
              type="password"
              placeholder="Heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: '100%',
                height: '50px',
                padding: '16px 20px 0',
                background: '#333',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'background-color 0.15s ease'
              }}
              onFocus={(e) => e.target.style.background = '#454545'}
              onBlur={(e) => e.target.style.background = '#333'}
            />
          </div>
          
          {error && <div style={{ 
            color: '#e87c03', 
            fontSize: '13px', 
            marginBottom: '16px',
            padding: '6px 3px'
          }}>{error}</div>}
          
          <button 
            type="submit" 
            style={{ 
              width: '100%',
              height: '48px',
              background: 'linear-gradient(45deg, #e50914, #f40612)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '24px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px 0 rgba(229, 9, 20, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px 0 rgba(229, 9, 20, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px 0 rgba(229, 9, 20, 0.3)';
            }}
          >
            Přihlásit se
          </button>
        </form>
        
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <span style={{ color: '#737373', fontSize: '16px' }}>
            Jste na MovieDB noví?{' '}
            <button 
              onClick={onSwitchToRegister} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#fff', 
                cursor: 'pointer',
                fontSize: '16px',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
              Zaregistrujte se
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}