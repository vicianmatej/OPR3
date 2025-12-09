import { useState, useEffect } from 'react';
import { movieApi, ratingApi, watchlistApi } from '../services/api';
import RatingForm from './RatingForm';
import MovieDetail from './MovieDetail';
import Toast from './Toast';

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
  onClearSearch?: () => void;
}

export default function MovieList({ userId, searchParams, onClearSearch }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

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

  const genres = ['Akční', 'Komedie', 'Drama', 'Thriller', 'Sci-Fi', 'Western', 'Krimi', 'Fantasy', 'Válečný'];
  
  const filteredMovies = selectedGenre 
    ? movies.filter(m => m.genre === selectedGenre)
    : movies;

  const handleDelete = async (id: number) => {
    if (!confirm('Opravdu smazat film?')) return;
    try {
      await movieApi.delete(id);
      loadMovies();
    } catch (error) {
      console.error('Chyba při mazání filmu:', error);
    }
  };

  const handleAddToWatchlist = async (movieId: number) => {
    try {
      await watchlistApi.add(movieId);
      setToast({ message: 'Film přidán do watchlistu', type: 'success' });
    } catch (error) {
      console.error('Chyba při přidávání do watchlistu:', error);
      setToast({ message: 'Chyba při přidávání do watchlistu', type: 'error' });
    }
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', padding: '40px' }}>Načítání...</div>;
  if (selectedMovieId) return <MovieDetail movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />;

  const sections = searchParams ? [
    { title: 'Výsledky vyhledávání', movies: filteredMovies }
  ] : selectedGenre ? [
    { title: selectedGenre, movies: filteredMovies }
  ] : [
    { title: 'Nově přidané', movies: filteredMovies.slice(0, 6) },
    { title: 'Doporučené pro vás', movies: filteredMovies.slice().reverse().slice(0, 6) },
    { title: 'Všechny filmy', movies: filteredMovies }
  ];

  return (
    <div style={{ padding: '0 4%' }}>
      <div style={{ 
        marginBottom: '30px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <span style={{ color: '#fff', fontSize: '16px', fontWeight: '600', marginRight: '10px' }}>Žánry:</span>
        <button
          onClick={() => setSelectedGenre(null)}
          style={{
            padding: '8px 16px',
            background: !selectedGenre ? '#e50914' : 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: !selectedGenre ? 'none' : '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          Všechny
        </button>
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={{
              padding: '8px 16px',
              background: selectedGenre === genre ? '#e50914' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: selectedGenre === genre ? 'none' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      {searchParams && onClearSearch && (
        <button
          onClick={onClearSearch}
          style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Zpět na hlavní stránku
        </button>
      )}
      
      {sections.map((section, idx) => (
        section.movies.length > 0 && (
          <div key={idx} style={{ marginBottom: '50px' }}>
            <h2 style={{ 
              color: '#fff', 
              fontSize: '24px', 
              marginBottom: '20px',
              fontWeight: '600'
            }}>{section.title}</h2>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              padding: '10px 0'
            }}>
              {section.movies.map((movie) => (
                <div 
                  key={movie.id}
                  onClick={() => setSelectedMovieId(movie.id)}
                  style={{ 
                    minWidth: '200px',
                    width: '200px',
                    height: '300px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
                    transform: 'translateY(0)',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.filter = 'drop-shadow(0 10px 15px rgba(229, 9, 20, 0.4))';
                    const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement;
                    if (overlay) overlay.style.opacity = '1';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.filter = 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))';
                    const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement;
                    if (overlay) overlay.style.opacity = '0';
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #333 0%, #555 100%)'
                  }}>
                    {movie.posterUrl && (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          position: 'absolute',
                          top: 0,
                          left: 0
                        }}
                      />
                    )}
                    <div 
                      className="overlay"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '20px',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <h3 style={{ 
                        color: '#fff', 
                        margin: '0 0 8px 0',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>{movie.title}</h3>
                      
                      <p style={{ 
                        color: '#ccc', 
                        margin: '0 0 12px 0',
                        fontSize: '12px'
                      }}>{movie.releaseYear} | {movie.genre}</p>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWatchlist(movie.id);
                        }}
                        style={{
                          padding: '8px 12px',
                          background: 'rgba(255,255,255,0.9)',
                          color: '#000',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        + Přidat do seznamu
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}