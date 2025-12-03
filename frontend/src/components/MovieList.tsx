import { useState, useEffect } from 'react';
import { movieApi, ratingApi } from '../services/api';
import RatingForm from './RatingForm';
import MovieDetail from './MovieDetail';

interface Movie {
  id: number;
  title: string;
  description?: string;
  releaseYear?: number;
  genre?: string;
  director?: string;
  posterUrl?: string;
  averageRating?: number;
  ratingCount?: number;
}

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

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', padding: '40px' }}>Načítání...</div>;
  if (selectedMovieId) return <MovieDetail movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />;

  return (
    <div>
      <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '30px' }}>Filmy</h2>
      <div style={{ 
        display: 'grid', 
        gap: '24px', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' 
      }}>
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            style={{ 
              width: '300px',
              height: '400px',
              background: movie.posterUrl ? `url(${movie.posterUrl})` : 'linear-gradient(135deg, #333 0%, #555 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '20px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
              border: '2px solid transparent'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.border = '2px solid #e50914';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(229, 9, 20, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.border = '2px solid transparent';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
            }}
          >
            <div style={{
              position: 'absolute',
              inset: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column'
            }}>

              
              <h3 style={{ 
                color: '#fff', 
                margin: '0 0 8px 0', 
                fontSize: '18px',
                fontWeight: '600',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>{movie.title}</h3>
              
              <p style={{ 
                color: 'rgba(255,255,255,0.8)', 
                margin: '0 0 8px 0', 
                fontSize: '14px' 
              }}>{movie.releaseYear} | {movie.genre}</p>
              
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', 
                margin: '0 0 12px 0', 
                fontSize: '14px' 
              }}>{movie.director}</p>
              
              {movie.averageRating && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '16px' 
                }}>
                  <span style={{ color: '#FFD700', fontSize: '16px', marginRight: '8px' }}>⭐</span>
                  <span style={{ color: '#fff', fontWeight: '600' }}>
                    {movie.averageRating.toFixed(1)}/5
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '8px', fontSize: '12px' }}>
                    ({movie.ratingCount} hodnocení)
                  </span>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
                <button 
                  onClick={() => setSelectedMovieId(movie.id)}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(229, 9, 20, 0.8)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(229, 9, 20, 1)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(229, 9, 20, 0.8)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Detail
                </button>
                
                <button 
                  onClick={() => handleDelete(movie.id)}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Smazat
                </button>
              </div>
              
              {userId && (
                <div style={{ marginTop: '12px' }}>
                  <RatingForm movieId={movie.id} userId={userId} onSuccess={loadMovies} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}