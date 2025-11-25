import { useState, useEffect } from 'react';
import { movieApi, ratingApi } from '../services/api';

interface Movie {
  id: number;
  title: string;
  description?: string;
  releaseYear?: number;
  genre?: string;
  director?: string;
  posterUrl?: string;
  createdAt?: string;
}
import RatingForm from './RatingForm';

interface Props {
  userId?: number;
  searchParams?: { title?: string; genre?: string; year?: number };
}

export default function MovieList({ userId, searchParams }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<number, number>>({});

  useEffect(() => {
    loadMovies();
  }, [searchParams]);

  const loadMovies = async () => {
    try {
      const { data } = searchParams
        ? await movieApi.search(searchParams.title, searchParams.genre, searchParams.year)
        : await movieApi.getAll();
      setMovies(data);
      data.forEach(movie => loadRating(movie.id));
    } catch (error) {
      console.error('Chyba při načítání filmů:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRating = async (movieId: number) => {
    try {
      const { data } = await ratingApi.getAverage(movieId);
      setRatings(prev => ({ ...prev, [movieId]: data }));
    } catch (error) {
      console.error('Chyba při načítání hodnocení:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Opravdu smazat film?')) return;
    try {
      await movieApi.delete(id);
      loadMovies();
    } catch (error) {
      console.error('Chyba při mazání filmu:', error);
    }
  };

  if (loading) return <div>Načítání...</div>;

  return (
    <div>
      <h2>Filmy</h2>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {movies.map((movie) => (
          <div key={movie.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
            <h3>{movie.title}</h3>
            <p>{movie.releaseYear} | {movie.genre}</p>
            <p>{movie.director}</p>
            <p>{movie.description}</p>
            {ratings[movie.id] !== undefined && (
              <p><strong>Hodnocení: {ratings[movie.id].toFixed(1)}/10</strong></p>
            )}
            {userId && <RatingForm movieId={movie.id} userId={userId} onSuccess={() => loadRating(movie.id)} />}
            <button onClick={() => handleDelete(movie.id)} style={{ marginTop: '0.5rem' }}>Smazat</button>
          </div>
        ))}
      </div>
    </div>
  );
}
