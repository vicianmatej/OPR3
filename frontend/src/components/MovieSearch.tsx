import { useState } from 'react';

interface Props {
  onSearch: (title?: string, genre?: string, year?: number) => void;
}

export default function MovieSearch({ onSearch }: Props) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');

  const handleSearch = (newTitle?: string, newGenre?: string, newYear?: string) => {
    if (!newTitle && !newGenre && !newYear) {
      onSearch(undefined, undefined, undefined);
    } else {
      onSearch(
        newTitle || undefined,
        newGenre || undefined,
        newYear ? Number(newYear) : undefined
      );
    }
  };

  return (
    <div style={{ padding: '20px 4%', marginBottom: '20px' }}>
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '150px' }}>
          <input
            type="text"
            placeholder=" "
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              handleSearch(e.target.value, genre, year);
            }}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#e50914'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
          />
          <label style={{
            position: 'absolute',
            left: '16px',
            top: title ? '-10px' : '12px',
            background: '#0a0a0a',
            padding: '0 4px',
            color: title ? '#e50914' : '#999',
            fontSize: title ? '12px' : '14px',
            transition: 'all 0.3s',
            pointerEvents: 'none'
          }}>
            Název filmu
          </label>
        </div>
        
        
        <div style={{ position: 'relative', minWidth: '100px' }}>
          <input
            type="number"
            placeholder=" "
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              handleSearch(title, genre, e.target.value);
            }}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#e50914'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
          />
          <label style={{
            position: 'absolute',
            left: '16px',
            top: year ? '-10px' : '12px',
            background: '#0a0a0a',
            padding: '0 4px',
            color: year ? '#e50914' : '#999',
            fontSize: year ? '12px' : '14px',
            transition: 'all 0.3s',
            pointerEvents: 'none'
          }}>
            Rok
          </label>
        </div>
        
        <button 
          onClick={() => handleSearch(title, genre, year)} 
          style={{ 
            padding: '12px 24px',
            background: '#e50914',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(229, 9, 20, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(229, 9, 20, 0.4)';
          }}
        >
          Hledat
        </button>
      </div>
    </div>
  );
}