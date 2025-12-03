import { useState } from 'react';

interface Props {
  onSearch: (title?: string, genre?: string, year?: number) => void;
}

export default function MovieSearch({ onSearch }: Props) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');

  const handleSearch = () => {
    onSearch(
      title || undefined,
      genre || undefined,
      year ? Number(year) : undefined
    );
  };

  const inputStyle = {
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    flex: 1,
    minWidth: '150px'
  };

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '30px',
      marginBottom: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)'
    }}>
      <h3 style={{ 
        color: '#fff', 
        textAlign: 'center', 
        marginBottom: '20px',
        fontSize: '20px',
        fontWeight: '600'
      }}>🔍 Vyhledat filmy</h3>
      
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        flexWrap: 'wrap',
        alignItems: 'end'
      }}>
        <input
          type="text"
          placeholder="Název filmu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          placeholder="Žánr"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
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
          placeholder="Rok"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{
            ...inputStyle,
            minWidth: '120px'
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
          onClick={handleSearch} 
          style={{ 
            padding: '12px 24px',
            background: 'linear-gradient(45deg, #e50914, #f40612)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px 0 rgba(229, 9, 20, 0.3)',
            minWidth: '100px'
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
          Hledat
        </button>
      </div>
    </div>
  );
}