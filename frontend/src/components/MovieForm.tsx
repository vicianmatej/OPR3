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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await movieApi.create(form);
      setForm({ title: '', description: '', releaseYear: undefined, genre: '', director: '', posterUrl: '' });
      onSuccess();
    } catch (error) {
      console.error('Chyba při vytváření filmu:', error);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '15px 20px',
    margin: '10px 0',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  };

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '40px',
      marginTop: '60px',
      marginBottom: '40px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
    }}>
      <h2 style={{ 
        color: '#fff', 
        textAlign: 'center', 
        marginBottom: '30px',
        fontSize: '24px',
        fontWeight: '600'
      }}>Přidat nový film</h2>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <input
            type="text"
            placeholder="Název filmu"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
          
          <input
            type="number"
            placeholder="Rok vydání"
            value={form.releaseYear || ''}
            onChange={(e) => setForm({ ...form, releaseYear: e.target.value ? Number(e.target.value) : undefined })}
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <input
            type="text"
            placeholder="Žánr"
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
          
          <input
            type="text"
            placeholder="Režisér"
            value={form.director}
            onChange={(e) => setForm({ ...form, director: e.target.value })}
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
        </div>
        
        <input
          type="text"
          placeholder="URL posteru"
          value={form.posterUrl}
          onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
        />
        
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
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
        />
        
        <button 
          type="submit" 
          style={{ 
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(45deg, #e50914, #f40612)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '20px',
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
          Přidat film
        </button>
      </form>
    </div>
  );
}