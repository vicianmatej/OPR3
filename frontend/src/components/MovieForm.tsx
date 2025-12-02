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

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
      <h2>Přidat film</h2>
      <input
        type="text"
        placeholder="Název"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
        style={{ display: 'block', margin: '0.5rem 0', padding: '0.5rem', width: '100%' }}
      />
      <textarea
        placeholder="Popis"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        style={{ display: 'block', margin: '0.5rem 0', padding: '0.5rem', width: '100%' }}
      />
      <input
        type="number"
        placeholder="Rok vydání"
        value={form.releaseYear || ''}
        onChange={(e) => setForm({ ...form, releaseYear: e.target.value ? Number(e.target.value) : undefined })}
        style={{ display: 'block', margin: '0.5rem 0', padding: '0.5rem', width: '100%' }}
      />
      <input
        type="text"
        placeholder="Žánr"
        value={form.genre}
        onChange={(e) => setForm({ ...form, genre: e.target.value })}
        style={{ display: 'block', margin: '0.5rem 0', padding: '0.5rem', width: '100%' }}
      />
      <input
        type="text"
        placeholder="Režisér"
        value={form.director}
        onChange={(e) => setForm({ ...form, director: e.target.value })}
        style={{ display: 'block', margin: '0.5rem 0', padding: '0.5rem', width: '100%' }}
      />
      <input
        type="text"
        placeholder="URL posteru"
        value={form.posterUrl}
        onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
        style={{ display: 'block', margin: '0.5rem 0', padding: '0.5rem', width: '100%' }}
      />
      <button type="submit" style={{ padding: '0.5rem 1rem', marginTop: '0.5rem' }}>Přidat</button>
    </form>
  );
}
