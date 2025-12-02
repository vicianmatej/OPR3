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
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h2>Registrace</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
        />
        <input
          type="password"
          placeholder="Heslo (min. 6 znaků)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ display: 'block', width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}>
          Registrovat
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Už máte účet?{' '}
        <button onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: '#646cff', cursor: 'pointer', textDecoration: 'underline' }}>
          Přihlásit se
        </button>
      </p>
    </div>
  );
}
