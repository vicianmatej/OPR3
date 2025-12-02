import { useState, useEffect } from 'react';
import { movieApi, ratingApi } from '../services/api';

import { Movie } from '../types';
import RatingForm from './RatingForm';
import MovieDetail from './MovieDetail';

interface Props {
  userId?: number;
  searchParams?: { title?: string; genre?: string; year?: number };
}

export default function MovieList({ userId, searchParams }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    loadMovies();
  }, [searchParams]);

  const loadMovies = async () => {
    try {
      const { data } = searchParams
        ? await movieApi.search(searchParams.title, searchParams.genre, searchParams.year)
        : await movieApi.getAll();
      setMovies(data);
    } catch (error) {
      console.error('Chyba při načítání filmů:', error);
    } finally {
      setLoading(false);
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
  if (selectedMovieId) return <MovieDetail movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />;

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
            {movie.averageRating && (
              <p><strong>⭐ {movie.averageRating.toFixed(1)}/5</strong> ({movie.ratingCount} hodnocení)</p>
            )}
            <button onClick={() => setSelectedMovieId(movie.id)}>Detail</button>
            {userId && <RatingForm movieId={movie.id} userId={userId} onSuccess={loadMovies} />}
            <button onClick={() => handleDelete(movie.id)} style={{ marginTop: '0.5rem' }}>Smazat</button>
          </div>
        ))}
      </div>
    </div>
  );
}
