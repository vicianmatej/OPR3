import { useEffect, useState } from 'react';
import { watchlistApi } from '../services/api';

interface WatchlistItem {
  id: number;
  movieId: number;
  movieTitle: string;
  posterUrl?: string;
  watched: boolean;
  addedAt: string;
}

export default function Watchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const response = await watchlistApi.getMy();
      setItems(response.data);
    } catch (error) {
      console.error('Chyba při načítání watchlistu:', error);
    }
  };

  const handleRemove = async (movieId: number) => {
    try {
      await watchlistApi.remove(movieId);
      loadWatchlist();
    } catch (error) {
      console.error('Chyba při odebírání z watchlistu:', error);
    }
  };

  const handleToggleWatched = async (movieId: number, watched: boolean) => {
    try {
      await watchlistApi.markWatched(movieId, !watched);
      loadWatchlist();
    } catch (error) {
      console.error('Chyba při změně stavu:', error);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '30px' }}>📋 Můj Watchlist</h2>
      {items.length === 0 ? (
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <p style={{ color: '#999', fontSize: '18px', margin: 0 }}>Watchlist je prázdný</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gap: '20px', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' 
        }}>
          {items.map(item => (
            <div 
              key={item.id} 
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.border = '1px solid rgba(229, 9, 20, 0.3)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(229, 9, 20, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
              }}
            >
              <div style={{ 
                width: '100%',
                height: '200px',
                background: item.posterUrl ? `url(${item.posterUrl})` : 'linear-gradient(135deg, #333 0%, #555 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '12px',
                marginBottom: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  height: '60px'
                }} />
              </div>
              
              <div>

                  <h3 style={{ 
                    color: '#fff', 
                    margin: '0 0 8px 0', 
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>{item.movieTitle}</h3>
                  
                  <p style={{ 
                    color: '#999', 
                    margin: '0 0 16px 0', 
                    fontSize: '14px' 
                  }}>
                    Přidáno: {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '16px',
                    gap: '12px'
                  }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={item.watched}
                        onChange={() => handleToggleWatched(item.movieId, item.watched)}
                        style={{
                          marginRight: '8px',
                          transform: 'scale(1.2)',
                          accentColor: '#e50914'
                        }}
                      />
                      {item.watched ? '✅ Zhlédnuto' : '⏳ Nezhlédnuto'}
                    </label>
                  </div>
                  
                  <button 
                    onClick={() => handleRemove(item.movieId)}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(229, 9, 20, 0.8)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
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
                    🗑️ Odebrat
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}