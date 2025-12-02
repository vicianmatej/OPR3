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

  return (
    <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '800px', margin: '0 auto 2rem' }}>
      <h3>Vyhledat filmy</h3>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Název"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '0.5rem', flex: 1, minWidth: '150px' }}
        />
        <input
          type="text"
          placeholder="Žánr"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{ padding: '0.5rem', flex: 1, minWidth: '150px' }}
        />
        <input
          type="number"
          placeholder="Rok"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ padding: '0.5rem', flex: 1, minWidth: '100px' }}
        />
        <button onClick={handleSearch} style={{ padding: '0.5rem 1rem' }}>Hledat</button>
      </div>
    </div>
  );
}
