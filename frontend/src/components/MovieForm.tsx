import { useState } from 'react';
import { movieApi } from '../services/api';

interface MovieCreate {
  title: string;
  description?: string;
  releaseYear?: number;
  genre?: string;
  director?: string;
  posterUrl?: string;
}

interface Props {
  onSuccess: () => void;
}

export default function MovieForm({ onSuccess }: Props) {
  const [form, setForm] = useState<MovieCreate>({
    title: '',
    description: '',
    releaseYear: undefined,
    genre: '',
    director: '',
    posterUrl: '',
  });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await movieApi.create(form);
      setForm({ title: '', description: '', releaseYear: undefined, genre: '', director: '', posterUrl: '' });
      setShowForm(false);
      onSuccess();
    } catch (error) {
      console.error('Chyba při vytváření filmu:', error);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{ padding: '60px 4%', textAlign: 'center' }}>
      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          style={{ 
            padding: '16px 32px',
            background: 'linear-gradient(45deg, #e50914, #f40612)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px 0 rgba(229, 9, 20, 0.4)',
            letterSpacing: '0.5px'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 8px 25px 0 rgba(229, 9, 20, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px 0 rgba(229, 9, 20, 0.4)';
          }}
        >
          + Přidat nový film
        </button>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '700px',
          margin: '0 auto',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <style>{`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          
          <h2 style={{ 
            color: '#fff', 
            marginBottom: '30px',
            fontSize: '28px',
            fontWeight: '700',
            textAlign: 'left'
          }}>Přidat nový film</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Název filmu *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e50914';
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <input
                type="number"
                placeholder="Rok vydání"
                value={form.releaseYear || ''}
                onChange={(e) => setForm({ ...form, releaseYear: e.target.value ? Number(e.target.value) : undefined })}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e50914';
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
              
              <input
                type="text"
                placeholder="Žánr"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e50914';
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Režisér"
                value={form.director}
                onChange={(e) => setForm({ ...form, director: e.target.value })}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e50914';
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="URL posteru"
                value={form.posterUrl}
                onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e50914';
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <textarea
                placeholder="Popis filmu"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                style={{
                  ...inputStyle,
                  resize: 'vertical' as const,
                  minHeight: '100px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e50914';
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="submit" 
                style={{ 
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(45deg, #e50914, #f40612)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px 0 rgba(229, 9, 20, 0.4)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px 0 rgba(229, 9, 20, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px 0 rgba(229, 9, 20, 0.4)';
                }}
              >
                Přidat film
              </button>
              
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                style={{ 
                  flex: 1,
                  padding: '14px',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}